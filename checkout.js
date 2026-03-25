let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};

function finalizar(){

    let nome = document.getElementById("nome").value;
    let tel = document.getElementById("telefone").value;

    let total = 0;
    let lista = "";

    for(let item in carrinho){
        let qtd = carrinho[item];
        lista += `• ${item} x${qtd}\n`;
        total += qtd;
    }

    let msg = `
🛒 *Novo Pedido - Bará da Se7e*

📦 *Produtos:*
${lista}

💰 *Total:* ${total}

👤 ${nome}
📞 ${tel}
    `;

    window.open(`https://wa.me/5554996169777?text=${encodeURIComponent(msg)}`);
}
