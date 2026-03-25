const API="https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec";

const CSV="https://docs.google.com/spreadsheets/d/e/2PACX-1vTomkc32pfiuh9ocLv-N5nNlBLdEtdtvlKYWy-t0o5xX_emP-qLaE1BCChpQVLi0AQg_Jh0V_ZakUHG/pub?gid=0&single=true&output=csv";

const CLOUD={
 cloudName:"dy61d0gt8",
 uploadPreset:"ml_padrao"
};

let produtos=[];
let editando=null;

/* LOAD */
async function carregar(){

 const res=await fetch(CSV);
 const txt=await res.text();

 const linhas=txt.split("\n").slice(1);

 produtos=linhas.map(l=>{
  let c=l.split(",");
  return{
   nome:c[0],
   preco:c[1],
   categoria:c[2],
   estoque:c[3],
   promocao:c[6],
   precoPromo:c[7],
   imagem:c[8]
  };
 });

 renderLista();
}

/* RENDER */
function renderLista(){

 let el=document.getElementById("lista");
 el.innerHTML="";

 produtos.forEach(p=>{

  el.innerHTML+=`
  <div style="border:1px solid #ccc;margin:5px;padding:5px">

    <b>${p.nome}</b><br>

    <button onclick='preencher(${JSON.stringify(p)})'>Editar</button>
    <button onclick='deletar("${p.nome}")'>Excluir</button>

  </div>`;
 });
}

/* PREENCHER */
function preencher(p){
 editando=p.nome;

 document.getElementById("nome").value=p.nome;
 document.getElementById("preco").value=p.preco;
 document.getElementById("categoria").value=p.categoria;
 document.getElementById("estoque").value=p.estoque;
 document.getElementById("precoPromo").value=p.precoPromo;
}

/* UPLOAD */
async function upload(file){

 const f=new FormData();
 f.append("file",file);
 f.append("upload_preset",CLOUD.uploadPreset);

 const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.cloudName}/image/upload`,{
  method:"POST",
  body:f
 });

 const d=await r.json();
 return d.secure_url;
}

/* SALVAR */
async function salvar(){

 const file=document.getElementById("img").files[0];
 let url="";

 if(file) url=await upload(file);

 await fetch(API,{
  method:"POST",
  body:JSON.stringify({
    tipo:"add",
    nome:document.getElementById("nome").value,
    preco:document.getElementById("preco").value,
    categoria:document.getElementById("categoria").value,
    estoque:document.getElementById("estoque").value,
    promocao:document.getElementById("promocao").value,
    precoPromo:document.getElementById("precoPromo").value,
    imagem:url
  })
 });

 alert("Salvo!");
 carregar();
}

/* EDITAR */
async function editar(){

 await fetch(API,{
  method:"POST",
  body:JSON.stringify({
    tipo:"edit",
    nomeOriginal:editando,
    nome:document.getElementById("nome").value,
    preco:document.getElementById("preco").value,
    categoria:document.getElementById("categoria").value,
    estoque:document.getElementById("estoque").value,
    promocao:document.getElementById("promocao").value,
    precoPromo:document.getElementById("precoPromo").value,
    imagem:""
  })
 });

 alert("Editado!");
 carregar();
}

/* DELETE */
async function deletar(nome){

 if(!confirm("Excluir?")) return;

 await fetch(API,{
  method:"POST",
  body:JSON.stringify({
    tipo:"delete",
    nome:nome
  })
 });

 alert("Removido!");
 carregar();
}

carregar();
