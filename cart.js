let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {}

function add(nome, preco){
 carrinho[nome] = (carrinho[nome] || 0) + 1
 salvarCarrinho()
 updateCart()
}

function salvarCarrinho(){
 localStorage.setItem("carrinho", JSON.stringify(carrinho))
}

function updateCart(){
 let total = 0
 let html = ""

 for(let i in carrinho){
  html += `<p>${i} x${carrinho[i]}</p>`
 }

 document.getElementById("itensCarrinho").innerHTML = html
 document.getElementById("contador").innerText =
 Object.values(carrinho).reduce((a,b)=>a+b,0)
}
