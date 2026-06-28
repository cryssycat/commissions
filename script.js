// =============================
// CONFIG
// =============================
const ENDPOINT = "https://commissions.crysthigpen.workers.dev/commissions";

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  loadCommissions();
});

// =============================
// LOAD COMMISSIONS
// =============================
async function loadCommissions() {
  const container = document.getElementById("commission-container");

  if (!container) {
    console.error("Missing #commission-container in HTML");
    return;
  }

  container.innerHTML = "<p>Loading commissions...</p>";

  try {
    const res = await fetch(ENDPOINT);
    const data = await res.json();

    // 🛡 Always force array safety
    const commissions = Array.isArray(data) ? data : [];

    renderCommissions(commissions, container);

  } catch (err) {
    console.error("Commission loading error:", err);
    container.innerHTML = "<p>Failed to load commissions.</p>";
  }
}

// =============================
// RENDER COMMISSIONS
// =============================
function renderCommissions(data, container) {
  // 🛡 extra safety layer
  if (!Array.isArray(data)) {
    console.warn("renderCommissions expected array but got:", data);
    data = [];
  }

  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No commissions available.</p>";
    return;
  }

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "commission-card";

    card.innerHTML = `
      <h3>${escapeHTML(item.title || "Untitled")}</h3>
      <p>${escapeHTML(item.description || "")}</p>
      <span class="price">${escapeHTML(item.price || "")}</span>
      <span class="status">${escapeHTML(item.status || "open")}</span>
    `;

    container.appendChild(card);
  });
}

// =============================
// SAFE HTML (prevents broken rendering)
// =============================
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
