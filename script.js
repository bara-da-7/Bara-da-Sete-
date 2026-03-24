const CONFIG={
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"555496169777"
};

let lista=[];
let carrinho={};
let categoriaAtual="Todos";

async function carregar(){

 const el=document.getElementById('produtos');

 // skeleton
 for(let i=0;i<6;i++){
  el.innerHTML+=`<div class="skeleton"></div>`;
 }

 const res=await fetch(CONFIG.sheetCSV);
 const txt=await res.text();

 const linhas=txt.split('\n').slice(1).filter(l=>l.trim());

 lista=linhas.map(l=>{
  const [nome,preco,categoria,estoque,descricao,ativo,promocao,precoPromo,imagem]=l.split(',');
  return {
    nome,
    preco:parseFloat(preco),
    categoria,
    estoque:parseInt(estoque),
    descricao,
    ativo,
    promocao,
    precoPromo:parseFloat(precoPromo),
    imagem
  }
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

 let dados = lista
  .filter(p => p.ativo === 'sim')
  .sort((a,b)=>{

    if(a.promocao==='sim' && b.promocao!=='sim') return -1;
    if(a.promocao!=='sim' && b.promocao==='sim') return 1;

    return a.nome.localeCompare(b.nome,'pt-BR',{sensitivity:'base'});
  });

 if(categoriaAtual!=="Todos"){
  dados = dados.filter(p=>p.categoria===categoriaAtual);
 }

 dados.forEach((p,i)=>{

  let precoHTML='';
  let descontoHTML='';

  if(p.promocao==='sim' && p.precoPromo){
    const desc=Math.round((1-(p.precoPromo/p.preco))*100);

    precoHTML=`
      <div class="preco-antigo">R$ ${p.preco}</div>
      <div class="preco-novo">R$ ${p.precoPromo}</div>
    `;

    descontoHTML=`<div class="desconto">-${desc}%</div>`;
  }else{
    precoHTML=`<div class="preco-novo">R$ ${p.preco}</div>`;
  }

  let perc=(p.estoque/50)*100;

  el.innerHTML+=`
  <div class="card">
    ${descontoHTML}

    <img src="${p.imagem || 'https://via.placeholder.com/300x200?text=Produto'}">

    <h3>${p.nome}</h3>

    ${precoHTML}

    <div class="estoque-bar">
      <div class="estoque-fill" style="width:${perc}%"></div>
    </div>

    <div class="controle">
      <button onclick="rem(${i})">-</button>
      <span id="qtd-${i}">${carrinho[i]||0}</span>
      <button onclick="add(${i})">+</button>
    </div>

  </div>`;
 });
}

function buscar(q){
 render();
}

function add(i){
 carrinho[i]=(carrinho[i]||0)+1;
 atualizar();
 render();

 const el=document.getElementById(`qtd-${i}`);
 if(el){
  el.classList.add('add-anim');
  setTimeout(()=>el.classList.remove('add-anim'),300);
 }
}

function rem(i){
 carrinho[i]=(carrinho[i]||0)-1;
 if(carrinho[i]<=0) delete carrinho[i];
 atualizar();
 render();
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
