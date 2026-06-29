const API = "https://commissions.crysthigpen.workers.dev/";

const grid = document.querySelector("#commissionGrid");

async function loadCommissions() {
  try {
    const res = await fetch(API);

    const data = await res.json();

    console.log("RAW RESPONSE:", data);

    // -----------------------------
    // Normalize response shape
    // -----------------------------
    const commissions = Array.isArray(data)
      ? data
      : data.commissions
      ? data.commissions
      : [];

    if (!Array.isArray(commissions)) {
      throw new Error("Invalid commission format from Worker");
    }

    grid.innerHTML = "";

    // -----------------------------
    // Render cards safely
    // -----------------------------
    commissions.forEach(c => {
      const card = document.createElement("div");
      card.className = "commission-card glass";

      const img = document.createElement("img");
      img.src = c.image || "";
      img.alt = c.title || "Commission Image";

      const content = document.createElement("div");
      content.className = "content";

      const title = document.createElement("h2");
      title.textContent = c.title || "Untitled";

      const price = document.createElement("h3");
      price.textContent = c.price || "—";

      const details = document.createElement("p");
      details.textContent = c.details || "";

      content.appendChild(title);
      content.appendChild(price);
      content.appendChild(details);
      content.appendChild(btn);

      card.appendChild(img);
      card.appendChild(content);

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("Commission load failed:", err);

    grid.innerHTML = `
      <div class="commission-card glass" style="padding:20px;">
        <h2>Failed to load commissions</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
}

loadCommissions();

const form = document.querySelector("#commissionForm");
const message = document.querySelector("#message");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(form));

  console.log("FORM DATA:", formData);

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    console.log("POST RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data?.message || "POST failed");
    }

    message.textContent = "✨ Sent to queue!";
    form.reset();

  } catch (err) {
    console.error(err);
    message.textContent = "❌ Failed to submit form.";
  }
});
