let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

function adicionarCarrinho(id) {
  carrinho[id] = (carrinho[id] || 0) + 1;
  salvarCarrinho();
}

function removerCarrinho(id) {
  if (carrinho[id]) {
    carrinho[id]--;

    if (carrinho[id] <= 0) delete carrinho[id];
  }

  salvarCarrinho();
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinhoVisual();
}

function atualizarCarrinhoVisual() {
  let total = 0;

  Object.values(carrinho).forEach(qtd => total += qtd);

  document.getElementById("contador-carrinho").innerText = total;

  Object.keys(carrinho).forEach(id => {
    const el = document.getElementById(`qtd-${id}`);
    if (el) el.innerText = carrinho[id];
  });
}

window.abrirCarrinho = function () {
  window.location.href = "checkout/checkout.html";
};

atualizarCarrinhoVisual();
