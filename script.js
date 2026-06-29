/* =========================
   STARBREW COMMISSIONS UI
   PRODUCTION CLEAN VERSION
========================= */

const ENDPOINT = "https://commissions.crysthigpen.workers.dev";

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  initCommissions();
  initForm();
});

/* =========================
   COMMISSIONS LOADER
========================= */
async function initCommissions() {
  const container = document.getElementById("commission-container");

  if (!container) {
    console.error("Missing #commission-container");
    return;
  }

  try {
    const res = await fetch(`${ENDPOINT}/commissions`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid commissions response:", data);
      container.innerHTML = "<p>No commissions available.</p>";
      return;
    }

    renderCommissions(data, container);

  } catch (err) {
    console.error("Commission load error:", err);
    container.innerHTML = "<p class='error'>Failed to load commissions.</p>";
  }
}

/* =========================
   RENDER COMMISSIONS
========================= */
function renderCommissions(items, container) {
  container.innerHTML = "";

  if (!items.length) {
    container.innerHTML = "<p>No commissions available.</p>";
    return;
  }

  const html = items.map(item => `
    <div class="commission-card">

      ${item.image
        ? `<img class="commission-img" src="${escapeHTML(item.image)}" alt="">`
        : ""
      }

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

    </div>
  `).join("");

  container.innerHTML = html;
}

/* =========================
   FORM HANDLER
========================= */
function initForm() {
  const form = document.getElementById("queueForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (status) status.textContent = "Submitting...";

    const payload = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch(`${ENDPOINT}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        if (status) status.textContent = "Submitted successfully!";
        form.reset();
      } else {
        if (status) status.textContent = "Submission failed.";
        console.error("Submit error:", result);
      }

    } catch (err) {
      console.error("Submit failed:", err);
      if (status) status.textContent = "Error submitting form.";
    }
  });
}

/* =========================
   SECURITY HELPER
========================= */
function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
