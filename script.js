const CONFIG={
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"555496169777"
};

let lista=[];
let carrinho={};

async function carregar(){

 const res=await fetch(CONFIG.sheetCSV);
 const txt=await res.text();

 const linhas=txt.split('\n').slice(1);

 lista=linhas.map(l=>{
  const c=l.split(',');
  return{
    nome:c[0],
    preco:parseFloat(c[1])||0,
    categoria:c[2],
    estoque:parseInt(c[3])||0,
    ativo:c[5],
    promocao:c[6],
    precoPromo:parseFloat(c[7])||0,
    imagem:c[8]
  }
 });

 render();
}

function render(){

 const el=document.getElementById('produtos');
 el.innerHTML='';

 let dados=lista.filter(p=>p.ativo==='sim');

 dados.sort((a,b)=>{
   if(a.promocao==='sim' && b.promocao!=='sim') return -1;
   if(a.promocao!=='sim' && b.promocao==='sim') return 1;
   return a.nome.localeCompare(b.nome);
 });

 dados.forEach((p,i)=>{

 let preco = (p.promocao==='sim' && p.precoPromo) ? p.precoPromo : p.preco;

 el.innerHTML+=`
 <div class="card">

 ${p.promocao==='sim'?'<div class="desconto">PROMO</div>':''}

 <img src="${p.imagem || 'https://via.placeholder.com/300'}">

 <h3>${p.nome}</h3>

 ${p.promocao==='sim'?`<div class="preco-antigo">R$ ${p.preco}</div>`:''}
 <div class="preco-novo">R$ ${preco}</div>

 <div class="controle">
  <button onclick="rem(${i})">-</button>
  <span>${carrinho[i]||0}</span>
  <button onclick="add(${i})">+</button>
 </div>

 </div>`;
 });
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
 let t=0;
 Object.values(carrinho).forEach(v=>t+=v);
 document.getElementById('totalItens').innerText=t;
}

function finalizar(){
 let msg='Pedido:%0A';

 Object.keys(carrinho).forEach(i=>{
  msg+=`${lista[i].nome} x${carrinho[i]}%0A`;
 });

 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`);
}

carregar();
