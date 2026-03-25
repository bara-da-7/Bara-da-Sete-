window.state = {
  produtos: [],
  busca: ""
};

window.actions = {

  async init() {
    const data = await api.getProdutos();
    state.produtos = data;
    this.render();
  },

  render() {
    const filtrados = state.produtos.filter(p =>
      p.nome.toLowerCase().includes(state.busca.toLowerCase())
    );

    ui.renderProdutos(filtrados);

    document.getElementById("cart-count").innerText = cart.totalQtd();
  },

  add(nome) {
    const p = state.produtos.find(p=>p.nome===nome);
    cart.add(p);
    this.render();
  },

  dec(nome) {
    cart.decrease(nome);
    this.render();
  }
};

document.getElementById("app").innerHTML = `
<header style="padding:20px;text-align:center">
  <h1 style="color:gold">Bará da Sete</h1>
</header>

<input placeholder="Buscar..." oninput="state.busca=this.value; actions.render()">

<div id="produtos" class="grid"></div>

<button onclick="toggleCart()" style="position:fixed;bottom:20px;right:20px">
🛒 <span id="cart-count">0</span>
</button>

<div id="overlay" class="overlay" onclick="toggleCart()"></div>
<div id="cart" class="cart"></div>
`;

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("open");
}

actions.init();
