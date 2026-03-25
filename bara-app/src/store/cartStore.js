const KEY = "cart";

export const cartStore = {
  get() {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  },

  save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  },

  add(p) {
    const cart = this.get();

    if (cart[p.nome]) {
      cart[p.nome].quantidade++;
    } else {
      cart[p.nome] = { produto: p, quantidade: 1 };
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

  total() {
    return Object.values(this.get()).reduce((s, i) => {
      return s + (i.produto.preco * i.quantidade);
    }, 0);
  }
};
