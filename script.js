const API =
"https://YOUR-WORKER.workers.dev";



const form =
document.querySelector("#commissionForm");



const message =
document.querySelector("#message");





form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const data =
Object.fromEntries(
new FormData(form)
);




try {



await fetch(
API,
{

method:"POST",

headers:
{
"Content-Type":
"application/json"
},

body:
JSON.stringify(data)

}

);



message.innerText =
"✨ Added to commission queue!";



form.reset();



}

catch(err){


message.innerText =
"Something went wrong.";


}



});
