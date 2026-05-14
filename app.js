const API_URL = "https://script.google.com/macros/s/AKfycbz5uomZ43QCq9qZsr-OyJA-IhfC8zOMquZN5Yy73hBBh84F5kf3ZDr2kLXW7ovGCAh7/exec?action=produtos";

let produtosGlobais = [];
let footerClicks = 0;

async function carregarProdutos() {
  const response = await fetch(API_URL);
  produtosGlobais = await response.json();

  renderizarProdutos(produtosGlobais);
  renderizarCategorias();
}

function renderizarProdutos(produtos) {
  const container = document.getElementById("produtos");
  container.innerHTML = "";

  produtos.filter(p => p.ativo).forEach(produto => {
    const imagem = produto.imagem || "https://placehold.co/300x300";

    const precoHTML = produto.promocao
      ? `
        <p class="preco-antigo">R$ ${produto.preco}</p>
        <p class="preco-promocional">R$ ${produto.precopromo}</p>
      `
      : `<p>R$ ${produto.preco}</p>`;

    const badge = produto.promocao
      ? `<div class="badge-promocao">PROMOÇÃO</div>`
      : "";

    const card = document.createElement("div");
    card.className = "produto-card";

    card.innerHTML = `
      ${badge}
      <img src="${imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      ${precoHTML}
      <div class="controles">
        <button onclick="removerCarrinho(${produto.id})">-</button>
        <span id="qtd-${produto.id}">0</span>
        <button onclick="adicionarCarrinho(${produto.id})">+</button>
      </div>
    `;

    container.appendChild(card);
  });

  atualizarCarrinhoVisual();
}

function renderizarCategorias() {
  const categorias = [...new Set(produtosGlobais.map(p => p.categoria))];
  const container = document.getElementById("categorias");

  container.innerHTML = `<button class="categoria-btn" onclick="renderizarProdutos(produtosGlobais)">Todos</button>`;

  categorias.forEach(cat => {
    container.innerHTML += `<button class="categoria-btn" onclick="filtrarCategoria('${cat}')">${cat}</button>`;
  });
}

function filtrarCategoria(cat) {
  renderizarProdutos(produtosGlobais.filter(p => p.categoria === cat));
}

document.getElementById("busca").addEventListener("input", e => {
  const termo = e.target.value.toLowerCase();

  renderizarProdutos(
    produtosGlobais.filter(p =>
      p.nome.toLowerCase().includes(termo)
    )
  );
});

document.getElementById("footer-admin").addEventListener("click", () => {
  footerClicks++;

  if (footerClicks >= 10) {
    const login = prompt("Login");
    const senha = prompt("Senha");

    if (login === "99861309" && senha === "1069") {
      window.location.href = "admin/admin.html";
    } else {
      alert("Acesso negado");
    }

    footerClicks = 0;
  }
});

carregarProdutos();
