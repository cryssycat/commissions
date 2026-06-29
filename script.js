// =============================
// CONFIG
// =============================
const ENDPOINT = "https://commissions.crysthigpen.workers.dev/commissions";

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", loadCommissions);

// =============================
// LOAD DATA
// =============================
async function loadCommissions() {
  const container = document.getElementById("commission-container");

  if (!container) {
    console.error("Missing #commission-container in HTML");
    return;
  }

  container.innerHTML = "<p class='loading'>Loading commissions...</p>";

  try {
    const res = await fetch(ENDPOINT);
    const data = await res.json();

    const commissions = Array.isArray(data) ? data : [];

    renderCommissions(commissions, container);

  } catch (err) {
    console.error("Commission loading error:", err);
    container.innerHTML = "<p class='error'>Failed to load commissions.</p>";
  }
}

// =============================
// RENDER CARDS
// =============================
function renderCommissions(items, container) {
  if (!Array.isArray(items)) items = [];

  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p class='empty'>No commissions available.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "commission-card";

    const img = item.image
      ? `<img class="commission-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy">`
      : `<div class="commission-img placeholder"></div>`;

    card.innerHTML = `
      ${img}
      <div class="commission-content">
        <h3>${escapeHTML(item.title || "Untitled")}</h3>
        <p>${escapeHTML(item.description || "")}</p>
        
        <div class="commission-meta">
          <span class="price">${escapeHTML(item.price || "")}</span>
          <span class="status status-${escapeHTML(item.status || "open")}">
            ${escapeHTML(item.status || "open")}
          </span>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

// =============================
// HTML ESCAPE SAFETY
// =============================
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
