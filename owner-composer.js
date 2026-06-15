(function () {
  const form = document.querySelector("#ownerListingForm");
  if (!form) return;

  const DRAFT_KEY = "ebrostay-owner-listing-draft";
  const status = document.querySelector("[data-owner-draft-status]");
  const summary = document.querySelector("[data-owner-photo-summary]");
  const description = form.querySelector("[data-owner-description]");
  const photoInputs = Array.from(document.querySelectorAll("[data-owner-photo]"));
  const photoNames = {};

  const serviceKeys = {
    wifi: "amenity.wifi",
    desk: "amenity.desk",
    lift: "amenity.lift",
    ac: "amenity.ac",
    heating: "amenity.heating",
    kitchen: "amenity.kitchen",
    bills: "badge.bills",
    deposit: "badge.deposit"
  };

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "es";
  }

  function tr(key) {
    try {
      return translations[lang()]?.[key] || translations.es?.[key] || key;
    } catch {
      return key;
    }
  }

  function field(name) {
    return form.elements[name];
  }

  function selectedServices() {
    return Array.from(form.querySelectorAll('input[name="services"]:checked'))
      .map((input) => tr(serviceKeys[input.value] || input.value));
  }

  function uploadedRooms() {
    return photoInputs
      .filter((input) => photoNames[input.dataset.ownerPhoto])
      .map((input) => tr(input.dataset.roomLabel));
  }

  function draftSnapshot() {
    const services = Array.from(form.querySelectorAll('input[name="services"]:checked')).map((input) => input.value);
    return {
      title: field("title")?.value || "",
      address: field("address")?.value || "",
      price: field("price")?.value || "",
      available: field("available")?.value || "",
      bedrooms: field("bedrooms")?.value || "",
      bathrooms: field("bathrooms")?.value || "",
      capacity: field("capacity")?.value || "",
      type: field("type")?.value || "apartment",
      services,
      description: description?.value || "",
      photoNames
    };
  }

  function saveDraft() {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftSnapshot()));
    } catch {
      /* Storage can fail in private browsing; the UI still works. */
    }
  }

  function restoreDraft() {
    let draft = null;
    try {
      draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    } catch {
      draft = null;
    }
    if (!draft) return;
    ["title", "address", "price", "available", "bedrooms", "bathrooms", "capacity", "type"].forEach((name) => {
      if (field(name) && draft[name] != null) field(name).value = draft[name];
    });
    if (description && draft.description) {
      description.value = draft.description;
      description.dataset.generated = "true";
    }
    form.querySelectorAll('input[name="services"]').forEach((input) => {
      input.checked = Array.isArray(draft.services) && draft.services.includes(input.value);
    });
    if (draft.photoNames) Object.assign(photoNames, draft.photoNames);
  }

  function ensureTitle() {
    const title = field("title");
    if (!title || (title.value.trim() && title.dataset.generated !== "true")) return;
    const address = field("address")?.value.trim();
    title.value = lang() === "en"
      ? (address ? `Furnished flat in ${address}` : "Furnished flat in Zaragoza")
      : (address ? `Piso amueblado en ${address}` : "Piso amueblado en Zaragoza");
    title.dataset.generated = "true";
  }

  function generatedDescription() {
    const address = field("address")?.value.trim();
    const price = field("price")?.value.trim();
    const bedrooms = field("bedrooms")?.value.trim();
    const bathrooms = field("bathrooms")?.value.trim();
    const capacity = field("capacity")?.value.trim();
    const available = field("available")?.value.trim();
    const services = selectedServices();
    const rooms = uploadedRooms();

    if (lang() === "en") {
      const lines = [
        `${address ? `Furnished mid-stay home in ${address}` : "Furnished mid-stay home in Zaragoza"}, prepared for verified tenants and managed by Ebrostay.`,
        bedrooms || bathrooms || capacity
          ? `Layout: ${bedrooms || "0"} bedrooms, ${bathrooms || "0"} bathrooms, and capacity for up to ${capacity || "1"} people.`
          : "Layout details will be completed from the uploaded photos and owner notes.",
        services.length ? `Included highlights: ${services.join(", ")}.` : "Add services to complete the listing highlights.",
        rooms.length ? `Photos received for: ${rooms.join(", ")}.` : "Upload room photos to populate the visual checklist.",
        price ? `Suggested monthly price: ${price} EUR/month.` : "Add a monthly price to prepare the booking card.",
        available ? `Available from ${available}.` : "Add the available-from date before publishing."
      ];
      return lines.join("\n");
    }

    const lines = [
      `${address ? `Vivienda amueblada de media estancia en ${address}` : "Vivienda amueblada de media estancia en Zaragoza"}, preparada para inquilinos verificados y gestionada por Ebrostay.`,
      bedrooms || bathrooms || capacity
        ? `Distribucion: ${bedrooms || "0"} dormitorios, ${bathrooms || "0"} banos y capacidad para hasta ${capacity || "1"} personas.`
        : "La distribucion se completara con las fotos y notas del propietario.",
      services.length ? `Incluye: ${services.join(", ")}.` : "Anade servicios para completar los puntos destacados del anuncio.",
      rooms.length ? `Fotos recibidas de: ${rooms.join(", ")}.` : "Sube fotos de cada estancia para completar la revision visual.",
      price ? `Precio mensual sugerido: ${price} EUR/mes.` : "Anade el precio mensual para preparar la tarjeta de reserva.",
      available ? `Disponible desde ${available}.` : "Anade la fecha de disponibilidad antes de publicar."
    ];
    return lines.join("\n");
  }

  function updateGeneratedText(force) {
    ensureTitle();
    if (description && (force || !description.value.trim() || description.dataset.generated === "true")) {
      description.value = generatedDescription();
      description.dataset.generated = "true";
    }
  }

  function updateSummary() {
    const rooms = uploadedRooms();
    if (summary) {
      summary.textContent = rooms.length
        ? tr("ownerPost.readyWithPhotos").replace("{count}", rooms.length).replace("{rooms}", rooms.join(", "))
        : tr("ownerPost.readyCopy");
    }
    if (status && !status.classList.contains("is-success")) {
      status.textContent = tr("ownerPost.draftHint");
    }
  }

  function handlePhoto(input) {
    const file = input.files?.[0];
    if (!file) return;
    photoNames[input.dataset.ownerPhoto] = file.name;
    const slot = input.closest(".owner-photo-slot");
    if (slot) {
      const url = URL.createObjectURL(file);
      slot.style.setProperty("--owner-photo-url", `url("${url}")`);
      slot.classList.add("has-photo");
      slot.dataset.fileName = file.name;
    }
    updateGeneratedText(true);
    updateSummary();
    saveDraft();
  }

  restoreDraft();
  updateGeneratedText(false);
  updateSummary();

  photoInputs.forEach((input) => {
    input.addEventListener("change", () => handlePhoto(input));
  });

  form.addEventListener("input", (event) => {
    if (event.target === description) {
      description.dataset.generated = "false";
    } else if (event.target === field("title")) {
      field("title").dataset.generated = "false";
    } else {
      updateGeneratedText(false);
    }
    status?.classList.remove("is-success");
    updateSummary();
    saveDraft();
  });

  form.addEventListener("change", (event) => {
    if (!event.target.matches("[data-owner-photo]")) {
      updateGeneratedText(false);
      updateSummary();
      saveDraft();
    }
  });

  document.querySelector("[data-owner-regenerate]")?.addEventListener("click", () => {
    updateGeneratedText(true);
    updateSummary();
    saveDraft();
  });

  document.querySelector("[data-owner-start]")?.addEventListener("click", () => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => field("title")?.focus(), 320);
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => window.setTimeout(updateSummary, 0));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    updateGeneratedText(false);
    saveDraft();
    if (status) {
      status.textContent = tr("ownerPost.saved");
      status.classList.add("is-success");
    }
  });
})();
