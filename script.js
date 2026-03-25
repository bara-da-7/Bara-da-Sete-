const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?output=csv";

let produtos = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
let categoriaAtual = "Todos";

/* =========================
   INIT
========================= */
init();

async function init(){
    showSkeleton();
    await carregarProdutos();
    gerarCategorias();
    renderProdutos();
    atualizarCarrinhoUI();
}

/* =========================
   FETCH CSV
========================= */
async function carregarProdutos(){
    const res = await fetch(CSV_URL);
    const csv = await res.text();

    const linhas = csv.split("\n").slice(1);

    produtos = linhas.map(l=>{
        const c = l.split(",");

        return {
            nome: c[0],
            preco: parseFloat(c[1]),
            categoria: c[2],
            estoque: parseInt(c[3]),
            descricao: c[4],
            ativo: c[5],
            promocao: c[6],
            precoPromo: parseFloat(c[7]),
            imagem: c[8] || "logo.png"
        };
    }).filter(p => p.ativo === "sim");
}

/* =========================
   CATEGORIAS
========================= */
function gerarCategorias(){
    const container = document.getElementById("categorias");

    let cats = ["Todos", ...new Set(produtos.map(p=>p.categoria))];
    cats.sort();

    container.innerHTML = cats.map(c=>`
        <div class="categoria ${c===categoriaAtual?'active':''}"
            onclick="filtrarCategoria('${c}')">
            ${c}
        </div>
    `).join("");
}

function filtrarCategoria(cat){
    categoriaAtual = cat;
    renderProdutos();
}

/* =========================
   BUSCA
========================= */
document.getElementById("search").addEventListener("input", renderProdutos);

/* =========================
   RENDER
========================= */
function renderProdutos(){

    const busca = document.getElementById("search").value.toLowerCase();
    const grid = document.getElementById("produtos");

    let lista = produtos.filter(p=>{
        return (categoriaAtual==="Todos" || p.categoria===categoriaAtual)
        && p.nome.toLowerCase().includes(busca);
    });

    lista.sort((a,b)=>{
        if(a.promocao==="sim") return -1;
        return a.nome.localeCompare(b.nome);
    });

    grid.innerHTML = lista.map(p=>cardProduto(p)).join("");
}

/* =========================
   CARD
========================= */
function cardProduto(p){

    let estoqueClass = "ok";
    if(p.estoque <=15) estoqueClass="ruim";
    else if(p.estoque <=20) estoqueClass="bom";

    return `
    <div class="card fade-in">

        ${p.promocao==="sim" ? `<div class="badge">PROMO</div>` : ""}

        <img src="${p.imagem}" loading="lazy">

        <div class="nome">${p.nome}</div>

        ${
            p.promocao==="sim"
            ? `
                <div class="old">R$ ${p.preco.toFixed(2)}</div>
                <div class="preco">R$ ${p.precoPromo.toFixed(2)}</div>
            `
            : `<div class="preco">R$ ${p.preco.toFixed(2)}</div>`
        }

        <div class="estoque ${estoqueClass}">
            ${p.estoque} unidades
        </div>

        <div class="controls">
            <button onclick="menos('${p.nome}')">-</button>
            <span>${carrinho[p.nome]||0}</span>
            <button onclick="mais('${p.nome}')">+</button>
        </div>

    </div>
    `;
}

/* =========================
   CARRINHO
========================= */
function mais(nome){
    carrinho[nome] = (carrinho[nome]||0)+1;
    salvarCarrinho();
}

function menos(nome){
    if(carrinho[nome]){
        carrinho[nome]--;
        if(carrinho[nome]<=0) delete carrinho[nome];
    }
    salvarCarrinho();
}

function salvarCarrinho(){
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinhoUI();
    renderProdutos();
}

function atualizarCarrinhoUI(){
    let total = Object.values(carrinho).reduce((a,b)=>a+b,0);
    document.getElementById("cartCount").innerText = total;
}

/* =========================
   CHECKOUT
========================= */
document.getElementById("cartIcon").onclick = ()=>{
    window.location.href = "checkout.html";
};

/* =========================
   SKELETON
========================= */
function showSkeleton(){
    const grid = document.getElementById("produtos");

    grid.innerHTML = Array(6).fill().map(()=>`
        <div class="card skeleton"></div>
    `).join("");
}
