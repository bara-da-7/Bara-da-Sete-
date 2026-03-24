const CONFIG={
 cloudName:"dy61d0gt8",
 uploadPreset:"ml_padrao",
 scriptURL:"https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec",
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"554996169777"
};

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
 document.getElementById('totalProdutos').innerText=lista.length;
}

function render(data){
 const el=document.getElementById('produtos');
 el.innerHTML='';

 data.forEach((p,i)=>{
 el.innerHTML+=`
 <div class="card">
 ${p.promocao==='sim'?'<div class="badge">PROMO</div>':''}
 <img src="${p.imagem}">
 <h3>${p.nome}</h3>
 <p>${p.descricao}</p>
 <p>${p.promocao==='sim' && p.precoPromo ? 'R$ '+p.precoPromo : 'R$ '+p.preco}</p>
 <small>Estoque: ${p.estoque}</small>
 <button onclick="add(${i})">+</button>
 <button onclick="rem(${i})">-</button>
 <span>${carrinho[i]||0}</span>
 </div>`;
 });
}

function buscar(q){
 render(lista.filter(p=>p.nome.toLowerCase().includes(q.toLowerCase()) && p.ativo==='sim'));
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
 document.getElementById('totalItens').innerText=total;
}

async function finalizar(){
 let itens=[];
 let total=0;
 let msg='Pedido:%0A';

 Object.keys(carrinho).forEach(i=>{
  const p=lista[i];
  const qtd=carrinho[i];
  const preco=parseFloat(p.promocao==='sim' && p.precoPromo ? p.precoPromo : p.preco);

  total+=preco*qtd;
  itens.push(`${p.nome} x${qtd}`);
  msg+=`${p.nome} x${qtd} - R$ ${preco}\n`;
 });

 msg+=`%0ATotal: R$ ${total.toFixed(2).replace('.',',')}`;

 await fetch(CONFIG.scriptURL,{
  method:'POST',
  body: JSON.stringify({
    tipo:'pedido',
    itens: itens.join(' | '),
    total
  })
 });

 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`);
}

carregar();
