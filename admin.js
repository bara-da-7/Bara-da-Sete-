const CLOUD = "dy61d0gt8";
const PRESET = "ml_padrao";

async function salvar(){

let file = document.getElementById("imagem").files[0];

let form = new FormData();
form.append("file", file);
form.append("upload_preset", PRESET);

let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,{
method:"POST",
body:form
});

let img = await res.json();

alert("Imagem enviada: "+img.secure_url);
}
