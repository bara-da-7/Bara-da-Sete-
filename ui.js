window.ui = {

  produtoCard(p) {
    const qtd = cart.items[p.nome]?.qtd || 0;

    return `
    <div class="card">
      <img src="${p.imagem || ''}" style="width:100%;height:140px;object-fit:cover">
      <div style="padding:10px">
        <h4>${p.nome}</h4>
        <p>R$ ${Number(p.preco).toFixed(2)}</p>

        ${
          qtd === 0
          ? `<button onclick="actions.add('${p.nome}')" class="btn-gold">Adicionar</button>`
          : `
          <div>
            <button onclick="actions.dec('${p.nome}')">-</button>
            ${qtd}
            <button onclick="actions.add('${p.nome}')">+</button>
          </div>`
        }
      </div>
    </div>`;
  },

  renderProdutos(lista) {
    document.getElementById("produtos").innerHTML =
      lista.map(p=>ui.produtoCard(p)).join('');
  }
};
