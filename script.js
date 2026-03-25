let produtos = [];
let categoriaAtiva = "Todos";
let busca = "";

async function init() {
  produtos = await getProdutos();
  renderProdutos();
}

function renderProdutos() {
  const container = document.getElementById("produtos");

  const filtrados = produtos.filter(p => {
    if (p.ativo !== "sim") return false;

    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaAtiva === "Todos" || p.categoria === categoriaAtiva;

    return matchBusca && matchCat;
  });

  container.innerHTML = filtrados.map(p => `
    <div class="card">
      <img src="${p.imagem}" />
      <h3>${p.nome}</h3>
      <p>R$ ${parseFloat(p.preco).toFixed(2)}</p>
      <button onclick='addItem(${JSON.stringify(p)})'>
        Adicionar
      </button>
    </div>
  `).join("");
}

document.getElementById("busca").addEventListener("input", e => {
  busca = e.target.value;
  renderProdutos();
});

init();
