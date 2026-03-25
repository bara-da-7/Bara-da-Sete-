function render(lista){
 produtosDiv.innerHTML=""

 lista.forEach(p=>{
  if(String(p.ativo).toLowerCase() !== "sim") return

  let preco = p.promocao==="sim" && p.precoPromo>0 ? p.precoPromo : p.preco
  let qtd = carrinho[p.nome] || 0

  produtosDiv.innerHTML += `
  <div class="card">
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <p>${p.descricao||""}</p>

    <div class="preco">R$ ${preco}</div>

    <div class="controls">
      <button onclick="diminuir('${p.nome}')">-</button>
      <span class="qtd">${qtd}</span>
      <button onclick="add('${p.nome}')">+</button>
    </div>
  </div>`
 })
}
