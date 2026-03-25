const CLOUD = "dy61d0gt8"
const PRESET = "ml_padrao"

function logar(){
if(document.getElementById("senha").value === "99861309"){
document.getElementById("login").style.display="none"
document.getElementById("painel").style.display="block"
}
}

function salvar(){

let file = document.getElementById("imagem").files[0]

let form = new FormData()
form.append("file",file)
form.append("upload_preset",PRESET)

fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,{
method:"POST",
body:form
})
.then(r=>r.json())
.then(img=>{

fetch("SUA API",{
method:"POST",
body:JSON.stringify({
nome: nome.value,
preco: preco.value,
categoria: categoria.value,
imagem: img.secure_url,
promocao: promo.checked ? "sim":"não",
precoPromo: precoPromo.value
})
})

alert("Salvo")
})
}
