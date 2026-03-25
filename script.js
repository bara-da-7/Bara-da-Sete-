let produtos = []

async function init(){
 produtos = await getProdutos()
 render(produtos)
 updateCart()
 gerarCategorias()
}

function gerarCategorias(){
 let cats = [...new Set(produtos.map(p=>p.categoria))]
 let div = document.getElementById("categorias")

 cats.forEach(c=>{
  div.innerHTML += `<button onclick="filtrar('${c}')">${c}</button>`
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
 carrinho.classList.toggle("ativo")
}

async function checkout(){
 let nome = document.getElementById("nomeCliente").value
 let endereco = document.getElementById("endereco").value

 let pedido = {nome, endereco, carrinho}

 await salvarPedido(pedido)

 alert("Pedido enviado!")

 carrinho = {}
 localStorage.clear()
 updateCart()
}

init()
