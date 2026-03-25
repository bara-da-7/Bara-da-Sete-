const API = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec"

async function getProdutos(){
 const r = await fetch(API)
 return await r.json()
}

async function enviarPedido(dados){
 return fetch(API,{
  method:"POST",
  body: JSON.stringify({
    tipo:"pedido",
    ...dados
  })
 })
}
