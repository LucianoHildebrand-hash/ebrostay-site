// AI helper for the property editor, powered by DeepSeek (OpenAI-compatible API).
// Auth: Supabase JWT. Only admins or owners may call it. No data is written —
// it only transforms text the editor sends.
//
// Actions:
//   - "extract": parse a pasted document (from a PDF or text file) into the
//     listing fields, producing both Spanish and English for every text field.
//   - "translate": translate one field value between Spanish and English.
//
// Set DEEPSEEK_API_KEY as an Edge Function secret. The model can be overridden
// with DEEPSEEK_MODEL (defaults to the cheap deepseek-v4-flash).
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const MODEL = Deno.env.get("DEEPSEEK_MODEL") || "deepseek-v4-flash";
const MAX_INPUT = 24000;

const TYPE_KEYS = ["apartment", "room", "home"];
const ENERGY_RATINGS = ["A", "B", "C", "D", "E", "F", "G"];
const AMENITY_KEYS = ["wifi", "desk", "balcony", "lift", "ac", "heating", "kitchen", "terrace", "washer", "dishwasher", "tv", "microwave", "oven", "parking"];

const STRING_FIELDS = [
  "name", "area_es", "area_en", "copy_es", "copy_en", "details_es", "details_en",
  "beds_es", "beds_en", "price_note_es", "price_note_en", "city", "address"
];
const NUMBER_FIELDS = [
  "guests", "bedrooms", "bathrooms", "size_m2", "floor_number", "price_number",
  "deposit_amount", "upfront_rent_eur", "utilities_cap_eur", "min_stay_months", "max_stay_months"
];

async function callDeepseek(apiKey: string, messages: unknown[], jsonMode: boolean) {
  const response = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.2,
      max_tokens: 2000,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {})
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`deepseek ${response.status}: ${detail.slice(0, 200)}`);
  }
  const data = await response.json();
  return String(data.choices?.[0]?.message?.content || "");
}

function sanitizeFields(obj: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  if (!obj || typeof obj !== "object") return out;
  for (const key of STRING_FIELDS) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) out[key] = value.trim();
  }
  for (const key of NUMBER_FIELDS) {
    const value = obj[key];
    const num = Number(value);
    if (value != null && value !== "" && Number.isFinite(num)) out[key] = num;
  }
  const type = obj.type;
  if (typeof type === "string" && TYPE_KEYS.includes(type)) out.type = type;
  const energy = obj.energy_rating;
  if (typeof energy === "string" && ENERGY_RATINGS.includes(energy.toUpperCase())) {
    out.energy_rating = energy.toUpperCase();
  }
  if (Array.isArray(obj.amenities)) {
    const list = [...new Set(
      obj.amenities.filter((value): value is string => typeof value === "string" && AMENITY_KEYS.includes(value))
    )];
    if (list.length) out.amenities = list;
  }
  return out;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) return json({ error: "ai_not_configured" }, 503);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return json({ error: "unauthorized" }, 401);

    const { data: profile } = await admin
      .from("profiles")
      .select("is_admin, is_owner, deactivated_at")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile || profile.deactivated_at) return json({ error: "unauthorized" }, 401);
    if (!profile.is_admin && !profile.is_owner) return json({ error: "forbidden" }, 403);

    const body = await req.json();
    const action = body?.action;

    if (action === "translate") {
      const text = String(body.text || "").slice(0, MAX_INPUT);
      if (!text.trim()) return json({ text: "" });
      const source = body.source === "en" ? "English" : "Spanish";
      const target = body.target === "en" ? "English" : "Spanish";
      const messages = [
        {
          role: "system",
          content: `You translate text for a furnished mid-term rental listing site in Zaragoza, Spain. Translate the user's text from ${source} to ${target}. Preserve the meaning, tone, and any numbers, currencies and units exactly. Do not add, remove or explain anything. Return only the translated text, with no surrounding quotes.`
        },
        { role: "user", content: text }
      ];
      const out = await callDeepseek(apiKey, messages, false);
      return json({ text: out.trim() });
    }

    if (action === "extract") {
      const text = String(body.text || "").slice(0, MAX_INPUT);
      if (!text.trim()) return json({ fields: {} });
      const system = `You extract structured data for a furnished mid-term rental listing in Zaragoza, Spain, from the document the user pastes. Return ONLY a JSON object (no markdown fences) using any of these keys you can confidently infer; omit keys you cannot determine. Provide BOTH Spanish and English for every text field.
Keys:
- name (string, a short listing title)
- type (one of: ${TYPE_KEYS.join(", ")})
- guests, bedrooms, bathrooms, size_m2, floor_number (plain numbers; floor 0 = ground)
- price_number, deposit_amount, upfront_rent_eur, utilities_cap_eur (plain numbers in EUR, no symbols)
- min_stay_months, max_stay_months (plain numbers)
- energy_rating (one of ${ENERGY_RATINGS.join(", ")})
- area_es, area_en (short neighbourhood/area label)
- copy_es, copy_en (one short sentence describing the home)
- details_es, details_en (a full description paragraph)
- beds_es, beds_en (bed configuration, e.g. "2 camas dobles y 1 individual")
- price_note_es, price_note_en (short optional price note)
- city (string), address (street and number, only if clearly present)
- amenities (array, only from this set: ${AMENITY_KEYS.join(", ")})
Rules: stay truthful to the document — never invent amenities, prices or numbers. If a text value exists in only one language, translate it for the other.`;
      const messages = [
        { role: "system", content: system },
        { role: "user", content: text }
      ];
      const out = await callDeepseek(apiKey, messages, true);
      let parsed: Record<string, unknown> = {};
      try { parsed = JSON.parse(out); } catch { parsed = {}; }
      return json({ fields: sanitizeFields(parsed) });
    }

    return json({ error: "bad_request" }, 400);
  } catch (error) {
    console.error("ai-property-assistant error", error);
    return json({ error: "server_error" }, 500);
  }
});
