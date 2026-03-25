const API = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec"

async function getProdutos(){
 try{
  const r = await fetch(API)
  if(!r.ok) throw new Error("Erro API")
  return await r.json()
 }catch(e){
  console.error(e)
  return []
 }
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
