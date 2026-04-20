const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbxGgjW2-E0wwkcNhRdxk8PtelGe3OXmMRM9USaraHtMGRCyn5niukym3Qr5zbHAFAZ5/exec",
  WHATSAPP: "554996169777"
};

async function sendOrder(){
  const nome = document.getElementById("nome").value;
  const fone = document.getElementById("fone").value;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if(!nome || !fone){
    alert("Preencha os dados");
    return;
  }

  await fetch(CONFIG.API_URL,{
    method:"POST",
    body: JSON.stringify({
      action:"createOrder",
      nome,
      fone,
      cart
    })
  });

  let msg = "Pedido - Bará da Sete\n";

  cart.forEach(p=>{
    msg += `${p.name} x${p.qtd}\n`;
  });

  msg += `Cliente: ${nome}`;

  window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`);

  localStorage.removeItem("cart");
}
