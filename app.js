const API_URL = "https://script.google.com/macros/s/AKfycbz5uomZ43QCq9qZsr-OyJA-IhfC8zOMquZN5Yy73hBBh84F5kf3ZDr2kLXW7ovGCAh7/exec?action=produtos";

async function carregarProdutos() {
  try {
    const response = await fetch(API_URL);
    const produtos = await response.json();

    const container = document.getElementById("produtos");
    container.innerHTML = "";

    produtos
      .filter(produto => produto.ativo === true)
      .forEach(produto => {
        const imagem = produto.imagem || "https://via.placeholder.com/300x220?text=Produto";

        let precoHTML = `<p class="preco-normal">R$ ${produto.preco}</p>`;
        let badge = "";

        if (produto.promocao) {
          badge = `<span class="badge-promocao">PROMOÇÃO</span>`;

          precoHTML = `
            <p class="preco-antigo">R$ ${produto.preco}</p>
            <p class="preco-promocional">R$ ${produto.precopromo}</p>
          `;
        }

        const card = document.createElement("div");
        card.classList.add("produto-card");

        card.innerHTML = `
          ${badge}
          <img src="${imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          ${precoHTML}
          <button onclick="adicionarCarrinho(${produto.id})">Comprar</button>
        `;

        container.appendChild(card);
      });

  } catch (error) {
    console.error("Erro ao carregar produtos", error);
  }
}

function adicionarCarrinho(id) {
  alert("Produto " + id + " adicionado ao carrinho");
}

carregarProdutos();
