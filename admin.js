async function loadAdmin(){
  const produtos = await api.getProdutos();

  document.getElementById("admin-list").innerHTML =
    produtos.map(p=>`<div>${p.nome}</div>`).join('');
}

loadAdmin();
