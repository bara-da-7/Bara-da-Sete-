const API = "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec";

let produtos = [];
let produtoAtual = null;
let imagemAtual = "";

// =====================
// CARREGAR
// =====================
async function carregar(){
  const res = await fetch(API);
  produtos = await res.json();
  render();
}

// =====================
// RENDER
// =====================
function render(){
  const el = document.getElementById("lista");
  el.innerHTML = "";

  produtos.forEach(p=>{
    el.innerHTML += `
      <div class="card">
        ${p.imagem ? `<img src="${p.imagem}">` : ""}
        <b>${p.nome}</b><br>
        R$ ${p.preco}<br>
        Estoque: ${p.estoque}<br>
        ID: ${p.id}<br>

        <button onclick="abrir(${p.id})">Editar</button>
      </div>
    `;
  });
}

// =====================
// ABRIR
// =====================
function abrir(id){

  produtoAtual = produtos.find(p => Number(p.id) === Number(id));

  if(!produtoAtual){
    alert("Erro ao carregar produto");
    return;
  }

  imagemAtual = produtoAtual.imagem || "";

  document.getElementById("modal").classList.remove("hidden");

  f_nome.value = produtoAtual.nome;
  f_preco.value = produtoAtual.preco;
  f_categoria.value = produtoAtual.categoria;
  f_estoque.value = produtoAtual.estoque;
  f_descricao.value = produtoAtual.descricao;

  f_promocao.checked = produtoAtual.promocao === "sim";
  f_precoPromo.value = produtoAtual.precoPromo || "";

  previewImagem(imagemAtual);
}

// =====================
// NOVO
// =====================
function novoProduto(){
  produtoAtual = null;
  imagemAtual = "";

  document.getElementById("modal").classList.remove("hidden");

  f_nome.value = "";
  f_preco.value = "";
  f_categoria.value = "";
  f_estoque.value = "";
  f_descricao.value = "";
  f_promocao.checked = false;
  f_precoPromo.value = "";

  previewImagem("");
}

// =====================
// FECHAR
// =====================
function fechar(){
  document.getElementById("modal").classList.add("hidden");
}

// =====================
// SALVAR
// =====================
async function salvar(){

  const payload = produtoAtual
  ? {
      action:"editarProduto",
      id: produtoAtual.id,
      nome: f_nome.value,
      preco: Number(f_preco.value),
      categoria: f_categoria.value,
      estoque: Number(f_estoque.value),
      descricao: f_descricao.value,
      promocao: f_promocao.checked,
      precoPromo: Number(f_precoPromo.value),
      imagem: imagemAtual
    }
  : {
      tipo:"produto",
      nome: f_nome.value,
      preco: Number(f_preco.value),
      categoria: f_categoria.value,
      estoque: Number(f_estoque.value),
      descricao: f_descricao.value,
      promocao: f_promocao.checked,
      precoPromo: Number(f_precoPromo.value),
      imagem: imagemAtual
    };

  await fetch(API,{
    method:"POST",
    body: JSON.stringify(payload)
  });

  fechar();
  carregar();
}

// =====================
// UPLOAD
// =====================
const drop = document.getElementById("drop");
const fileInput = document.getElementById("fileInput");

drop.onclick = () => fileInput.click();

drop.ondragover = e => e.preventDefault();

drop.ondrop = e=>{
  e.preventDefault();
  upload(e.dataTransfer.files[0]);
};

fileInput.onchange = e=>{
  upload(e.target.files[0]);
};

async function upload(file){

  if(!file) return;

  document.getElementById("status").innerText = "Enviando...";

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "ml_padrao");

  const res = await fetch("https://api.cloudinary.com/v1_1/dy61d0gt8/image/upload",{
    method:"POST",
    body: form
  });

  const data = await res.json();

  imagemAtual = data.secure_url;

  previewImagem(imagemAtual);

  document.getElementById("status").innerText = "Imagem pronta ✔";
}

// =====================
// PREVIEW
// =====================
function previewImagem(url){
  const el = document.getElementById("preview");
  el.innerHTML = url ? `<img src="${url}">` : "";
}

// =====================
carregar();
carregar();
