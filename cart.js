const CART_KEY = 'bara-da-sete-cart';

const Cart = {
  _load() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; }
  },
  _save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },
  add(produto) {
    const items = this._load();
    const preco = typeof produto.preco === 'string'
      ? parseFloat(produto.preco.replace(',', '.')) : Number(produto.preco);
    const p = { ...produto, preco };
    if (items[p.nome]) {
      if (items[p.nome].quantidade >= p.estoque) return false;
      items[p.nome].quantidade++;
    } else {
      items[p.nome] = { produto: p, quantidade: 1 };
    }
    this._save(items);
    return true;
  },
  decrease(nome) {
    const items = this._load();
    if (!items[nome]) return;
    items[nome].quantidade <= 1 ? delete items[nome] : items[nome].quantidade--;
    this._save(items);
  },
  remove(nome) {
    const items = this._load();
    delete items[nome];
    this._save(items);
  },
  clear() { localStorage.removeItem(CART_KEY); },
  items() { return this._load(); },
  count(nome) { return this._load()[nome]?.quantidade || 0; },
  totalQty() {
    return Object.values(this._load()).reduce((s, i) => s + i.quantidade, 0);
  },
  totalPrice() {
    return Object.values(this._load()).reduce((s, i) => {
      const p = typeof i.produto.preco === 'number'
        ? i.produto.preco : parseFloat(String(i.produto.preco).replace(',', '.'));
      return s + p * i.quantidade;
    }, 0);
  },
};
