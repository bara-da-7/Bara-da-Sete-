let produtos=[]
const produtosDiv = document.getElementById("produtos")
const categorias = document.getElementById("categorias")
const busca = document.getElementById("busca")
const carrinhoBtn = document.getElementById("carrinhoBtn")
const carrinhoDiv = document.getElementById("carrinho")
const itensCarrinho = document.getElementById("itensCarrinho")
const totalEl = document.getElementById("total")
const contador = document.getElementById("contador")

async function init(){
 produtos = await getProdutos()
 render(produtos)
 gerarCategorias()
 updateCart()
}

function gerarCategorias(){
 let cats = ["Todos", ...new Set(produtos.map(p=>p.categoria))]
 categorias.innerHTML=""

 cats.forEach((c,i)=>{
  categorias.innerHTML += `
  <button class="${i==0?'active':''}" onclick="filtrar('${c}', this)">
    ${c}
  </button>`
 })
}

function filtrar(cat, el){
 let lista = cat==="Todos" ? produtos : produtos.filter(p=>p.categoria===cat)
 render(lista)

 document.querySelectorAll("#categorias button")
 .forEach(b=>b.classList.remove("active"))

 el.classList.add("active")
}

function filtrar(cat){
 render(produtos.filter(p=>p.categoria===cat))
}

busca.oninput = e=>{
 let t = e.target.value.toLowerCase()
 render(produtos.filter(p=>p.nome.toLowerCase().includes(t)))
}

carrinhoBtn.onclick = ()=>{
 carrinhoDiv.classList.toggle("ativo")
}

async function checkout(){

 let nome = document.getElementById("nomeCliente").value
 let endereco = document.getElementById("endereco").value

 if(!nome || !endereco){
  alert("Preencha nome e endereço")
  return
 }

 if(Object.keys(carrinho).length === 0){
  alert("Carrinho vazio")
  return
 }

 try{

  let res = await enviarPedido({
    nome,
    endereco,
    carrinho
  })

  let r = await res.json()

  if(r.erro){
    alert(r.erro)
  }else{
    alert("Pedido enviado com sucesso!")

    carrinho = {}
    localStorage.removeItem("carrinho")
    updateCart()
  }

 }catch(e){
  alert("Erro ao enviar pedido")
  console.error(e)
 }
}
