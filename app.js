const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec"
};

let allProducts = [];

async function loadProducts(){
  try {
    const res = await fetch(CONFIG.API_URL + "?action=getProducts");
    const data = await res.json();

    allProducts = Array.isArray(data) ? data : [];

    document.getElementById("skeleton")?.remove();
    renderProducts(allProducts);

  } catch (err) {
    console.error("Erro ao carregar produtos", err);
  }
}

function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p=>{
    if(p.ativo !== "sim") return;

    el.innerHTML += `
      <div class="product">
        <img src="${p.imagem || ''}">
        <h3>${p.nome}</h3>

        ${
          p.promocao === "sim"
          ? `<p><s>R$ ${p.preco}</s> <b>R$ ${p.precoPromo}</b></p>`
          : `<p>R$ ${p.preco}</p>`
        }

        <div class="qty">
          <button onclick='addToCart(${JSON.stringify(p)})'>+</button>
          <span>${getQty(p.id)}</span>
          <button onclick='removeOne(${p.id})'>-</button>
        </div>
      </div>
    `;
  });
}

function filterProducts(){
  const input = document.getElementById("search");
  if(!input) return;

  const term = input.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p && p.name && p.name.toLowerCase().includes(term)
  );

  renderProducts(filtered);
}

function getQty(id){
  if(!Array.isArray(cart)) return 0;

  const item = cart.find(i=>i.id===id);
  return item ? item.qtd : 0;
}

/* ADMIN */
let clicks = 0;
function adminClick(){
  clicks++;
  if(clicks >= 10){
    const senha = prompt("Senha:");
    if(senha === "1069"){
      window.location.href = "admin/admin.html";
    }
    clicks = 0;
  }
}

loadProducts();
