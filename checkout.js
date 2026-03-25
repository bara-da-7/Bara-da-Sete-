function finalizar(){

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

let msg = "🛒 Pedido:\n";

for(let item in carrinho){
msg += `${item} x${carrinho[item]}\n`;
}

window.open("https://wa.me/5554996169777?text="+encodeURIComponent(msg));
}
