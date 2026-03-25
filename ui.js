function render(produtos){
 const div = document.getElementById("produtos")
 div.innerHTML=""

 produtos.forEach(p=>{
  if(p.ativo !== "sim") return

  let preco = p.promocao==="sim" ? p.precoPromo : p.preco

  div.innerHTML += `
  <div class="card">
    <img src="${p.imagem}">
    <h3>${p.nome}</h3>
    <p class="preco">R$ ${preco}</p>
    <button onclick="add('${p.nome}',${preco})">+</button>
  </div>`
 })
}
