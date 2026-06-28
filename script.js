const API =
"https://commissions.crysthigpen.workers.dev/";

async function loadCommissions() {

try {

const response = await fetch(API);

if (!response.ok)
throw new Error(
`Worker returned ${response.status}`
);

const data =
await response.json();

renderCommissions(data);

}
catch(err){

console.error(
"Commission loading error:",
err
);

}

}

function renderCommissions(data){

const container =
document.getElementById(
"commissionSections"
);

container.innerHTML = "";

const categories = {};

data.forEach(item => {

const cat =
item.category || "Other";

if(!categories[cat])
categories[cat] = [];

categories[cat].push(item);

});

Object.keys(categories)
.sort()
.forEach(category => {

const section =
document.createElement("section");

section.className =
"category-section";

section.innerHTML =
`<h2>${category}</h2>`;

const grid =
document.createElement("div");

grid.className =
"commission-grid";

categories[category]
.sort((a,b)=>
(a.sort||999)-
(b.sort||999)
)
.forEach(item => {

const card =
document.createElement("article");

card.className =
"commission-card glass";

card.innerHTML = `
<img
src="${item.image}"
alt="${item.name}"
>

<div class="card-content">

<h3>${item.name}</h3>

<div class="price">
${item.price}
</div>

<p>
${item.description}
</p>

<a
href="${
item.orderLink || "#"
}"
target="_blank"
class="order-button"
>
Order
</a>

</div>
`;

grid.appendChild(card);

});

section.appendChild(grid);

container.appendChild(section);

});

}

loadCommissions();
