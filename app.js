const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec"
};

let allProducts = [];

async function loadProducts(){
  const res = await fetch(CONFIG.API_URL + "?action=getProducts");
  allProducts = await res.json();

  document.getElementById("skeleton").style.display = "none";
  renderProducts(allProducts);
}

function renderProducts(list){
  const el = document.getElementById("products");
  el.innerHTML = "";

  list.forEach(p=>{
    el.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>R$ ${p.price}</p>

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
  const term = document.getElementById("search").value.toLowerCase();
  renderProducts(allProducts.filter(p=>p.name.toLowerCase().includes(term)));
}

function getQty(id){
  const item = cart.find(i=>i.id===id);
  return item ? item.qtd : 0;
}

/* ADMIN SECRETO */
let clicks = 0;
function adminClick(){
  clicks++;
  if(clicks >= 10){
    const senha = prompt("Senha:");
    if(senha === "1069"){
      window.location.href = "admin/admin.html"; // CORRIGIDO
    }
    clicks = 0;
  }
}

loadProducts();
