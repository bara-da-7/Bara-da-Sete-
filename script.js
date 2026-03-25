let produtos = []
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}

const produtosDiv = document.getElementById("produtos")
const categoriasDiv = document.getElementById("categorias")
const contador = document.getElementById("contador")
const carrinhoDiv = document.getElementById("carrinho")

document.getElementById("carrinhoBtn").onclick = ()=>{
 carrinhoDiv.classList.toggle("ativo")
}

async function init(){
 produtos = await getProdutos()
 render(produtos)
 categorias()
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

    <div class="controls">
      <button onclick="menos('${p.nome}')">-</button>
      <span>${qtd}</span>
      <button onclick="mais('${p.nome}')">+</button>
    </div>
  </div>`
 })
}

function categorias(){
 let cats = ["Todos", ...new Set(produtos.map(p=>p.categoria))]
 categoriasDiv.innerHTML=""

 cats.forEach((c,i)=>{
  categoriasDiv.innerHTML += `
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

document.getElementById("busca").oninput = e=>{
 let t = e.target.value.toLowerCase()
 render(produtos.filter(p=>p.nome.toLowerCase().includes(t)))
}

function mais(nome){
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
 localStorage.setItem("carrinho",JSON.stringify(carrinho))
 updateCart()
}

function updateCart(){
 let total=0
 let html=""

 for(let i in carrinho){
  html+=`<p>${i} x${carrinho[i]}</p>`
 }

 document.getElementById("itensCarrinho").innerHTML = html
 contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0)
}

async function checkout(){

 let nome = document.getElementById("nomeCliente").value
 let endereco = document.getElementById("endereco").value

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
