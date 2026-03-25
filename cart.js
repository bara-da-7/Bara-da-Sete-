window.cart = {
  items: JSON.parse(localStorage.getItem("cart") || "{}"),

  save() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  },

  add(prod) {
    if(!this.items[prod.nome]) {
      this.items[prod.nome] = { produto: prod, qtd:0 };
    }

    if(this.items[prod.nome].qtd >= prod.estoque) return;

    this.items[prod.nome].qtd++;
    this.save();
  },

  remove(nome) {
    delete this.items[nome];
    this.save();
  },

  decrease(nome) {
    if(!this.items[nome]) return;

    this.items[nome].qtd--;

    if(this.items[nome].qtd <=0) delete this.items[nome];

    this.save();
  },

  totalQtd() {
    return Object.values(this.items).reduce((a,i)=>a+i.qtd,0);
  },

  totalPreco() {
    return Object.values(this.items).reduce((a,i)=>{
      return a + parseFloat(i.produto.preco) * i.qtd;
    },0);
  }
};
