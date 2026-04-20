const API = "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec";

let produtos = [];

// ==========================
// CARREGAR
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
        ID: ${p.id}

        <div class="actions">
          <button onclick="editar(${p.id})">Editar</button>
        </div>
      </div>
    `;
  });
}

// ==========================
// CRIAR
// ==========================
async function criarProduto(){
  await fetch(API,{
    method:"POST",
    body: JSON.stringify({
      tipo:"produto",
      nome: nome.value,
      preco: Number(preco.value),
      categoria: categoria.value,
      estoque: Number(estoque.value),
      descricao: descricao.value
    })
  });

  alert("Produto criado");
  carregar();
}

// ==========================
// EDITAR
// ==========================
function editar(id){
  const p = produtos.find(x=>x.id==id);

  const novoNome = prompt("Nome:", p.nome);
  const novoPreco = prompt("Preço:", p.preco);
  const novoEstoque = prompt("Estoque:", p.estoque);

  if(!novoNome) return;

  fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"editarProduto",
      id:id,
      nome:novoNome,
      preco:Number(novoPreco),
      estoque:Number(novoEstoque)
    })
  })
  .then(()=> {
    alert("Atualizado!");
    carregar();
  });
}

// ==========================
// UPLOAD
// ==========================
drop.ondragover = e => e.preventDefault();

drop.ondrop = async e=>{
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  const id = idProduto.value;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "ml_padrao");

  const res = await fetch("https://api.cloudinary.com/v1_1/dy61d0gt8/image/upload",{
    method:"POST",
    body:form
  });

  const img = await res.json();

  await fetch(API,{
    method:"POST",
    body: JSON.stringify({
      action:"updateImage",
      id:id,
      img: img.secure_url
    })
  });

  alert("Imagem atualizada!");
};

carregar();
