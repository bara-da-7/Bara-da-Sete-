let cart = JSON.parse(localStorage.getItem("cart")) || [];

function save(){
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function addToCart(p){
  const item = cart.find(i=>i.id===p.id);
  if(item) item.qtd++;
  else cart.push({...p, qtd:1});
  save();
}

function renderCart(){
  const el = document.getElementById("cart-items");
  let total = 0;

  el.innerHTML = "";

  cart.forEach(i=>{
    total += i.price * i.qtd;
    el.innerHTML += `${i.name} x${i.qtd}<br>`;
  });

  document.getElementById("total").innerText = "Total: R$ " + total;
  document.getElementById("cart-count").innerText = cart.length;
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
}

function goCheckout(){
  window.location.href = "../checkout/checkout.html";
}

renderCart();
