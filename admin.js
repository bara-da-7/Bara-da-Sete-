const SCRIPT = "https://script.google.com/macros/s/AKfycbzJVNHNmRoMNRtBPusHXL04VyphdycYXSGyWMWTgZN0Jv4rf1HLqn7YHtJlPKq8dml8/exec";

const CLOUD = "dy61d0gt8";
const PRESET = "ml_padrao";

let produtos = [];

/* LOGIN */
function login(){
  if(document.getElementById("senha").value === "99861309"){
    document.getElementById("painel").style.display = "block";
    carregarProdutos();
  }
}

/* CARREGAR PRODUTOS */
async function carregarProdutos(){

  const res = await fetch("SUA_URL_CSV");
  const csv = await res.text();

  produtos = csv.split("\n").slice(1).map(l=>{
    const c = l.split(",");
    return {
      nome:c[0],
      preco:c[1],
      categoria:c[2],
      estoque:c[3],
      descricao:c[4],
      ativo:c[5],
      promocao:c[6],
      precoPromo:c[7],
      imagem:c[8]
    };
  });

  renderLista();
}

/* LISTA */
function renderLista(){
  const div = document.getElementById("lista");

  div.innerHTML = produtos.map(p=>`
    <div>
      ${p.nome}
      <button onclick="editar('${p.nome}')">Editar</button>
      <button onclick="remover('${p.nome}')">Excluir</button>
    </div>
  `).join("");
}

/* EDITAR */
function editar(nome){
  const p = produtos.find(x=>x.nome===nome);

  document.getElementById("nome").value = p.nome;
  document.getElementById("preco").value = p.preco;
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("estoque").value = p.estoque;

  window.nomeOriginal = nome;
}

/* REMOVER */
async function remover(nome){

  await fetch(SCRIPT,{
    method:"POST",
    body: JSON.stringify({
      tipo:"removerProduto",
      nome
    })
  });

  alert("Removido");
  carregarProdutos();
}

/* UPLOAD */
async function upload(file){
  let form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);

  let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,{
    method:"POST",
    body:form
  });

  let data = await res.json();
  return data.secure_url;
}

/* SALVAR */
async function salvar(){

  let file = document.getElementById("imagem").files[0];
  let img = file ? await upload(file) : "";

  await fetch(SCRIPT,{
    method:"POST",
    body: JSON.stringify({
      tipo: window.nomeOriginal ? "editarProduto" : "novoProduto",
      nomeOriginal: window.nomeOriginal,
      nome: document.getElementById("nome").value,
      preco: document.getElementById("preco").value,
      categoria: document.getElementById("categoria").value,
      estoque: document.getElementById("estoque").value,
      descricao:"",
      ativo:"sim",
      promocao:"nao",
      precoPromo:"",
      imagem: img
    })
  });

  alert("Salvo!");
  window.nomeOriginal = null;
  carregarProdutos();
}
