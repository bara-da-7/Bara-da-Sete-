let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}

function add(nome){
 carrinho[nome] = (carrinho[nome] || 0) + 1
 salvar()
}

function remover(nome){
 delete carrinho[nome]
 salvar()
}

function salvar(){
 localStorage.setItem("carrinho", JSON.stringify(carrinho))
 updateCart()
}

function updateCart(){
 let html=""
 let total=0

 for(let i in carrinho){
  let p = produtos.find(x=>x.nome===i)
  if(!p) continue

  let preco = p.promocao==="sim" && p.precoPromo>0 ? p.precoPromo : p.preco
  total += preco * carrinho[i]

  html += `
  <p>
    ${i} x${carrinho[i]}
    <button onclick="remover('${i}')">❌</button>
  </p>`
 }

 itensCarrinho.innerHTML = html
 totalEl.innerText = "R$ " + total.toFixed(2)
 contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0)
}

function diminuir(nome){
 if(!carrinho[nome]) return

 carrinho[nome]--

 if(carrinho[nome] <= 0){
  delete carrinho[nome]
 }

 salvar()
}
