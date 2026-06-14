// Ebrostay — progressive enhancement: hero readability, audience switch, filters, maps, support and detail-page polish.
// Self-contained, dependency-light, and respects reduced-motion.
(function () {
  "use strict";

  var AUDIENCE_KEY = "ebrostay-audience";
  var AUDIENCES = ["tenant", "owner"];
  var SAVED_HASH = "#saved";

  var COPY = {
    es: {
      navHome: "Inicio",
      saved: "Guardadas",
      savedEmpty: "Todavía no has guardado viviendas.",
      savedShowing: "Viviendas guardadas",
      allHomes: "Ver todas",
      clearFilters: "Limpiar filtros",
      extraFilters: "Más filtros",
      address: "Dirección o zona",
      addressPlaceholder: "Movera, Universidad, Pedro II...",
      bedrooms: "Habitaciones mínimas",
      bathrooms: "Baños mínimos",
      any: "Cualquiera",
      audienceLabel: "Versión del sitio",
      chooser: "Elige cómo quieres usar Ebrostay",
      tenant: "Inquilino",
      tenantHint: "Busco vivienda",
      owner: "Propietario",
      ownerHint: "Quiero alquilar",
      tenantChip: "Versión inquilino activa",
      ownerChip: "Versión propietario seleccionada",
      tenantStatus: "Estás viendo la versión para inquilinos.",
      tenantCopy: "Busca viviendas verificadas, compara condiciones y solicita tu estancia en Zaragoza.",
      tenantCta: "Empezar búsqueda",
      ownerStatus: "Has cambiado a la ruta para propietarios.",
      ownerCopy: "Descubre cómo Ebrostay gestiona tu vivienda de principio a fin y te paga en tu cuenta.",
      ownerCta: "Abrir página para propietarios",
      benefits: [
        ["home", "Totalmente amueblado"],
        ["headphones", "Soporte 24/7"],
        ["file-check", "Contrato redactado"],
        ["sparkles", "Limpieza y entrada"],
        ["shield-check", "Incidencias gestionadas"],
        ["wallet-cards", "Pago claro"]
      ],
      howTitle: "Elige, solicita y entra.",
      howCopy: "Como reservar un hotel, pero para estancias de 1 a 12 meses: fechas claras, vivienda lista y soporte durante toda la estancia.",
      whyTitle: "Alquiler de media estancia, tan sencillo como reservar un hotel.",
      whyLead: "Viviendas listas para entrar, condiciones claras y ayuda humana cuando la necesitas. Menos texto, menos fricción, más certezas.",
      contactKicker: "Chat directo",
      contactTitle: "Habla con Ebrostay ahora.",
      contactCopy: "Déjanos nombre, email y mensaje. Abrimos WhatsApp o email con todo preparado para que no tengas que esperar.",
      name: "Nombre",
      email: "Email",
      message: "¿Qué necesitas?",
      messagePlaceholder: "Fechas, personas, presupuesto, vivienda o gestión de propiedad...",
      chatWhatsapp: "Enviar por WhatsApp",
      chatEmail: "Enviar por email",
      assistantTitle: "Asistente Ebrostay",
      assistantOpen: "Ayuda",
      assistantClose: "Cerrar",
      assistantLead: "¿Tienes dudas al reservar o publicar una vivienda? Te ayudamos por WhatsApp o email.",
      legal: "Ebrostay trata tus datos solo para responder a tu solicitud y gestionar reservas o servicios. Consulta la política de privacidad para información legal, GDPR y derechos.",
      galleryHint: "Doble clic en la foto para abrir la galería",
      photos: "Fotos",
      floorplans: "Planos",
      video: "Vídeo",
      urgency: "Alta demanda",
      urgencyCopy: "Vivienda visitada varias veces recientemente. Solicita disponibilidad antes de que se bloquee.",
      reviews: "Transparencia",
      reviewsCopy: "Viviendas verificadas, condiciones claras y soporte documentado. Reseñas públicas próximamente.",
      trustpilot: "Trustpilot / Google Reviews próximamente",
      shareWhatsapp: "WhatsApp",
      shareLinkedin: "LinkedIn",
      shareCopy: "Copiar enlace",
      furnishing: "Servicio de amueblamiento para propietarios",
      moving: "Asistencia de entrada y salida"
    },
    en: {
      navHome: "Home",
      saved: "Saved",
      savedEmpty: "You have not saved any homes yet.",
      savedShowing: "Saved homes",
      allHomes: "Show all",
      clearFilters: "Clear filters",
      extraFilters: "More filters",
      address: "Address or area",
      addressPlaceholder: "Movera, University, Pedro II...",
      bedrooms: "Min. bedrooms",
      bathrooms: "Min. bathrooms",
      any: "Any",
      audienceLabel: "Website version",
      chooser: "Choose how you want to use Ebrostay",
      tenant: "Tenant",
      tenantHint: "I need a home",
      owner: "Owner",
      ownerHint: "I want to rent out",
      tenantChip: "Tenant version active",
      ownerChip: "Owner version selected",
      tenantStatus: "You are viewing the tenant version.",
      tenantCopy: "Search verified homes, compare conditions and request your stay in Zaragoza.",
      tenantCta: "Start searching",
      ownerStatus: "You switched to the owner path.",
      ownerCopy: "See how Ebrostay manages your property end to end and pays you directly.",
      ownerCta: "Open owner page",
      benefits: [
        ["home", "Fully furnished"],
        ["headphones", "24/7 support"],
        ["file-check", "Contract drafting"],
        ["sparkles", "Cleaning & move-in"],
        ["shield-check", "Issues managed"],
        ["wallet-cards", "Clear payment"]
      ],
      howTitle: "Pick, request, move in.",
      howCopy: "As simple as booking a hotel, but for 1–12 month stays: clear dates, move-in-ready homes and support throughout.",
      whyTitle: "Mid-stay renting, as simple as booking a hotel.",
      whyLead: "Move-in-ready homes, clear conditions and human help when you need it. Less text, less friction, more certainty.",
      contactKicker: "Direct chat",
      contactTitle: "Talk to Ebrostay now.",
      contactCopy: "Leave your name, email and message. We open WhatsApp or email with everything prepared so you do not have to wait.",
      name: "Name",
      email: "Email",
      message: "What do you need?",
      messagePlaceholder: "Dates, people, budget, home or property management...",
      chatWhatsapp: "Send by WhatsApp",
      chatEmail: "Send by email",
      assistantTitle: "Ebrostay assistant",
      assistantOpen: "Help",
      assistantClose: "Close",
      assistantLead: "Need help booking or listing a property? We can help by WhatsApp or email.",
      legal: "Ebrostay uses your data only to answer your request and manage bookings or services. See the privacy policy for legal, GDPR and rights information.",
      galleryHint: "Double-click the photo to open the gallery",
      photos: "Photos",
      floorplans: "Floor plans",
      video: "Video",
      urgency: "High demand",
      urgencyCopy: "This home has been viewed several times recently. Request availability before it is blocked.",
      reviews: "Transparency",
      reviewsCopy: "Verified homes, clear conditions and documented support. Public reviews coming soon.",
      trustpilot: "Trustpilot / Google Reviews coming soon",
      shareWhatsapp: "WhatsApp",
      shareLinkedin: "LinkedIn",
      shareCopy: "Copy link",
      furnishing: "Furnishing service for owners",
      moving: "Move-in and move-out support"
    }
  };

  function getLanguage() {
    var activeButton = document.querySelector(".language-option.is-active[data-lang]");
    var language = activeButton?.dataset.lang || document.documentElement.lang || localStorage.getItem("ebrostay-language") || "es";
    return COPY[language] ? language : "es";
  }

  function c(key) {
    var language = getLanguage();
    return COPY[language][key] || COPY.es[key] || key;
  }

  function dict(key) {
    try {
      var language = getLanguage();
      if (typeof translations !== "undefined") return translations[language]?.[key] || translations.es?.[key] || key;
    } catch (error) {
      // Ignore missing dictionaries on static fallback pages.
    }
    return key;
  }

  function setText(selectorOrElement, text) {
    var element = typeof selectorOrElement === "string" ? document.querySelector(selectorOrElement) : selectorOrElement;
    if (element) element.textContent = text;
  }

  function getStoredAudience() {
    var stored = localStorage.getItem(AUDIENCE_KEY);
    return AUDIENCES.indexOf(stored) >= 0 ? stored : "tenant";
  }

  function favoriteIds() {
    try { return new Set(JSON.parse(localStorage.getItem("ebrostay-favorites") || "[]")); }
    catch { return new Set(); }
  }

  function whatsappUrl(message) {
    var number = typeof WHATSAPP_NUMBER !== "undefined" ? WHATSAPP_NUMBER : "34678715418";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  }

  function playBrandChirp() {
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var ctx = new AudioCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.11);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.17);
      setTimeout(function () { ctx.close?.(); }, 260);
    } catch {
      // Audio is optional and user-gesture dependent.
    }
  }

  function injectStyles() {
    if (document.getElementById("ebrostay-feedback-styles")) return;
    var style = document.createElement("style");
    style.id = "ebrostay-feedback-styles";
    style.textContent = `
      :root {
        --display: "Hanken Grotesque", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      }

      h1, h2, h3, .brand-wordmark, .button, .nav-links, .nav-cta {
        font-family: "Hanken Grotesque", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      }

      .hero-overlay {
        background:
          linear-gradient(90deg, rgba(10, 51, 36, 0.92), rgba(13, 29, 24, 0.58) 52%, rgba(13, 29, 24, 0.18)),
          linear-gradient(0deg, rgba(10, 20, 17, 0.82), rgba(10, 20, 17, 0.16) 54%);
      }

      .hero .eyebrow,
      .section-kicker,
      .detail-content .section-kicker,
      .property-title-row .section-kicker {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        max-width: 100%;
        border-radius: var(--radius-pill);
        color: var(--green-900);
        background: rgba(236, 246, 239, 0.95);
        border: 1px solid rgba(31, 138, 87, 0.16);
        padding: 6px 10px;
        font-size: clamp(0.74rem, 0.94vw, 0.84rem);
        line-height: 1.1;
        letter-spacing: 0.035em;
        text-shadow: none;
      }

      .hero .eyebrow {
        gap: 8px;
        margin-bottom: 10px;
        padding: 7px 11px;
        background: rgba(250, 249, 246, 0.94);
        border-color: rgba(250, 249, 246, 0.72);
        box-shadow: 0 10px 28px rgba(10, 20, 17, 0.20);
      }

      .hero .eyebrow::before {
        content: "";
        flex: 0 0 auto;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 0 4px rgba(31, 138, 87, 0.14);
      }

      .hero h1,
      .hero-copy {
        text-shadow: 0 2px 18px rgba(10, 20, 17, 0.38);
      }

      .hero-copy {
        color: rgba(255, 255, 255, 0.94);
      }

      .audience-selector {
        width: min(620px, 100%);
        margin: 0 0 16px;
        border: 1px solid rgba(250, 249, 246, 0.58);
        border-radius: 16px;
        padding: 9px;
        background: rgba(250, 249, 246, 0.94);
        color: var(--ink);
        box-shadow: 0 14px 34px rgba(10, 20, 17, 0.22);
        backdrop-filter: blur(16px);
      }

      .audience-selector-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
      }

      .audience-selector-label {
        color: var(--muted);
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }

      .audience-active-chip {
        border-radius: var(--radius-pill);
        padding: 4px 9px;
        background: rgba(31, 138, 87, 0.12);
        color: var(--green-700);
        font-size: 0.74rem;
        font-weight: 900;
        white-space: nowrap;
      }

      .audience-toggle {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        overflow: hidden;
        border: 1px solid rgba(10, 51, 36, 0.12);
        border-radius: var(--radius-pill);
        padding: 3px;
        background: rgba(10, 51, 36, 0.08);
      }

      .audience-toggle::before {
        content: "";
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 3px;
        width: calc(50% - 3px);
        border-radius: var(--radius-pill);
        background: var(--grad-primary);
        box-shadow: var(--shadow-brand);
        transform: translateX(0);
        transition: transform 360ms var(--ease-spring), box-shadow 240ms var(--ease-out);
      }

      .audience-toggle.is-owner::before { transform: translateX(100%); }

      .audience-toggle-button {
        position: relative;
        z-index: 1;
        display: grid;
        gap: 0;
        min-height: 46px;
        border: 0;
        border-radius: var(--radius-pill);
        padding: 7px 10px;
        color: var(--ink-soft);
        background: transparent;
        text-align: center;
        cursor: pointer;
        transition: color 200ms var(--ease-out), transform 200ms var(--ease-out);
      }

      .audience-toggle-button:hover { transform: translateY(-1px); }
      .audience-toggle-button.is-active { color: #fff; }
      .audience-role { font-size: clamp(0.9rem, 1.1vw, 1rem); font-weight: 950; line-height: 1.08; }
      .audience-role-hint { color: var(--muted); font-size: 0.7rem; font-weight: 800; line-height: 1.12; }
      .audience-toggle-button.is-active .audience-role-hint { color: rgba(255, 255, 255, 0.82); }

      .audience-status {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
        margin: 8px 2px 0;
        color: var(--muted);
        font-size: 0.86rem;
        font-weight: 700;
      }

      .audience-status strong { color: var(--ink); font-weight: 950; }
      .audience-link { color: var(--green-700); font-weight: 950; text-decoration: none; }
      .audience-link:hover { text-decoration: underline; }

      .audience-selector.is-first-visit .audience-toggle-button.is-active {
        animation: audience-active-pulse 2.2s var(--ease-out) 3;
      }

      @keyframes audience-active-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(31, 138, 87, 0); }
        35% { box-shadow: 0 0 0 7px rgba(31, 138, 87, 0.16); }
      }

      .hero-benefits {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        width: min(760px, 100%);
        margin: 18px 0 4px;
      }

      .benefit-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 14px;
        padding: 9px 11px;
        color: #fff;
        background: rgba(255, 255, 255, 0.11);
        backdrop-filter: blur(10px);
        font-size: 0.88rem;
        font-weight: 850;
      }

      .benefit-chip i,
      .benefit-chip svg { width: 18px; height: 18px; color: #fff; opacity: 0.95; }

      .trust-row { gap: 8px; }
      .trust-row span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        border-radius: 14px;
        padding: 7px 10px;
        pointer-events: none;
      }
      .trust-row span::before { content: "✓"; font-weight: 950; color: #9ee0bd; }

      .saved-flats-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 8px 12px;
        color: var(--green-700);
        background: #fff;
        font-size: 0.9rem;
        font-weight: 850;
        text-decoration: none;
        white-space: nowrap;
      }

      .saved-flats-link[data-count="0"] .saved-count { display: none; }
      .saved-count {
        display: inline-grid;
        place-items: center;
        min-width: 20px;
        height: 20px;
        border-radius: 99px;
        padding: 0 6px;
        color: #fff;
        background: var(--green);
        font-size: 0.76rem;
      }

      .quick-filters [data-quick="deposit"] { display: none !important; }
      .clear-filters-inline { margin-left: auto; }

      .filter-enhancements {
        display: grid;
        gap: 12px;
        border-top: 1px solid var(--line);
        padding-top: 14px;
      }

      .filter-enhancements-title {
        color: var(--green-700);
        font-size: 0.82rem;
        font-weight: 950;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .extra-filter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .extra-amenities { display: flex; flex-wrap: wrap; gap: 7px; }
      .extra-amenities label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 7px 10px;
        color: var(--muted);
        background: #fff;
        font-size: 0.78rem;
        font-weight: 850;
      }
      .extra-amenities input { width: 14px; min-height: 14px; accent-color: var(--green); }

      .property-card[hidden] { display: none !important; }
      .property-card .property-badges span,
      .detail-content .property-badges span { font-size: 0.72rem; }
      .property-card .property-meta span,
      .detail-content .property-meta span { font-size: 0.76rem; }
      .property-body p { font-size: 0.92rem; }
      .property-card .amenity-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(86px, max-content)); }
      .property-card .amenity-list span::before { content: "• "; color: var(--green); }

      .map-panel { position: sticky; top: 92px; }
      .map-card { border-radius: var(--radius-lg); overflow: hidden; }
      .google-map-wrap { min-height: 620px; }
      .google-map-wrap::after,
      .detail-map::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(135deg, rgba(31, 138, 87, 0.10), rgba(217, 99, 42, 0.04));
        mix-blend-mode: multiply;
        z-index: 500;
      }
      .google-map-wrap .leaflet-container,
      .detail-map .leaflet-container { filter: saturate(0.88) sepia(0.08); }
      .map-addresses { display: none !important; }
      .map-copy { border-top: 1px solid var(--line); }

      @media (min-width: 1081px) {
        .marketplace-layout { grid-template-columns: 265px minmax(390px, 1fr) minmax(420px, 0.95fr); }
      }

      .value-band { padding: clamp(48px, 7vw, 86px) clamp(20px, 5vw, 62px); }
      .value-band .section-kicker { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.92); border-color: rgba(255,255,255,0.22); }
      .value-lead { max-width: 820px; font-size: clamp(1.05rem, 1.7vw, 1.28rem); }
      .value-card p { font-size: 0.94rem; }
      .value-badge { display: none !important; }
      .how-section { grid-template-columns: 1fr; gap: 22px; text-align: center; }
      .how-section .steps { max-width: 860px; margin: 0 auto; }
      .how-section .steps article { min-height: 150px; display: grid; place-items: center; text-align: center; }
      .how-section .steps p { display: none; }

      .contact-chat-card {
        display: grid;
        gap: 12px;
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        padding: clamp(18px, 4vw, 28px);
        background: #fff;
        box-shadow: 0 10px 28px rgba(24, 33, 29, 0.07);
      }
      .chat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .chat-actions { display: flex; flex-wrap: wrap; gap: 10px; }
      .chat-actions .button { flex: 1 1 180px; }

      .support-fab {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 80;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: var(--radius-pill);
        padding: 12px 16px;
        color: #fff;
        background: var(--green);
        font-weight: 900;
        box-shadow: var(--shadow-brand);
        cursor: pointer;
      }

      .support-panel {
        position: fixed;
        right: 18px;
        bottom: 78px;
        z-index: 80;
        width: min(380px, calc(100vw - 36px));
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        padding: 18px;
        background: #fff;
        box-shadow: var(--shadow);
      }
      .support-panel[hidden] { display: none !important; }
      .support-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px; }
      .support-head strong { color: var(--ink); font-size: 1.05rem; }
      .support-close { border: 0; background: transparent; color: var(--muted); font-weight: 900; cursor: pointer; }

      .site-footer { flex-wrap: wrap; }
      .footer-legal {
        flex-basis: 100%;
        border-top: 1px solid var(--line);
        padding-top: 12px;
        color: var(--muted);
        font-size: 0.82rem;
      }

      .detail-media {
        background-size: contain !important;
        background-repeat: no-repeat !important;
        background-color: #f4f2ec;
        cursor: zoom-in;
      }
      .detail-media::after {
        content: attr(data-gallery-hint);
        position: absolute;
        right: 14px;
        bottom: 14px;
        border-radius: var(--radius-pill);
        padding: 8px 11px;
        background: rgba(10, 51, 36, 0.86);
        color: #fff;
        font-size: 0.78rem;
        font-weight: 850;
      }
      .detail-gallery { display: flex !important; overflow-x: auto; gap: 10px; padding: 10px 0 0; }
      .gallery-thumb { flex: 0 0 78px; height: 58px; background-size: cover; background-position: center; border-radius: 10px; border: 2px solid transparent; }
      .gallery-thumb.is-active { border-color: var(--green); }

      .detail-media-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 12px 0 0;
      }
      .detail-media-tabs a,
      .detail-media-tabs button {
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 9px 12px;
        color: var(--green-700);
        background: #fff;
        font-weight: 850;
        text-decoration: none;
        cursor: pointer;
      }
      #floorplanSection {
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        padding: 22px;
        background: #fff;
        box-shadow: 0 10px 28px rgba(24, 33, 29, 0.07);
      }

      .detail-trust-grid { display:grid; gap:10px; margin: 12px 0; }
      .detail-trust-box {
        border: 1px solid var(--line);
        border-radius: 12px;
        padding: 12px;
        background: var(--mist);
        color: var(--ink);
      }
      .detail-trust-box strong { display:block; color: var(--green-700); font-size:0.9rem; }
      .detail-trust-box span { display:block; margin-top:3px; color: var(--muted); font-size:0.84rem; font-weight:700; }

      .share-options { display:flex; flex-wrap:wrap; gap:8px; margin-top: 8px; }
      .share-options a, .share-options button {
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 8px 10px;
        color: var(--green-700);
        background:#fff;
        font-size:0.84rem;
        font-weight:850;
        text-decoration:none;
        cursor:pointer;
      }

      .booking-widget { gap: 10px; }
      .booking-widget h4 { font-size: 0.96rem; letter-spacing: 0.025em; }
      .booking-widget label { font-size: 0.82rem; }
      .booking-widget input, .booking-widget textarea { min-height: 42px; border-radius: 12px; font-size: 0.94rem; }
      .movein-rows li, .booking-note { font-size: 0.86rem; line-height: 1.35; }
      #bookingVatTip { border-radius: 12px; padding: 10px; background: var(--mist); }

      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: grid;
        grid-template-rows: auto 1fr auto;
        gap: 12px;
        padding: 18px;
        background: rgba(10, 20, 17, 0.88);
      }
      .lightbox[hidden] { display:none !important; }
      .lightbox img { max-width: 100%; max-height: calc(100vh - 150px); object-fit: contain; margin: auto; border-radius: 14px; background: #fff; }
      .lightbox-bar { display:flex; align-items:center; justify-content:space-between; gap:10px; color:#fff; }
      .lightbox-actions { display:flex; gap:10px; justify-content:center; }
      .lightbox button { border:0; border-radius: var(--radius-pill); padding: 10px 14px; color: var(--green-900); background:#fff; font-weight:900; cursor:pointer; }

      body[data-page="owners"] a[href="partner.html"] { display: none !important; }

      @media (prefers-reduced-motion: reduce) {
        .audience-selector.is-first-visit .audience-toggle-button.is-active { animation: none; }
        .audience-toggle::before, .audience-toggle-button { transition: none; }
      }

      @media (max-width: 1080px) {
        .google-map-wrap { min-height: 440px; }
      }

      @media (max-width: 820px) {
        .hero .eyebrow { white-space: normal; font-size: clamp(0.78rem, 3.2vw, 0.9rem); padding: 7px 10px; }
        .audience-selector { margin-bottom: 14px; padding: 8px; }
        .audience-selector-head, .audience-status { align-items: flex-start; flex-direction: column; }
        .audience-active-chip { white-space: normal; }
        .audience-toggle-button { min-height: 42px; padding: 6px 8px; }
        .hero-benefits { grid-template-columns: 1fr 1fr; }
        .benefit-chip { font-size: 0.78rem; min-height: 40px; padding: 8px; }
        .extra-filter-grid, .chat-grid { grid-template-columns: 1fr; }
        .clear-filters-inline { margin-left: 0; width: 100%; }
        .support-fab { right: 12px; bottom: 12px; }
        .support-panel { right: 12px; bottom: 70px; width: min(360px, calc(100vw - 24px)); }
      }
    `;
    document.head.appendChild(style);
  }

  function initAudienceSwitch() {
    var heroContent = document.querySelector(".hero-content");
    var anchor = heroContent?.querySelector(".eyebrow");
    if (!heroContent || !anchor || document.querySelector("[data-audience-selector]")) return;

    var firstVisit = !localStorage.getItem(AUDIENCE_KEY);
    var mode = getStoredAudience();
    var selector = document.createElement("div");
    selector.className = "audience-selector";
    selector.setAttribute("data-audience-selector", "");
    selector.innerHTML = `
      <div class="audience-selector-head">
        <span class="audience-selector-label"></span>
        <span class="audience-active-chip"></span>
      </div>
      <div class="audience-toggle" role="group">
        <button class="audience-toggle-button" type="button" data-audience-value="tenant" aria-pressed="false">
          <span class="audience-role"></span>
          <span class="audience-role-hint"></span>
        </button>
        <button class="audience-toggle-button" type="button" data-audience-value="owner" aria-pressed="false">
          <span class="audience-role"></span>
          <span class="audience-role-hint"></span>
        </button>
      </div>
      <p class="audience-status" role="status">
        <strong></strong>
        <span></span>
        <a class="audience-link"></a>
      </p>
    `;
    anchor.insertAdjacentElement("afterend", selector);

    var toggle = selector.querySelector(".audience-toggle");
    var buttons = selector.querySelectorAll("[data-audience-value]");
    var label = selector.querySelector(".audience-selector-label");
    var chip = selector.querySelector(".audience-active-chip");
    var statusStrong = selector.querySelector(".audience-status strong");
    var statusCopy = selector.querySelector(".audience-status span");
    var statusLink = selector.querySelector(".audience-link");

    function render() {
      var isOwner = mode === "owner";
      document.body.dataset.ebrostayAudience = mode;
      selector.classList.toggle("is-first-visit", firstVisit && mode === "tenant");
      toggle.classList.toggle("is-owner", isOwner);
      toggle.setAttribute("aria-label", c("chooser"));
      label.textContent = c("audienceLabel");
      chip.textContent = isOwner ? c("ownerChip") : c("tenantChip");
      statusStrong.textContent = isOwner ? c("ownerStatus") : c("tenantStatus");
      statusCopy.textContent = isOwner ? c("ownerCopy") : c("tenantCopy");
      statusLink.textContent = isOwner ? c("ownerCta") : c("tenantCta");
      statusLink.href = isOwner ? "owners.html" : "#search";
      buttons.forEach(function (button) {
        var value = button.dataset.audienceValue;
        var active = value === mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
        button.querySelector(".audience-role").textContent = value === "owner" ? c("owner") : c("tenant");
        button.querySelector(".audience-role-hint").textContent = value === "owner" ? c("ownerHint") : c("tenantHint");
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        mode = AUDIENCES.indexOf(button.dataset.audienceValue) >= 0 ? button.dataset.audienceValue : "tenant";
        firstVisit = false;
        localStorage.setItem(AUDIENCE_KEY, mode);
        playBrandChirp();
        render();
      });
    });

    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () { window.setTimeout(render, 0); });
    });

    render();
  }

  function initNavPolish() {
    function apply() {
      document.querySelectorAll('[data-i18n="nav.search"]').forEach(function (link) {
        link.textContent = c("navHome");
        if (link.getAttribute("href")?.includes("#search")) link.setAttribute("href", link.getAttribute("href").replace("#search", "#top"));
      });
      var headerActions = document.querySelector(".header-actions");
      if (headerActions && !document.querySelector(".saved-flats-link")) {
        var saved = document.createElement("a");
        saved.className = "saved-flats-link";
        saved.href = "index.html" + SAVED_HASH;
        saved.innerHTML = `<span>♡</span><span class="saved-label"></span><span class="saved-count"></span>`;
        var authButton = document.querySelector("#authButton") || document.querySelector(".nav-cta");
        headerActions.insertBefore(saved, authButton || headerActions.firstChild);
      }
      updateSavedLink();
      if (location.pathname.endsWith("/owners.html") || location.pathname.endsWith("owners.html")) document.body.dataset.page = "owners";
    }

    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () { window.setTimeout(apply, 0); });
    });
    apply();
  }

  function updateSavedLink() {
    var link = document.querySelector(".saved-flats-link");
    if (!link) return;
    var count = favoriteIds().size;
    link.dataset.count = String(count);
    setText(link.querySelector(".saved-label"), c("saved"));
    setText(link.querySelector(".saved-count"), String(count));
  }

  function initHeroBenefits() {
    var search = document.querySelector(".hero-search");
    if (!search || document.querySelector(".hero-benefits")) return;
    var strip = document.createElement("div");
    strip.className = "hero-benefits";
    strip.innerHTML = c("benefits").map(function (item) {
      return `<span class="benefit-chip"><i data-lucide="${item[0]}"></i>${item[1]}</span>`;
    }).join("");
    search.insertAdjacentElement("beforebegin", strip);
  }

  function initFilterImprovements() {
    var form = document.querySelector("#availabilityFilter");
    var quickFilters = document.querySelector(".quick-filters");
    if (!form) return;

    if (quickFilters && !document.querySelector(".clear-filters-inline")) {
      var clear = document.createElement("button");
      clear.className = "details-button clear-filters-inline";
      clear.type = "button";
      clear.textContent = c("clearFilters");
      clear.addEventListener("click", function () {
        document.querySelector("#resetAvailability")?.click();
        resetExtraFilters();
      });
      quickFilters.appendChild(clear);
    }

    if (!form.querySelector(".filter-enhancements")) {
      var box = document.createElement("div");
      box.className = "filter-enhancements";
      box.innerHTML = `
        <strong class="filter-enhancements-title">${c("extraFilters")}</strong>
        <label><span>${c("address")}</span><input name="extraAddress" type="search" placeholder="${c("addressPlaceholder")}"></label>
        <div class="extra-filter-grid">
          <label><span>${c("bedrooms")}</span><select name="extraBedrooms"><option value="">${c("any")}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
          <label><span>${c("bathrooms")}</span><select name="extraBathrooms"><option value="">${c("any")}</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label>
        </div>
        <div class="extra-amenities">
          ${["dishwasher", "heating", "ac", "washer", "lift", "parking", "terrace", "balcony"].map(function (key) {
            return `<label><input type="checkbox" name="extraAmenities" value="${key}"><span>${dict("amenity." + key)}</span></label>`;
          }).join("")}
        </div>
      `;
      var reset = form.querySelector("#resetAvailability");
      if (reset) reset.insertAdjacentElement("beforebegin", box);
      else form.appendChild(box);
      box.addEventListener("input", applyExtraFilters);
      box.addEventListener("change", applyExtraFilters);
    }

    var grid = document.querySelector("#propertyGrid");
    if (grid) {
      var observer = new MutationObserver(function () { window.requestAnimationFrame(applyExtraFilters); });
      observer.observe(grid, { childList: true });
    }

    window.addEventListener("hashchange", applyExtraFilters);
    applyExtraFilters();
  }

  function resetExtraFilters() {
    var form = document.querySelector("#availabilityFilter");
    if (!form) return;
    ["extraAddress", "extraBedrooms", "extraBathrooms"].forEach(function (name) {
      if (form.elements[name]) form.elements[name].value = "";
    });
    form.querySelectorAll('[name="extraAmenities"]').forEach(function (input) { input.checked = false; });
    if (location.hash === SAVED_HASH) history.replaceState(null, "", location.pathname + location.search + "#search");
    applyExtraFilters();
  }

  function propertyMatchesExtra(property, extra) {
    if (!property) return true;
    var haystack = [
      property.id,
      property.addressKey,
      dict(property.nameKey),
      dict(property.areaKey),
      property.address || "",
      property.city || ""
    ].join(" ").toLowerCase();
    if (extra.address && !haystack.includes(extra.address)) return false;
    if (extra.bedrooms && Number(property.bedrooms || 0) < Number(extra.bedrooms)) return false;
    if (extra.bathrooms && Number(property.bathrooms || 0) < Number(extra.bathrooms)) return false;
    if (extra.amenities.some(function (amenity) { return !(property.amenities || []).includes(amenity); })) return false;
    return true;
  }

  function applyExtraFilters() {
    var grid = document.querySelector("#propertyGrid");
    var form = document.querySelector("#availabilityFilter");
    if (!grid) return;
    var savedMode = location.hash === SAVED_HASH;
    var saved = favoriteIds();
    var extra = {
      address: (form?.elements.extraAddress?.value || "").toLowerCase().trim(),
      bedrooms: form?.elements.extraBedrooms?.value || "",
      bathrooms: form?.elements.extraBathrooms?.value || "",
      amenities: Array.from(form?.querySelectorAll('[name="extraAmenities"]:checked') || []).map(function (input) { return input.value; })
    };
    var visible = 0;
    grid.querySelectorAll(".property-card").forEach(function (card) {
      var id = card.dataset.propertyId;
      var property = Array.isArray(window.properties) ? window.properties.find(function (item) { return item.id === id; }) : null;
      var show = (!savedMode || saved.has(id)) && propertyMatchesExtra(property, extra);
      card.hidden = !show;
      if (show) visible += 1;
    });
    var status = document.querySelector("#availabilityStatus");
    if (status && savedMode) status.textContent = visible ? `${c("savedShowing")}: ${visible}` : c("savedEmpty");
    updateSavedLink();
  }

  function initMapImprovements() {
    document.querySelectorAll(".map-addresses").forEach(function (element) { element.hidden = true; });
  }

  function initHomepageCopyPolish() {
    var value = document.querySelector(".value-band");
    if (value) {
      setText(value.querySelector("h2"), c("whyTitle"));
      setText(value.querySelector(".value-lead"), c("whyLead"));
      var cards = value.querySelectorAll(".value-card");
      var short = getLanguage() === "es" ? [
        ["Reserva fácil", "Elige fechas y solicita sin llamadas."],
        ["Precio claro", "Renta, fianza y condiciones visibles."],
        ["Gestión completa", "Contrato, cobros, llaves y soporte."],
        ["Ayuda humana", "WhatsApp y email cuando lo necesites."]
      ] : [
        ["Easy request", "Pick dates and request without calls."],
        ["Clear price", "Rent, deposit and conditions up front."],
        ["Full handling", "Contract, payments, keys and support."],
        ["Human help", "WhatsApp and email when needed."]
      ];
      cards.forEach(function (card, i) {
        if (!short[i]) return;
        setText(card.querySelector("h3"), short[i][0]);
        setText(card.querySelector("p"), short[i][1]);
      });
    }
    var how = document.querySelector(".how-section");
    if (how) {
      setText(how.querySelector("h2"), c("howTitle"));
      var p = how.querySelector("p:not(.section-kicker)") || document.createElement("p");
      p.textContent = c("howCopy");
      p.className = "value-lead";
      if (!p.parentElement) how.querySelector("div")?.appendChild(p);
    }
  }

  function initContactChat() {
    var contact = document.querySelector("#contact");
    var form = document.querySelector("#inquiryForm");
    if (contact && form && !document.querySelector(".contact-chat-card")) {
      var card = document.createElement("section");
      card.className = "contact-chat-card";
      card.innerHTML = chatMarkup("contact");
      form.insertAdjacentElement("beforebegin", card);
      card.addEventListener("click", handleChatClick);
      setText(contact.querySelector(".section-kicker"), c("contactKicker"));
      setText(contact.querySelector("h2"), c("contactTitle"));
      setText(contact.querySelector(".contact-copy p:not(.section-kicker)"), c("contactCopy"));
    }

    if (!document.querySelector(".support-fab")) {
      var fab = document.createElement("button");
      fab.className = "support-fab";
      fab.type = "button";
      fab.innerHTML = `<i data-lucide="message-circle"></i><span>${c("assistantOpen")}</span>`;
      var panel = document.createElement("section");
      panel.className = "support-panel";
      panel.hidden = true;
      panel.innerHTML = `<div class="support-head"><strong>${c("assistantTitle")}</strong><button class="support-close" type="button">×</button></div><p>${c("assistantLead")}</p>${chatMarkup("support")}`;
      document.body.appendChild(fab);
      document.body.appendChild(panel);
      fab.addEventListener("click", function () { panel.hidden = !panel.hidden; playBrandChirp(); });
      panel.querySelector(".support-close").addEventListener("click", function () { panel.hidden = true; });
      panel.addEventListener("click", handleChatClick);
    }
  }

  function chatMarkup(prefix) {
    return `
      <div class="chat-grid">
        <label><span>${c("name")}</span><input data-chat-name="${prefix}" autocomplete="name"></label>
        <label><span>${c("email")}</span><input data-chat-email="${prefix}" type="email" autocomplete="email"></label>
      </div>
      <label><span>${c("message")}</span><textarea data-chat-message="${prefix}" rows="3" placeholder="${c("messagePlaceholder")}"></textarea></label>
      <div class="chat-actions">
        <a class="button whatsapp-button" href="#" data-chat-send="whatsapp" data-chat-prefix="${prefix}">${c("chatWhatsapp")}</a>
        <a class="button ghost" href="#" data-chat-send="email" data-chat-prefix="${prefix}">${c("chatEmail")}</a>
      </div>
    `;
  }

  function handleChatClick(event) {
    var trigger = event.target.closest("[data-chat-send]");
    if (!trigger) return;
    var prefix = trigger.dataset.chatPrefix;
    var root = trigger.closest(".contact-chat-card, .support-panel") || document;
    var name = root.querySelector(`[data-chat-name="${prefix}"]`)?.value?.trim() || "";
    var email = root.querySelector(`[data-chat-email="${prefix}"]`)?.value?.trim() || "";
    var message = root.querySelector(`[data-chat-message="${prefix}"]`)?.value?.trim() || "";
    var body = `Nombre / Name: ${name}\nEmail: ${email}\n\n${message || c("messagePlaceholder")}`;
    if (trigger.dataset.chatSend === "whatsapp") trigger.href = whatsappUrl(body);
    else trigger.href = `mailto:${typeof CONTACT_EMAIL !== "undefined" ? CONTACT_EMAIL : "info@ebrostay.com"}?subject=${encodeURIComponent("Ebrostay")}&body=${encodeURIComponent(body)}`;
  }

  function initFooterLegal() {
    var footer = document.querySelector(".site-footer");
    if (footer && !footer.querySelector(".footer-legal")) {
      var legal = document.createElement("p");
      legal.className = "footer-legal";
      legal.textContent = c("legal");
      footer.appendChild(legal);
    }
  }

  function initDetailEnhancements() {
    if (!document.querySelector(".detail-page")) return;
    var media = document.querySelector("#detailMedia");
    if (media) media.dataset.galleryHint = c("galleryHint");
    addDetailTabs();
    addDetailTrustBoxes();
    addShareOptions();
    initLightbox();
    enhanceDetailText();
    setTimeout(function () {
      addDetailTabs();
      addDetailTrustBoxes();
      addShareOptions();
      enhanceDetailText();
    }, 600);
  }

  function addDetailTabs() {
    var media = document.querySelector("#detailMedia");
    if (!media || document.querySelector(".detail-media-tabs")) return;
    var tabs = document.createElement("div");
    tabs.className = "detail-media-tabs";
    tabs.innerHTML = `
      <button type="button" data-open-gallery>${c("photos")}</button>
      <a href="#floorplanSection">${c("floorplans")}</a>
      <a class="detail-video-tab" href="#" hidden target="_blank" rel="noopener">${c("video")}</a>
    `;
    media.insertAdjacentElement("afterend", tabs);
    tabs.querySelector("[data-open-gallery]").addEventListener("click", openLightbox);
    var videoButton = document.querySelector("#detailVideoButton");
    var videoTab = tabs.querySelector(".detail-video-tab");
    if (videoButton && !videoButton.hidden && videoButton.href) {
      videoTab.hidden = false;
      videoTab.href = videoButton.href;
    }
  }

  function addDetailTrustBoxes() {
    var card = document.querySelector(".detail-request-card");
    if (!card || card.querySelector(".detail-trust-grid")) return;
    var grid = document.createElement("div");
    grid.className = "detail-trust-grid";
    grid.innerHTML = `
      <div class="detail-trust-box"><strong>${c("urgency")}</strong><span>${c("urgencyCopy")}</span></div>
      <div class="detail-trust-box"><strong>${c("reviews")}</strong><span>${c("reviewsCopy")}</span></div>
      <div class="detail-trust-box"><strong>${c("trustpilot")}</strong></div>
    `;
    var share = card.querySelector("#shareButton");
    if (share) share.insertAdjacentElement("afterend", grid);
    else card.prepend(grid);
  }

  function addShareOptions() {
    var share = document.querySelector("#shareButton");
    if (!share || document.querySelector(".share-options, #detailShareActions")) return;
    var wrap = document.createElement("div");
    wrap.className = "share-options";
    var url = encodeURIComponent(window.location.href);
    var text = encodeURIComponent(document.title || "Ebrostay");
    wrap.innerHTML = `
      <a href="${whatsappUrl(window.location.href)}" target="_blank" rel="noopener">${c("shareWhatsapp")}</a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" target="_blank" rel="noopener">${c("shareLinkedin")}</a>
      <button type="button" data-copy-current-link>${c("shareCopy")}</button>
    `;
    share.insertAdjacentElement("afterend", wrap);
    wrap.querySelector("[data-copy-current-link]").addEventListener("click", function () {
      navigator.clipboard?.writeText(window.location.href);
    });
  }

  function enhanceDetailText() {
    var detail = document.querySelector("#detailDetails");
    var amenities = Array.from(document.querySelectorAll("#detailAmenities span")).map(function (s) { return s.textContent.trim(); }).filter(Boolean);
    if (detail && amenities.length && !detail.dataset.enhanced) {
      detail.dataset.enhanced = "true";
      var highlights = amenities.slice(0, 7).join(" · ");
      detail.textContent = detail.textContent + " " + (getLanguage() === "es" ? "Características destacadas: " : "Key features: ") + highlights + ".";
    }
  }

  function galleryImages() {
    var imgs = [];
    document.querySelectorAll(".gallery-thumb").forEach(function (thumb) {
      var bg = thumb.style.backgroundImage || "";
      var match = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) imgs.push(match[1]);
    });
    var mediaBg = document.querySelector("#detailMedia")?.style.backgroundImage || "";
    var mediaMatches = mediaBg.match(/url\(["']?([^"')]+)["']?\)/g) || [];
    mediaMatches.forEach(function (value) {
      var match = value.match(/url\(["']?([^"')]+)["']?\)/);
      if (match && !imgs.includes(match[1])) imgs.unshift(match[1]);
    });
    return imgs;
  }

  function initLightbox() {
    if (!document.querySelector("#detailMedia") || document.querySelector(".lightbox") || document.querySelector("#detailLightbox")) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    box.innerHTML = `
      <div class="lightbox-bar"><strong>Ebrostay</strong><button type="button" data-lightbox-close>×</button></div>
      <img alt="Ebrostay gallery image">
      <div class="lightbox-actions"><button type="button" data-lightbox-prev>‹</button><button type="button" data-lightbox-next>›</button></div>
    `;
    document.body.appendChild(box);
    var index = 0;
    function show(i) {
      var imgs = galleryImages();
      if (!imgs.length) return;
      index = (i + imgs.length) % imgs.length;
      box.querySelector("img").src = imgs[index];
      box.hidden = false;
    }
    window.__ebrostayOpenLightbox = function () { show(0); };
    box.querySelector("[data-lightbox-close]").addEventListener("click", function () { box.hidden = true; });
    box.querySelector("[data-lightbox-prev]").addEventListener("click", function () { show(index - 1); });
    box.querySelector("[data-lightbox-next]").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (event) { if (event.target === box) box.hidden = true; });
    document.querySelector("#detailMedia").addEventListener("dblclick", function () { show(0); });
  }

  function openLightbox() {
    if (typeof window.__ebrostayOpenLightbox === "function") window.__ebrostayOpenLightbox();
  }


  function injectSection2Styles() {
    if (document.getElementById("ebrostay-section2-styles")) return;
    var style = document.createElement("style");
    style.id = "ebrostay-section2-styles";
    style.textContent = `
      [data-lucide]:empty { display: none !important; }
      .audience-selector.is-first-visit { animation: section2-audience-pop 900ms cubic-bezier(.2,.8,.2,1) both, section2-audience-glow 2.8s ease-in-out 3; }
      @keyframes section2-audience-pop { 0% { opacity: 0; transform: translateY(14px) scale(.96); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes section2-audience-glow { 0%, 100% { box-shadow: 0 14px 34px rgba(10, 20, 17, .22), 0 0 0 0 rgba(200, 241, 105, 0); } 45% { box-shadow: 0 18px 44px rgba(10, 20, 17, .28), 0 0 0 8px rgba(200, 241, 105, .22); } }
      .property-list { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); align-items: start; }
      .property-card { position: relative !important; display: block !important; aspect-ratio: 1 / 1 !important; min-height: 360px; overflow: hidden; border-radius: 10px; background: #fff; }
      .property-card[hidden] { display: none !important; }
      .property-media { position: absolute !important; inset: 0; min-height: 0 !important; height: auto !important; background-position: center !important; background-size: cover !important; transition: transform .35s ease; }
      .property-card:hover .property-media { transform: scale(1.025); }
      .property-card-hit { position: absolute; inset: 54px 54px 118px 54px; z-index: 2; border-radius: 10px; }
      .property-body { position: absolute; z-index: 3; left: 12px; right: 12px; bottom: 12px; display: grid !important; gap: 7px !important; max-height: min(52%, 230px); overflow: hidden; padding: 12px !important; border: 1px solid rgba(255,255,255,.62); border-radius: 10px; background: rgba(255,255,255,.93); box-shadow: 0 12px 30px rgba(24,33,29,.18); backdrop-filter: blur(14px); }
      .property-title-row { grid-template-columns: 1fr; gap: 5px !important; }
      .property-title-row .section-kicker { font-size: .68rem !important; padding: 4px 8px !important; }
      .property-title-row h3 { font-size: clamp(1rem, 1.4vw, 1.16rem); line-height: 1.08; }
      .property-price { justify-items: start; }
      .property-body > p { display: none; }
      .property-badges { display: none !important; }
      .property-meta { gap: 5px !important; }
      .property-meta span { padding: 4px 7px !important; font-size: .72rem !important; }
      .property-card .amenity-list { display: flex !important; flex-wrap: nowrap !important; gap: 5px !important; overflow: hidden; }
      .property-card .amenity-list span { flex: 0 0 auto; border-radius: 999px; padding: 4px 7px; color: var(--green-700); background: rgba(236,246,239,.96); font-size: .72rem !important; font-weight: 850; }
      .property-card .amenity-list span::before { content: none !important; }
      .property-actions { justify-content: flex-end; }
      .property-actions .button { min-height: 38px; padding: 9px 14px; }
      .property-photo-arrow { position: absolute; z-index: 5; top: 46%; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.76); border-radius: 50%; color: var(--ink); background: rgba(255,255,255,.9); box-shadow: 0 10px 24px rgba(24,33,29,.18); font-size: 1.6rem; line-height: 1; cursor: pointer; }
      .property-photo-arrow.is-prev { left: 12px; }
      .property-photo-arrow.is-next { right: 12px; }
      .property-photo-count { position: absolute; z-index: 5; right: 14px; top: 54px; border-radius: 999px; padding: 5px 8px; color: #fff; background: rgba(24,33,29,.58); font-size: .75rem; font-weight: 850; }
      .map-tools { display: grid; grid-template-columns: max-content max-content 1fr; gap: 8px; align-items: center; padding: 0 16px 16px; }
      .map-area-status { color: var(--muted); font-size: .84rem; font-weight: 760; }
      .listings-map.is-drawing-area { cursor: crosshair; }
      .map-addresses { display: none !important; }
      .detail-media { position: relative; min-height: min(74vh, 680px) !important; background-size: cover !important; background-position: center !important; }
      .detail-media::after { content: none !important; }
      .detail-media-arrow, .lightbox-arrow { position: absolute; z-index: 8; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border: 1px solid rgba(255,255,255,.72); border-radius: 50%; color: var(--ink); background: rgba(255,255,255,.92); box-shadow: 0 12px 28px rgba(24,33,29,.22); font-size: 1.8rem; cursor: pointer; }
      .detail-media-arrow.is-prev, .lightbox-arrow.is-prev { left: 18px; }
      .detail-media-arrow.is-next, .lightbox-arrow.is-next { right: 18px; }
      .detail-media-counter { position: absolute; right: 18px; bottom: 18px; z-index: 8; border-radius: 999px; padding: 7px 10px; color: #fff; background: rgba(24,33,29,.62); font-weight: 900; }
      .detail-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(88px, 1fr)); gap: 8px; margin: 12px auto 0; width: min(1180px, calc(100% - 38px)); }
      .gallery-thumb { min-height: 72px; border-radius: 8px; background-size: cover; background-position: center; }
      .detail-lightbox[hidden] { display: none !important; }
      .detail-lightbox { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: 28px; background: rgba(10,20,17,.88); }
      .detail-lightbox img { max-width: min(1100px, 92vw); max-height: 86vh; border-radius: 8px; object-fit: contain; box-shadow: 0 24px 80px rgba(0,0,0,.35); }
      .lightbox-close { position: fixed; top: 18px; right: 18px; z-index: 121; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,.62); border-radius: 50%; color: #fff; background: rgba(255,255,255,.12); font-size: 1.6rem; cursor: pointer; }
      .detail-content .amenity-grid { display: grid !important; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px !important; }
      .detail-content .amenity-grid span { display: flex; align-items: center; min-height: 44px; border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; background: #fff; color: var(--ink); font-weight: 850; }
      .share-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
      .share-label { display: inline-grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; color: #fff; background: var(--ink); font-weight: 950; }
      .share-chip { display: inline-flex; align-items: center; gap: 7px; min-height: 42px; border: 1px solid var(--line); border-radius: 999px; padding: 8px 12px; color: var(--ink); background: #fff; font-weight: 850; text-decoration: none; cursor: pointer; }
      .share-chip strong { display: inline-grid; place-items: center; min-width: 22px; height: 22px; border-radius: 50%; color: #fff; background: var(--green); font-size: .78rem; }
      .share-linkedin strong { background: #0a66c2; }
      .share-whatsapp strong { background: #1da851; }
      .booking-included { display: grid; gap: 10px; border: 1px solid rgba(47,107,85,.16); border-radius: 8px; padding: 12px; background: rgba(236,246,239,.62); }
      .booking-included h5 { margin: 0; color: var(--green); font-size: .92rem; }
      .booking-included-grid { display: grid; gap: 8px; }
      .booking-included-grid span { display: grid; gap: 2px; padding-left: 18px; position: relative; }
      .booking-included-grid span::before { content: "✓"; position: absolute; left: 0; top: 0; color: var(--green); font-weight: 950; }
      .booking-included-grid small { color: var(--muted); line-height: 1.28; }
      @media (max-width: 760px) { .property-card { min-height: 390px; } .property-card-hit { inset: 54px 50px 160px 50px; } .map-tools { grid-template-columns: 1fr; } .detail-media { min-height: 58vh !important; } }
    `;
    document.head.appendChild(style);
  }

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
  }

  function initReveals() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var selectors = [
      ".audience-selector", ".hero-benefits", ".value-band > *", ".split-card", ".feature-card", ".steps article",
      ".compare-wrap", ".stat", ".partner-metric", ".how-section > div", ".contact-copy", ".contact-chat-card",
      ".inquiry-form", ".about-intro > *", ".about-cta > *", ".value-grid", ".marketplace-toolbar"
    ];
    var nodes = document.querySelectorAll(selectors.join(","));
    if (!nodes.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) { el.classList.add("reveal", "is-in"); });
      return;
    }
    nodes.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var sibs = Array.prototype.slice.call(el.parentElement ? el.parentElement.children : []);
          var idx = Math.max(0, sibs.indexOf(el));
          el.style.transitionDelay = Math.min(idx * 70, 350) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    nodes.forEach(function (el) { io.observe(el); });
  }

  function refreshTextAfterLanguageChange() {
    initNavPolish();
    initHomepageCopyPolish();
    document.querySelectorAll(".hero-benefits").forEach(function (el) { el.remove(); });
    initHeroBenefits();
    document.querySelectorAll(".contact-chat-card, .support-fab, .support-panel").forEach(function (el) { el.remove(); });
    initContactChat();
    initFooterLegal();
    initDetailEnhancements();
    initIcons();
  }

  function boot() {
    injectStyles();
    injectSection2Styles();
    initAudienceSwitch();
    initNavPolish();
    initHeroBenefits();
    initFilterImprovements();
    initMapImprovements();
    initHomepageCopyPolish();
    initContactChat();
    initFooterLegal();
    initDetailEnhancements();
    initIcons();
    initReveals();
    document.querySelectorAll("[data-lang]").forEach(function (button) {
      button.addEventListener("click", function () { window.setTimeout(refreshTextAfterLanguageChange, 0); });
    });
    window.addEventListener("storage", updateSavedLink);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
