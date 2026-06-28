const API =
"https://commissions.crysthigpen.workers.dev";

async function loadCommissions() {

    try {

        const res = await fetch(API);

        if (!res.ok)
            throw new Error(`Worker returned ${res.status}`);

        const commissions = await res.json();

        renderCommissions(commissions);

    } catch (err) {

        console.error(err);

    }

}

function renderCommissions(data) {

    const grid =
        document.getElementById("commissionGrid");

    grid.innerHTML = "";

    data.forEach(item => {

        const card =
        document.createElement("div");

        card.className =
        "commission-card glass-card";

        card.innerHTML = `

        <img
            src="${item.image}"
            alt="${item.name}"
        >

        <h3>${item.name}</h3>

        <div class="price">
            ${item.price}
        </div>

        <p>
            ${item.description}
        </p>

        <a
            href="${item.orderLink}"
            target="_blank"
            class="order-button"
        >
            Order
        </a>
        `;

        grid.appendChild(card);

    });

}

loadCommissions();
