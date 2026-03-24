const CONFIG={
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"555496169777"
};

let lista=[];
let carrinho={};
let categoriaAtual="Todos";

async function carregar(){
 const res=await fetch(CONFIG.sheetCSV);
 const txt=await res.text();
 const linhas=txt.split('\n').slice(1).filter(l=>l.trim());

 lista=linhas.map(l=>{
  const [nome,preco,categoria,estoque,descricao,ativo,promocao,precoPromo,imagem]=l.split(',');
  return {nome,preco,categoria,estoque,descricao,ativo,promocao,precoPromo,imagem}
 });

 montarCategorias();
 render();
}

function montarCategorias(){
 const cats=["Todos",...new Set(lista.map(p=>p.categoria))];
 const el=document.getElementById('categorias');
 el.innerHTML='';

 cats.forEach(c=>{
  el.innerHTML+=`<div onclick="filtrar('${c}')" class="${c===categoriaAtual?'ativo':''}">${c}</div>`;
 });
}

function filtrar(c){
 categoriaAtual=c;
 montarCategorias();
 render();
}

function render(){
 const el=document.getElementById('produtos');
 el.innerHTML='';

 let dados=lista.filter(p=>p.ativo==='sim');
 if(categoriaAtual!=="Todos"){
  dados=dados.filter(p=>p.categoria===categoriaAtual);
 }

 dados.forEach((p,i)=>{
 el.innerHTML+=`
 <div class="card">
 ${p.promocao==='sim'?'<div class="badge">PROMO</div>':''}
 <img src="${p.imagem}">
 <h3>${p.nome}</h3>
 <p class="preco">${p.promocao==='sim' && p.precoPromo ? 'R$ '+p.precoPromo : 'R$ '+p.preco}</p>

 <div class="controle">
  <button onclick="rem(${i})">-</button>
  <span>${carrinho[i]||0}</span>
  <button onclick="add(${i})">+</button>
 </div>

 </div>`;
 });
}

function buscar(q){
 render(lista.filter(p=>p.nome.toLowerCase().includes(q.toLowerCase())));
}

function add(i){
 carrinho[i]=(carrinho[i]||0)+1;
 atualizar();render();
}

function rem(i){
 carrinho[i]=(carrinho[i]||0)-1;
 if(carrinho[i]<=0) delete carrinho[i];
 atualizar();render();
}

function atualizar(){
 let total=0;
 Object.values(carrinho).forEach(q=>total+=q);
 document.getElementById('totalItens').innerText=total;
}

function finalizar(){
 let msg='Pedido:%0A';

 Object.keys(carrinho).forEach(i=>{
  const p=lista[i];
  msg+=`${p.nome} x${carrinho[i]}%0A`;
 });

 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`);
}

carregar();
