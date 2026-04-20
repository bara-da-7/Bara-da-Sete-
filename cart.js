let cart = [];

try {
  const stored = JSON.parse(localStorage.getItem("cart"));
  cart = Array.isArray(stored) ? stored : [];
} catch {
  cart = [];
}

function save(){
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(p){
  if(!p || !p.id) return;

  const item = cart.find(i=>i.id===p.id);
  if(item) item.qtd++;
  else cart.push({...p, qtd:1});

  save();
}

function removeOne(id){
  const item = cart.find(i=>i.id===id);
  if(!item) return;

  item.qtd--;
  if(item.qtd <= 0){
    cart = cart.filter(i=>i.id!==id);
  }

  save();
}

function renderCart(){
  const el = document.getElementById("cart-items");
  if(!el) return;

  let total = 0;
  el.innerHTML = "";

  cart.forEach(i=>{
    if(!i || !i.price || !i.qtd) return;

    total += Number(i.price) * Number(i.qtd);
    el.innerHTML += `<div>${i.name} x${i.qtd}</div>`;
  });

  const totalEl = document.getElementById("total");
  if(totalEl) totalEl.innerText = "Total: R$ " + total;

  const countEl = document.getElementById("cart-count");
  if(countEl) countEl.innerText = cart.length;
}

function toggleCart(){
  document.getElementById("cart")?.classList.toggle("active");
}

function goCheckout(){
  window.location.href = "checkout/checkout.html";
}

renderCart();
