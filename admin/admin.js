const API = "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec";

let produtos = [];
let produtoSelecionado = null;

// ==========================
// CARREGAR PRODUTOS
// ==========================
async function carregar(){
  const res = await fetch(API);
  produtos = await res.json();
  render();
}

// ==========================
// RENDER
// ==========================
function render(){
  const el = document.getElementById("lista");
  el.innerHTML = "";

  produtos.forEach(p=>{
    el.innerHTML += `
      <div class="product">
        <b>${p.nome}</b><br>
        R$ ${p.preco}<br>
        Estoque: ${p.estoque}<br>

        <button onclick="editar(${p.id})">Selecionar / Editar</button>
      </div>
    `;
  });
}

// ==========================
// SELECIONAR PRODUTO
// ==========================
function editar(id){
  produtoSelecionado = id;

  const p = produtos.find(x=>x.id==id);

  document.getElementById("status").innerText =
    "Selecionado: " + p.nome;

  // Edição rápida
  const nome = prompt("Nome:", p.nome);
  const preco = prompt("Preço:", p.preco);

  fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"editarProduto",
      id,
      nome,
      preco:Number(preco),
      estoque:p.estoque
    })
  }).then(()=>{
    carregar();
  });
}

// ==========================
// DRAG & DROP AUTOMÁTICO
// ==========================
const drop = document.getElementById("drop");

drop.ondragover = e => e.preventDefault();

drop.ondrop = async e=>{
  e.preventDefault();

  if(!produtoSelecionado){
    alert("Selecione um produto primeiro");
    return;
  }

  const file = e.dataTransfer.files[0];

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "ml_padrao");

  document.getElementById("status").innerText = "Enviando imagem...";

  const res = await fetch("https://api.cloudinary.com/v1_1/dy61d0gt8/image/upload",{
    method:"POST",
    body:form
  });

  const img = await res.json();

  await fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"updateImage",
      id: produtoSelecionado,
      img: img.secure_url
    })
  });

  document.getElementById("status").innerText = "Imagem atualizada com sucesso!";
};

// ==========================
carregar();
