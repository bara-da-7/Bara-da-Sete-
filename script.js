const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?output=csv";

let produtos = [];
let carrinho = {};
let clicks = 0;

/* ADMIN SECRET */
document.getElementById("logoClick").addEventListener("click",()=>{
    clicks++;
    if(clicks >= 10){
        window.location.href = "admin.html";
    }
});

/* FETCH */
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
            promo:c[5],
            precoPromo:parseFloat(c[6])
        }
    });

    render();
});

/* RENDER */
function render(){
    const div = document.getElementById("produtos");
    div.innerHTML="";

    produtos.sort((a,b)=>{
        if(a.promo==="sim") return -1;
        return a.nome.localeCompare(b.nome);
    });

    produtos.forEach(p=>{
        let estoqueClass = "ok";
        if(p.estoque <=15) estoqueClass="ruim";
        else if(p.estoque <=20) estoqueClass="bom";

        div.innerHTML+=`
        <div class="card">
            <img src="${p.imagem || 'logo.png'}">
            <div class="nome">${p.nome}</div>

            ${
                p.promo==="sim"
                ? `<div class="old">R$ ${p.preco}</div>
                   <div class="preco">R$ ${p.precoPromo}</div>`
                : `<div class="preco">R$ ${p.preco}</div>`
            }

            <div class="estoque ${estoqueClass}">
                Estoque: ${p.estoque}
            </div>

            <div class="controls">
                <button class="btn-qtd" onclick="menos('${p.nome}')">-</button>
                <span>${carrinho[p.nome]||0}</span>
                <button class="btn-qtd" onclick="mais('${p.nome}')">+</button>
            </div>
        </div>
        `;
    });
}

/* CARRINHO */
function mais(nome){
    carrinho[nome]=(carrinho[nome]||0)+1;
    updateCart();
}

function menos(nome){
    if(carrinho[nome]){
        carrinho[nome]--;
    }
    updateCart();
}

function updateCart(){
    let total=0;
    Object.values(carrinho).forEach(q=> total+=q);
    document.getElementById("cartCount").innerText=total;
    render();
}
