function render(lista){
 produtosDiv.innerHTML=""

 lista.forEach(p=>{
  if(String(p.ativo).toLowerCase() !== "sim") return

  let preco = p.promocao==="sim" && p.precoPromo>0 ? p.precoPromo : p.preco

  produtosDiv.innerHTML += `
  <div class="card">
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <p>${p.descricao || ""}</p>
    <p class="preco">R$ ${preco}</p>
    <button onclick="add('${p.nome}')">+</button>
  </div>`
 })
}
