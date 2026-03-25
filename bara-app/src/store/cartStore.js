const CART_KEY = "bara-da-sete-cart";

export const cartStore = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch {
      return {};
    }
  },

  save(data) {
    localStorage.setItem(CART_KEY, JSON.stringify(data));
  },

  add(produto) {
    const cart = this.get();

    if (cart[produto.nome]) {
      if (cart[produto.nome].quantidade >= produto.estoque) return;
      cart[produto.nome].quantidade++;
    } else {
      cart[produto.nome] = {
        produto,
        quantidade: 1
      };
    }

    this.save(cart);
  },

  decrease(nome) {
    const cart = this.get();

    if (!cart[nome]) return;

    if (cart[nome].quantidade <= 1) {
      delete cart[nome];
    } else {
      cart[nome].quantidade--;
    }

    this.save(cart);
  },

  remove(nome) {
    const cart = this.get();
    delete cart[nome];
    this.save(cart);
  },

  total() {
    return Object.values(this.get()).reduce((acc, item) => {
      return acc + (item.produto.preco * item.quantidade);
    }, 0);
  },

  totalQty() {
    return Object.values(this.get()).reduce((acc, item) => {
      return acc + item.quantidade;
    }, 0);
  }
};
