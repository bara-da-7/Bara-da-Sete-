const CLOUD = "dy61d0gt8"
const PRESET = "ml_padrao"

function logar(){
 if(user.value==="adm" && senha.value==="99861309"){
  login.style.display="none"
  painel.style.display="block"
 }
}

function salvar(){
 let file = imagem.files[0]

 let form = new FormData()
 form.append("file", file)
 form.append("upload_preset", PRESET)

 fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,{
  method:"POST",
  body:form
 })
 .then(r=>r.json())
 .then(img=>{
  fetch(API,{
   method:"POST",
   body: JSON.stringify({
    nome:nome.value,
    preco:preco.value,
    categoria:categoria.value,
    imagem:img.secure_url,
    ativo:"sim"
   })
  })
  alert("Produto salvo")
 })
}
