const CONFIG={
 senha:"99861309",
 cloudName:"dy61d0gt8",
 uploadPreset:"ml_padrao",
 scriptURL:"https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec",
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"554996169777"
}

let lista=[];
let carrinho={};

async function carregar(){
 const res=await fetch(CONFIG.sheetCSV);
 const txt=await res.text();
 const linhas=txt.split('\n').slice(1).filter(l=>l.trim());

 lista=linhas.map(l=>{
  const [nome,preco,categoria,estoque,descricao,ativo,promocao,precoPromo,imagem]=l.split(',');
  return {nome,preco,categoria,estoque:+estoque,descricao,ativo,promocao,precoPromo,imagem}
 });

 render(lista.filter(p=>p.ativo==='sim'));
 atualizarMetricas();
}

function render(data){
 const el=document.getElementById('produtos');
 el.innerHTML='';

 data.forEach((p,i)=>{
 el.innerHTML+=`
 <div class="card fade">
 ${p.promocao==='sim'?'<div class="badge">PROMO</div>':''}
 <img src="${p.imagem}">
 <h3>${p.nome}</h3>
 <p>${p.descricao}</p>
 <p>${p.promocao==='sim'&&p.precoPromo?('R$ '+p.precoPromo):('R$ '+p.preco)}</p>
 <small>Estoque: ${p.estoque}</small>
 <div class="btns">
 <button onclick="rem(${i})">-</button>
 <span>${carrinho[i]||0}</span>
 <button onclick="add(${i})">+</button>
 </div>
 </div>`
 });
}

function add(i){
 if(lista[i].estoque<=0) return alert('Sem estoque');
 carrinho[i]=(carrinho[i]||0)+1;
 lista[i].estoque--;
 atualizar();render(lista);
}

function rem(i){
 carrinho[i]=(carrinho[i]||0)-1;
 if(carrinho[i]<=0) delete carrinho[i];
 lista[i].estoque++;
 atualizar();render(lista);
}

function atualizar(){
 let total=0;
 Object.values(carrinho).forEach(q=>total+=q);
 totalItens.innerText=total;
}

function atualizarMetricas(){
 document.getElementById('totalProdutos').innerText=lista.length;
}

function finalizar(){
 let msg='Pedido:%0A';let total=0;
 Object.keys(carrinho).forEach(i=>{
  const p=lista[i];const qtd=carrinho[i];
  const preco=parseFloat(p.promocao==='sim'&&p.precoPromo?p.precoPromo:p.preco);
  total+=preco*qtd;
  msg+=`${p.nome} x${qtd} - R$ ${preco}\n`;
 });
 msg+=`%0ATotal: R$ ${total.toFixed(2).replace('.',',')}`;
 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`);
}

carregar();
