const API =
"https://commissions.crysthigpen.workers.dev/";



const grid =
document.querySelector(
"#commissionGrid"
);



async function loadCommissions(){


const res =
await fetch(API);



const commissions =
await res.json();



grid.innerHTML="";



commissions.forEach(c=>{


grid.innerHTML += `


<div class="commission-card glass">


<img src="${c.image}">


<div class="content">


<h2>
${c.title}
</h2>


<h3>
${c.price}
</h3>


<p>
${c.details}
</p>


<button>
Request
</button>


</div>


</div>


`;


});


}



loadCommissions();
