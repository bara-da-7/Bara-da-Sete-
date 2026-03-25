let produtos = []
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}

const produtosDiv = document.getElementById("produtos")
const contador = document.getElementById("contador")

document.getElementById("carrinhoBtn").onclick = ()=>{
 document.getElementById("carrinho").classList.toggle("ativo")
}

async function init(){
 produtos = await getProdutos()
 render(produtos)
 gerarCategorias()
 updateCart()
}

function render(lista){
 produtosDiv.innerHTML=""

 lista.forEach(p=>{
  if(p.ativo !== "sim") return

  let qtd = carrinho[p.nome] || 0

  produtosDiv.innerHTML += `
  <div class="card">
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <p>${p.descricao||""}</p>

    <div class="preco">R$ ${p.preco}</div>
    <div class="estoque">Estoque: ${p.estoque}</div>

    <div class="controls">
      <button onclick="menos('${p.nome}')">-</button>
      <span>${qtd}</span>
      <button onclick="mais('${p.nome}', ${p.estoque})">+</button>
    </div>
  </div>`
 })
}

/* 🔥 CORREÇÃO DO CONTADOR */
function updateCart(){
 let totalItens = 0

 for(let i in carrinho){
  totalItens += carrinho[i]
 }

 contador.innerText = totalItens
}

/* 🔥 CONTROLE COM ESTOQUE */
function mais(nome, estoque){
 if((carrinho[nome]||0) >= estoque){
  alert("Estoque máximo atingido")
  return
 }

 carrinho[nome]=(carrinho[nome]||0)+1
 salvar()
}

function menos(nome){
 if(!carrinho[nome]) return

 carrinho[nome]--
 if(carrinho[nome]<=0) delete carrinho[nome]

 salvar()
}

function salvar(){
 localStorage.setItem("carrinho", JSON.stringify(carrinho))
 updateCart()
}

/* FILTRO */
function gerarCategorias(){
 let cats = ["Todos", ...new Set(produtos.map(p=>p.categoria))]
 let div = document.getElementById("categorias")

 div.innerHTML=""

 cats.forEach((c,i)=>{
  div.innerHTML += `
  <button class="${i==0?'active':''}" onclick="filtrar('${c}',this)">
  ${c}
  </button>`
 })
}

function filtrar(cat,el){
 let lista = cat==="Todos"?produtos:produtos.filter(p=>p.categoria===cat)
 render(lista)

 document.querySelectorAll("#categorias button")
 .forEach(b=>b.classList.remove("active"))

 el.classList.add("active")
}

/* BUSCA */
document.getElementById("busca").oninput = e=>{
 let t = e.target.value.toLowerCase()
 render(produtos.filter(p=>p.nome.toLowerCase().includes(t)))
}

/* CHECKOUT */
async function checkout(){
 let nome = nomeCliente.value
 let endereco = endereco.value

 if(!nome || !endereco){
  alert("Preencha tudo")
  return
 }

 let res = await enviarPedido({nome,endereco,carrinho})
 let r = await res.json()

 if(r.erro){
  alert(r.erro)
 }else{
  alert("Pedido enviado!")
  carrinho={}
  localStorage.clear()
  updateCart()
 }
}

init()
