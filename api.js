const API = "https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec"

async function getProdutos(){
 try{
  const r = await fetch(API)
  if(!r.ok) throw new Error()
  return await r.json()
 }catch{
  return []
 }
}

async function salvarPedido(pedido){
 await fetch(API,{
  method:"POST",
  body: JSON.stringify(pedido)
 })
}
