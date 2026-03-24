// 🔗 SUA PLANILHA (CSV PUBLICADO)
const URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv";

let produtos = [];
let carrinho = {};

// 🔥 CARREGAR PLANILHA
async function carregarProdutos() {
    const res = await fetch(URL);
    const texto = await res.text();

    const linhas = texto.split("\n").slice(1);

    produtos = linhas.map(l => {
        const [nome, categoria, preco, estoque, descricao, ativo] = l.split(",");

        return {
            id: nome,
            nome,
            categoria,
            preco: parseFloat(preco),
            estoque: parseInt(estoque),
            descricao,
            ativo: ativo?.trim() === "TRUE",
            imagem: null,
            promocao: false,
            precoPromo: null
        };
    }).filter(p => p.ativo);

    render();
}

carregarProdutos();


// 🎨 RENDER PRODUTOS
function render() {
    let el = document.getElementById("produtos");
    el.innerHTML = "";

    produtos.forEach(p => {
        let qtd = carrinho[p.id] || 0;

        el.innerHTML += `
        <div class="card">
            ${p.promocao ? '<div class="ribbon">PROMOÇÃO</div>' : ''}
            <img src="${p.imagem || 'https://via.placeholder.com/300'}">
            <h3>${p.nome}</h3>
            <div class="price">R$ ${p.preco.toFixed(2)}</div>

            <div class="controls">
                <button onclick="menos('${p.id}')">-</button>
                ${qtd}
                <button onclick="mais('${p.id}')">+</button>
            </div>
        </div>`;
    });
}


// 🛒 CARRINHO
document.querySelector(".cart-float").onclick = () => {
    carrinhoModal.style.display = "block";
    renderCarrinho();
};

window.mais = id => {
    carrinho[id] = (carrinho[id] || 0) + 1;
    atualizar();
};

window.menos = id => {
    carrinho[id]--;
    if (carrinho[id] <= 0) delete carrinho[id];
    atualizar();
};

function atualizar() {
    contador.innerText = Object.values(carrinho).reduce((a, b) => a + b, 0);
}

function renderCarrinho() {
    let el = document.getElementById("itensCarrinho");
    el.innerHTML = "";
    let total = 0;

    produtos.forEach(p => {
        if (carrinho[p.id]) {
            let qtd = carrinho[p.id];
            let valor = p.preco;

            total += qtd * valor;

            el.innerHTML += `
            ${p.nome} x${qtd} - R$ ${(qtd * valor).toFixed(2)}<br>`;
        }
    });

    totalCarrinho.innerText = "Total: R$ " + total.toFixed(2);
}


// 📦 CEP AUTOMÁTICO
tipo.onchange = () => {
    cep.style.display = tipo.value === "entrega" ? "block" : "none";
    endereco.style.display = tipo.value === "entrega" ? "block" : "none";
};

cep.onblur = async () => {
    let res = await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
    let data = await res.json();
    endereco.value = `${data.logradouro} - ${data.bairro}`;
};


// 📲 WHATSAPP PROFISSIONAL
window.enviarPedido = () => {

    let total = 0;

    let msg = "🛒 *PEDIDO - BARÁ DA SETE*%0A%0A";
    msg += `👤 Cliente: ${cliente.value}%0A`;
    msg += `🚚 Tipo: ${tipo.value}%0A`;

    if (tipo.value === "entrega") {
        msg += `📍 Endereço: ${endereco.value}%0A`;
    }

    msg += "%0A📦 *Itens:*%0A";

    produtos.forEach(p => {
        if (carrinho[p.id]) {
            let qtd = carrinho[p.id];
            let valor = p.preco;

            total += qtd * valor;

            msg += `🔹 ${p.nome}%0A`;
            msg += `   Quantidade: ${qtd}%0A`;
            msg += `   Unitário: R$ ${valor.toFixed(2)}%0A`;
            msg += `   Subtotal: R$ ${(qtd * valor).toFixed(2)}%0A%0A`;
        }
    });

    msg += `💰 *Total: R$ ${total.toFixed(2)}*`;

    window.open(`https://wa.me/5554996169777?text=${msg}`);
};
