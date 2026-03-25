const API = "https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec"

let produtos = []
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}

const produtosDiv = document.getElementById("produtos")
const contador = document.getElementById("contador")
const carrinhoDiv = document.getElementById("carrinho")

document.getElementById("carrinhoBtn").onclick = ()=>{
    carrinhoDiv.classList.toggle("ativo")
}

function carregar(){
fetch(API)
.then(r=>r.json())
.then(data=>{
produtos = data
render()
})
}

function render(){
produtosDiv.innerHTML = ""

produtos
.sort((a,b)=> a.nome.localeCompare(b.nome))
.forEach(p=>{

if(p.ativo !== "sim") return

let preco = p.promocao === "sim" ? p.precoPromo : p.preco

produtosDiv.innerHTML += `
<div class="card">
<img src="${p.imagem}">
<h3>${p.nome}</h3>

${p.promocao==="sim" ? `<span class="promo">R$ ${p.preco}</span>` : ""}

<p class="preco">R$ ${preco}</p>

<button onclick="add('${p.nome}',${preco})">+</button>
</div>
`
})
}

function add(nome,preco){
if(!carrinho[nome]) carrinho[nome]=0
carrinho[nome]++

localStorage.setItem("carrinho",JSON.stringify(carrinho))

updateCart()
}

function updateCart(){
let total=0
let html=""

for(let i in carrinho){
html += `<p>${i} x${carrinho[i]}</p>`
}

document.getElementById("itensCarrinho").innerHTML = html

contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0)
}

function finalizar(){
let msg = "Pedido:%0A"

for(let i in carrinho){
msg += `${i} x${carrinho[i]}%0A`
}

window.open(`https://wa.me/5554996169777?text=${msg}`)
}

carregar()
updateCart()
