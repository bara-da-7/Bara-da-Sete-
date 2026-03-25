window.checkout = {

  enviar() {
    const nome = document.getElementById("nome").value;

    let msg = `Pedido - Bara da Sete\nCliente: ${nome}\n\n`;

    Object.values(cart.items).forEach(i=>{
      msg += `${i.produto.nome} x${i.qtd}\n`;
    });

    msg += `\nTotal: R$ ${cart.totalPreco().toFixed(2)}`;

    window.open(`https://wa.me/5554996169777?text=${encodeURIComponent(msg)}`);

    cart.items = {};
    cart.save();
  }
};
