const CONFIG={
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"555496169777",
 api:"https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec"
};

let lista=[];
let carrinho={};
let categoriaAtual="Todos";
let buscaAtual="";

/* =========================
   CARREGAR DADOS
========================= */
async function carregar(){

 const el=document.getElementById('produtos');

 // skeleton loading
 el.innerHTML='';
 for(let i=0;i<6;i++){
  el.innerHTML+=`<div class="skeleton"></div>`;
 }

 try{
   const res=await fetch(CONFIG.sheetCSV);
   const txt=await res.text();

   const linhas=txt.split('\n').slice(1).filter(l=>l.trim());

   lista=linhas.map(l=>{
     const col=l.split(',');

     return{
       nome:col[0],
       preco:parseFloat(col[1])||0,
       categoria:col[2],
       estoque:parseInt(col[3])||0,
       descricao:col[4],
       ativo:(col[5]||'').toLowerCase(),
       promocao:(col[6]||'').toLowerCase(),
       precoPromo:parseFloat(col[7])||0,
       imagem:col[8]
     }
   });

   montarCategorias();
   render();

 }catch(e){
   el.innerHTML='<p style="text-align:center">Erro ao carregar produtos</p>';
 }
}

/* =========================
   CATEGORIAS
========================= */
function montarCategorias(){
 const cats=["Todos",...new Set(lista.map(p=>p.categoria).filter(Boolean))];

 const el=document.getElementById('categorias');
 el.innerHTML='';

 cats.forEach(c=>{
   el.innerHTML+=`
   <div onclick="filtrar('${c}')" class="${c===categoriaAtual?'ativo':''}">
     ${c}
   </div>`;
 });
}

function filtrar(c){
 categoriaAtual=c;
 montarCategorias();
 render();
}

/* =========================
   BUSCA
========================= */
function buscar(q){
 buscaAtual=q.toLowerCase();
 render();
}

/* =========================
   RENDER PRINCIPAL
========================= */
function render(){

 const el=document.getElementById('produtos');
 el.innerHTML='';

 let dados = lista
   .filter(p => p.ativo === 'sim')
   .filter(p => p.nome.toLowerCase().includes(buscaAtual))
   .sort((a,b)=>{

     // promo primeiro
     if(a.promocao==='sim' && b.promocao!=='sim') return -1;
     if(a.promocao!=='sim' && b.promocao==='sim') return 1;

     // alfabético
     return a.nome.localeCompare(b.nome,'pt-BR',{sensitivity:'base'});
   });

 // filtro categoria
 if(categoriaAtual!=="Todos"){
   dados = dados.filter(p=>p.categoria===categoriaAtual);
 }

 if(dados.length===0){
   el.innerHTML='<p style="text-align:center">Nenhum produto encontrado</p>';
   return;
 }

 dados.forEach((p,i)=>{

   let precoHTML='';
   let descontoHTML='';

   if(p.promocao==='sim' && p.precoPromo){
     const desc=Math.round((1-(p.precoPromo/p.preco))*100);

     precoHTML=`
       <div class="preco-antigo">R$ ${p.preco.toFixed(2)}</div>
       <div class="preco-novo">R$ ${p.precoPromo.toFixed(2)}</div>
     `;

     descontoHTML=`<div class="desconto">-${desc}%</div>`;

   }else{
     precoHTML=`<div class="preco-novo">R$ ${p.preco.toFixed(2)}</div>`;
   }

   let perc=Math.min((p.estoque/50)*100,100);

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

/* =========================
   CARRINHO
========================= */
function add(i){
 carrinho[i]=(carrinho[i]||0)+1;
 atualizar();
 render();

 animar(i);
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

/* =========================
   ANIMAÇÃO
========================= */
function animar(i){
 const el=document.getElementById(`qtd-${i}`);
 if(el){
   el.classList.add('add-anim');
   setTimeout(()=>el.classList.remove('add-anim'),300);
 }
}

/* =========================
   FINALIZAR PEDIDO
========================= */
async function finalizar(){

 if(Object.keys(carrinho).length===0){
   alert("Carrinho vazio");
   return;
 }

 let itensTxt='';
 let total=0;
 let listaEnvio=[];

 Object.keys(carrinho).forEach(i=>{
   const p=lista[i];
   const qtd=carrinho[i];

   let preco = (p.promocao==='sim' && p.precoPromo) ? p.precoPromo : p.preco;

   total += preco * qtd;

   itensTxt += `${p.nome} x${qtd} - R$ ${(preco*qtd).toFixed(2)}\n`;

   listaEnvio.push({
     nome:p.nome,
     qtd:qtd
   });
 });

 try{
   await fetch(CONFIG.api,{
     method:"POST",
     body:JSON.stringify({
       itens:itensTxt,
       total:total.toFixed(2),
       lista:listaEnvio
     })
   });
 }catch(e){
   console.log("Erro envio pedido");
 }

 let msg=`Pedido:%0A${itensTxt}%0ATotal: R$ ${total.toFixed(2)}`;

 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
}

/* =========================
   START
========================= */
carregar();
