const API = "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec";

let produtos = [];
let produtoAtual = null;   // estado confiável do item em edição
let imagemAtual = "";      // URL após upload

// =====================
// LOAD
// =====================
async function carregar(){
  const res = await fetch(API);
  produtos = await res.json();
  render();
}

// =====================
// LISTA
// =====================
function render(){
  const el = document.getElementById("lista");
  el.innerHTML = "";

  produtos.forEach(p=>{
    el.innerHTML += `
      <div class="card">
        ${p.imagem ? `<img src="${p.imagem}">` : ""}
        <div class="name">${p.nome}</div>
        <div>R$ ${p.preco}</div>
        <div>Estoque: ${p.estoque}</div>
        ${p.promocao === "sim" ? `<div style="color:red">🔥 Promoção</div>` : ""}

        <div class="btns">
          <button onclick="abrir(${p.id})">Editar</button>
        </div>
      </div>
    `;
  });
}

// =====================
// ABRIR MODAL (EDITAR)
// =====================
function abrir(id){
  produtoAtual = produtos.find(p=>p.id == id);
  imagemAtual = produtoAtual.imagem || "";

  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-title").innerText = "Editar Produto";

  // preencher campos
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
// NOVO PRODUTO
// =====================
function novoProduto(){
  produtoAtual = null;
  imagemAtual = "";

  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-title").innerText = "Novo Produto";

  // limpar
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

  const payload = {
    tipo: produtoAtual ? undefined : "produto",
    action: produtoAtual ? "editarProduto" : undefined,
    id: produtoAtual ? produtoAtual.id : undefined,

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
// UPLOAD (DRAG OU CLICK)
// =====================
const drop = document.getElementById("drop");
const fileInput = document.getElementById("fileInput");

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
