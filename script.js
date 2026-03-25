let produtos=[]
const produtosDiv = document.getElementById("produtos")
const categorias = document.getElementById("categorias")
const busca = document.getElementById("busca")
const carrinhoBtn = document.getElementById("carrinhoBtn")
const carrinhoDiv = document.getElementById("carrinho")
const itensCarrinho = document.getElementById("itensCarrinho")
const totalEl = document.getElementById("total")
const contador = document.getElementById("contador")

async function init(){
 produtos = await getProdutos()
 render(produtos)
 gerarCategorias()
 updateCart()
}

function gerarCategorias(){
 let cats = [...new Set(produtos.map(p=>p.categoria))]

 categorias.innerHTML=""

 cats.forEach(c=>{
  categorias.innerHTML += `<button onclick="filtrar('${c}')">${c}</button>`
 })
}

function filtrar(cat){
 render(produtos.filter(p=>p.categoria===cat))
}

busca.oninput = e=>{
 let t = e.target.value.toLowerCase()
 render(produtos.filter(p=>p.nome.toLowerCase().includes(t)))
}

carrinhoBtn.onclick = ()=>{
 carrinhoDiv.classList.toggle("ativo")
}

async function checkout(){
 let nome = nomeCliente.value
 let endereco = endereco.value

 let res = await enviarPedido({nome,endereco,carrinho})
 let r = await res.json()

 if(r.erro){
  alert(r.erro)
 }else{
  alert("Pedido enviado com sucesso!")
  localStorage.clear()
  carrinho={}
  updateCart()
 }
}

init()
