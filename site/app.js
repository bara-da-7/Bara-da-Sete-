let allProducts = [];

async function loadProducts(){
  const res = await fetch(CONFIG.API_URL + "?action=getProducts");
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(products){
  const el = document.getElementById("products");
  el.innerHTML = "";

  products.forEach(p=>{
    el.innerHTML += `
      <div class="product">
        <div class="badge">🔥 Promoção</div>
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>R$ ${p.price}</p>

        <div class="qty">
          <button onclick="addToCart(${JSON.stringify(p)})">+</button>
        </div>
      </div>
    `;
  });
}

function filterProducts(){
  const term = document.getElementById("search").value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
}

loadProducts();
