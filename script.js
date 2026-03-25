const CONFIG={
 CSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 API:"https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec",
 WHATS:"555496169777"
};

let lista=[];
let carrinho={};
let buscaTxt="";

/* LOAD */
async function carregar(){

 const res=await fetch(CONFIG.CSV);
 const txt=await res.text();

 const linhas=txt.split("\n").slice(1);

 lista=linhas.map(l=>{
  let c=l.split(",");
  return{
   nome:c[0],
   preco:+c[1],
   categoria:c[2],
   estoque:+c[3],
   ativo:(c[5]||"").toLowerCase(),
   promocao:(c[6]||"").toLowerCase(),
   precoPromo:+c[7],
   imagem:c[8]
  };
 });

 render();
}

/* BUSCA */
function buscar(v){
 buscaTxt=v.toLowerCase();
 render();
}

/* RENDER */
function render(){

 let el=document.getElementById("produtos");
 el.innerHTML="";

 let dados=lista
 .filter(p=>p.ativo==="sim")
 .filter(p=>p.nome.toLowerCase().includes(buscaTxt))
 .sort((a,b)=>{
  if(a.promocao==="sim") return -1;
  return a.nome.localeCompare(b.nome);
 });

 dados.forEach((p,i)=>{

  let preco=p.promocao==="sim"?p.precoPromo:p.preco;

  el.innerHTML+=`
  <div class="card">

  ${p.promocao==="sim"?'<div class="badge">PROMO</div>':''}

  <img src="${p.imagem||'https://via.placeholder.com/300'}">

  <h4>${p.nome}</h4>

  ${p.promocao==="sim"?`<div class="preco-antigo">R$ ${p.preco}</div>`:""}
  <div class="preco-novo">R$ ${preco}</div>

  <div class="${p.estoque>=25?'ok':p.estoque>=20?'bom':'ruim'}">
   Estoque: ${p.estoque}
  </div>

  <div class="controle">
    <button onclick="rem(${i})">-</button>
    <span>${carrinho[i]||0}</span>
    <button onclick="add(${i})">+</button>
  </div>

  </div>`;
 });
}

/* CARRINHO */
function add(i){
 carrinho[i]=(carrinho[i]||0)+1;
 atualizar();
 render();
}

function rem(i){
 carrinho[i]--;
 if(carrinho[i]<=0) delete carrinho[i];
 atualizar();
 render();
}

function atualizar(){
 document.getElementById("count").innerText=Object.values(carrinho).reduce((a,b)=>a+b,0);
}

/* CARRINHO LATERAL */
function toggleCart(){
 document.getElementById("cart").classList.toggle("open");
}

/* FINALIZAR */
function finalizar(){

 let nome=document.getElementById("nome").value;
 let end=document.getElementById("endereco").value;

 let msg="Pedido:%0A";

 Object.keys(carrinho).forEach(i=>{
  msg+=`${lista[i].nome} x${carrinho[i]}%0A`;
 });

 window.open(`https://wa.me/${CONFIG.WHATS}?text=${msg}`);
}

carregar();
