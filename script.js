let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

function render(){
    let el = document.getElementById("products");
    el.innerHTML = "";

    produtos.forEach((p,i)=>{
        let qtd = carrinho[i] || 0;

        el.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h3>${p.nome}</h3>
            <p>${p.desc}</p>
            <p class="price">R$ ${p.preco}</p>
            <p>Estoque: ${p.estoque}</p>

            <div class="actions">
                <button onclick="menos(${i})">-</button>
                <span>${qtd}</span>
                <button onclick="mais(${i})" ${p.estoque<=0?'disabled':''}>+</button>
            </div>
        </div>
        `;
    });

    atualizarTotal();
}

function mais(i){
    let p = produtos[i];
    if(p.estoque <= 0) return;

    carrinho[i] = (carrinho[i] || 0) + 1;
    p.estoque--;

    salvar();
}

function menos(i){
    if(!carrinho[i]) return;

    carrinho[i]--;
    produtos[i].estoque++;

    if(carrinho[i] <= 0) delete carrinho[i];

    salvar();
}

function atualizarTotal(){
    let total = 0;

    for(let i in carrinho){
        total += carrinho[i] * produtos[i].preco;
    }

    document.getElementById("total").innerText = "Total: R$ " + total;
}

function salvar(){
    localStorage.setItem("produtos", JSON.stringify(produtos));
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    render();
}

function finalizar(){
    let msg = "Pedido:%0A";
    let total = 0;

    for(let i in carrinho){
        msg += `${produtos[i].nome} x${carrinho[i]}%0A`;
        total += carrinho[i] * produtos[i].preco;
    }

    msg += `%0ATotal: R$ ${total}`;

    window.open(`https://wa.me/5554996169777?text=${msg}`);
}

/* ADMIN */
let clicks = 0;
function clickLogo(){
    clicks++;
    if(clicks >= 10){
        let user = prompt("Usuário");
        let pass = prompt("Senha");

        if(user=="adm" && pass=="99861309"){
            document.getElementById("admin").style.display="flex";
        }
        clicks = 0;
    }
}

/* IA */
function gerarDesc(){
    let nome = document.getElementById("nome").value;
    document.getElementById("desc").value =
    `Este ${nome} foi preparado com propósito espiritual, trazendo proteção, força e conexão. Ideal para abertura de caminhos.`;
}

/* UPLOAD + DRAG */
let uploadArea = document.getElementById("uploadArea");
let inputFile = document.getElementById("img");

uploadArea.onclick = ()=> inputFile.click();

uploadArea.addEventListener("dragover", e=>{
    e.preventDefault();
});

uploadArea.addEventListener("drop", e=>{
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
});

/* SALVAR PRODUTO */
function salvarProduto(){
    let file = inputFile.files[0];
    let reader = new FileReader();

    reader.onload = function(){
        produtos.push({
            nome: nome.value,
            preco: parseFloat(preco.value),
            estoque: parseInt(estoque.value),
            desc: desc.value,
            img: reader.result
        });

        salvar();
        alert("Produto salvo!");
    }

    reader.readAsDataURL(file);
}

render();
