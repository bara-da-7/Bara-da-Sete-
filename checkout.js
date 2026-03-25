function finalizarPedido(nome, tipoEntrega, endereco) {
  const cart = getCart();
  const itemList = Object.values(cart);

  let msg = `🛒 *NOVO PEDIDO - Bará da Sete*%0A`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━%0A`;
  msg += `👤 ${nome}%0A`;

  msg += `%0A📦 *ITENS*%0A`;

  itemList.forEach(({ produto, quantidade }) => {
    const preco = parseFloat(produto.preco);

    msg += `▪️ ${produto.nome}%0A`;
    msg += `   Qtd: ${quantidade}%0A`;
    msg += `   R$ ${(preco * quantidade).toFixed(2)}%0A%0A`;
  });

  const total = totalPreco();

  msg += `💰 TOTAL: R$ ${total.toFixed(2)}%0A`;

  if (tipoEntrega === "entrega") {
    msg += `%0A📍 ${endereco.rua}, ${endereco.numero}%0A`;
  } else {
    msg += `%0A🏪 Retirada no local`;
  }

  window.open(`https://wa.me/5554996169777?text=${msg}`);
}
