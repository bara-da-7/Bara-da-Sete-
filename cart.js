const CART_KEY = "bara-cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || {};
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addItem(produto) {
  const cart = getCart();

  if (!cart[produto.nome]) {
    cart[produto.nome] = { produto, quantidade: 1 };
  } else {
    if (cart[produto.nome].quantidade < produto.estoque) {
      cart[produto.nome].quantidade++;
    }
  }

  saveCart(cart);
  renderCart();
}

function decreaseItem(nome) {
  const cart = getCart();

  if (!cart[nome]) return;

  if (cart[nome].quantidade <= 1) {
    delete cart[nome];
  } else {
    cart[nome].quantidade--;
  }

  saveCart(cart);
  renderCart();
}

function removeItem(nome) {
  const cart = getCart();
  delete cart[nome];
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  renderCart();
}

function totalPreco() {
  const cart = getCart();

  return Object.values(cart).reduce((acc, i) => {
    const preco = parseFloat(i.produto.preco);
    return acc + preco * i.quantidade;
  }, 0);
}

function totalQuantidade() {
  const cart = getCart();
  return Object.values(cart).reduce((acc, i) => acc + i.quantidade, 0);
}
