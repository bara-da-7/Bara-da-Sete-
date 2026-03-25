const API = "https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec"
  produtos=data
  render()
  categorias()
 })
}

function render(lista=produtos){
 produtosDiv.innerHTML=''
 lista.forEach(p=>{
  if(p.ativo!=='sim')return
  let preco=p.promocao==='sim'?p.precoPromo:p.preco
  produtosDiv.innerHTML+=`<div class="card">
   <img src="${p.imagem}">
   <h3>${p.nome}</h3>
   <p class="preco">R$ ${preco}</p>
   <button onclick="add('${p.nome}',${preco})">+</button>
  </div>`
 })
}

function categorias(){
 let cats=[...new Set(produtos.map(p=>p.categoria))]
 categoriasDiv.innerHTML=''
 cats.forEach(c=>{
  categoriasDiv.innerHTML+=`<button onclick="filtrar('${c}')">${c}</button>`
 })
}

function filtrar(cat){
 render(produtos.filter(p=>p.categoria===cat))
}

busca.oninput=(e)=>{
 let t=e.target.value.toLowerCase()
 render(produtos.filter(p=>p.nome.toLowerCase().includes(t)))
}

function add(nome,preco){
 carrinho[nome]=(carrinho[nome]||0)+1
 localStorage.setItem('carrinho',JSON.stringify(carrinho))
 updateCart()
}

function updateCart(){
 let total=0,html=''
 for(let i in carrinho){
  let p=produtos.find(x=>x.nome===i)
  let preco=p?.preco||0
  total+=preco*carrinho[i]
  html+=`<p>${i} x${carrinho[i]}</p>`
 }
 itensCarrinho.innerHTML=html
 totalEl.innerText='Total R$ '+total
 contador.innerText=Object.values(carrinho).reduce((a,b)=>a+b,0)
}

function finalizar(){
 let msg='Pedido:%0A'
 for(let i in carrinho){
  msg+=`${i} x${carrinho[i]}%0A`
 }
 window.open(`https://wa.me/5554996169777?text=${msg}`)
}

carregar()
updateCart()
