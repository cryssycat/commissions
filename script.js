const API = "https://commissions.crysthigpen.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  loadCommissions();
  initForm();
});

async function loadCommissions() {
  const el = document.getElementById("commission-container");

  const res = await fetch(`${API}/commissions`);
  const data = await res.json();

  el.innerHTML = data.map(c => `
    <div class="card">
      ${c.image ? `<img src="${c.image}">` : ""}
      <h3>${c.name}</h3>
      <p>${c.description}</p>
      <span>${c.price}</span>
      <small>${c.status}</small>
    </div>
  `).join("");
}

function initForm() {
  const form = document.getElementById("queueForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Submitting...";

    const data = Object.fromEntries(new FormData(form));

    const res = await fetch(`${API}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      status.textContent = "Submitted!";
      form.reset();
    } else {
      status.textContent = "Failed to submit.";
      console.log(result);
    }
  });
}
