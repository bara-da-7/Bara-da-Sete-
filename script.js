const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?output=csv";

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

fetch(URL)
.then(r=>r.text())
.then(csv=>{
const linhas = csv.split("\n").slice(1);

produtos = linhas.map(l=>{
const c = l.split(",");
return {
nome:c[0],
preco:parseFloat(c[1]),
categoria:c[2],
estoque:parseInt(c[3]),
promocao:c[6],
precoPromo:parseFloat(c[7]),
imagem:c[8]
}
});

render();
});

function render(){
const div = document.getElementById("produtos");

div.innerHTML = produtos.map(p=>`
<div class="card">

<img src="${p.imagem || 'logo.png'}">

<div>${p.nome}</div>

<div>${p.promocao==="sim" ? p.precoPromo : p.preco}</div>

<button onclick="add('${p.nome}')">+</button>

</div>
`).join("");
}

function add(nome){
carrinho[nome]=(carrinho[nome]||0)+1;
localStorage.setItem("carrinho",JSON.stringify(carrinho));
update();
}

function update(){
document.getElementById("cartCount").innerText =
Object.values(carrinho).reduce((a,b)=>a+b,0);
}

document.getElementById("cartIcon").onclick=()=>{
document.getElementById("drawer").classList.toggle("open");
};
