const CONFIG={
 sheetCSV:"https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv",
 whatsapp:"555496169777"
};

let lista=[];
let carrinho={};

/* =========================
   PARSER CSV PROFISSIONAL
========================= */
function parseCSV(text){
 const linhas = text.trim().split("\n");
 const headers = linhas.shift().split(",");

 return linhas.map(linha=>{
   const valores = linha.split(",");
   let obj={};

   headers.forEach((h,i)=>{
     obj[h.trim()] = (valores[i] || "").trim();
   });

   return obj;
 });
}

/* =========================
   CARREGAR
========================= */
async function carregar(){

 const el=document.getElementById("produtos");
 el.innerHTML="<p>Carregando...</p>";

 try{
   const res=await fetch(CONFIG.sheetCSV);
   const txt=await res.text();

   const dados=parseCSV(txt);

   lista=dados.map(p=>({
     nome:p.nome,
     preco:parseFloat(p.preco)||0,
     categoria:p.categoria,
     estoque:parseInt(p.estoque)||0,
     ativo:(p.ativo||"").toLowerCase(),
     promocao:(p["promocao"]||"").toLowerCase(),
     precoPromo:parseFloat(p.precoPromo)||0,
     imagem:p.imagem
   }));

   render();

 }catch(e){
   el.innerHTML="<p>Erro ao carregar produtos</p>";
   console.error(e);
 }
}

/* =========================
   RENDER
========================= */
function render(){

 const el=document.getElementById("produtos");
 el.innerHTML="";

 let dados = lista
  .filter(p=>p.ativo==="sim")
  .sort((a,b)=>{
    if(a.promocao==="sim" && b.promocao!=="sim") return -1;
    if(a.promocao!=="sim" && b.promocao==="sim") return 1;
    return a.nome.localeCompare(b.nome);
  });

 if(dados.length===0){
   el.innerHTML="<p>Nenhum produto encontrado</p>";
   return;
 }

 dados.forEach((p,i)=>{

   let preco = p.promocao==="sim" && p.precoPromo ? p.precoPromo : p.preco;

   el.innerHTML+=`
   <div class="card">

   ${p.promocao==="sim" ? `<div class="desconto">PROMO</div>` : ""}

   <img src="${p.imagem || 'https://via.placeholder.com/300x200'}">

   <h3>${p.nome}</h3>

   ${p.promocao==="sim" ? `<div class="preco-antigo">R$ ${p.preco}</div>` : ""}

   <div class="preco-novo">R$ ${preco}</div>

   <div class="controle">
     <button onclick="rem(${i})">-</button>
     <span>${carrinho[i]||0}</span>
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
 atualizar(); render();
}

function rem(i){
 carrinho[i]=(carrinho[i]||0)-1;
 if(carrinho[i]<=0) delete carrinho[i];
 atualizar(); render();
}

function atualizar(){
 let total=0;
 Object.values(carrinho).forEach(v=>total+=v);
 document.getElementById("totalItens").innerText=total;
}

function finalizar(){
 let msg="Pedido:%0A";

 Object.keys(carrinho).forEach(i=>{
   msg+=`${lista[i].nome} x${carrinho[i]}%0A`;
 });

 window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`);
}

carregar();
