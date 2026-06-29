const API = "https://commissions.crysthigpen.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  loadCommissions();
  initForm();
});

const commissions = [
  {
    title: "Bust Icon",
    description: "Clean bust-up character icon",
    price: "$25",
    status: "Open",
    image: ""
  },
  {
    title: "Half Body",
    description: "Waist-up illustration with detail",
    price: "$45",
    status: "Open",
    image: ""
  },
  {
    title: "Full Body",
    description: "Full character illustration",
    price: "$70",
    status: "Limited",
    image: ""
  }
];

document.addEventListener("DOMContentLoaded", () => {
  renderCommissions();
  initForm();
});

function renderCommissions() {
  const container = document.getElementById("commission-container");

  container.innerHTML = commissions.map(c => `
    <div class="commission-card">

      ${c.image ? `<img src="${c.image}" />` : ""}

      <h3>${c.title}</h3>
      <p>${c.description}</p>

      <div class="meta">
        <span>${c.price}</span>
        <span>${c.status}</span>
      </div>

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

    const res = await fetch("https://commissions.crysthigpen.workers.dev/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {
      status.textContent = "Submitted!";
      form.reset();
    } else {
      status.textContent = "Failed.";
      console.log(result);
    }
  });
}
