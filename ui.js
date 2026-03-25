window.ui={

card(p){
let q=cart.items[p.nome]?.q||0;

return `
<div class="card">
<img src="${p.imagem||''}" style="height:140px;width:100%;object-fit:cover">

<div style="padding:10px">
<h4>${p.nome}</h4>
<p>R$ ${parseFloat(p.preco).toFixed(2)}</p>

${q==0
? `<button class="btn" onclick="app.add('${p.nome}',event)">Adicionar</button>`
: `<div>
<button onclick="app.dec('${p.nome}')">-</button>
${q}
<button onclick="app.add('${p.nome}',event)">+</button>
</div>`
}
</div>
</div>`;
},

render(list){
document.getElementById("produtos").innerHTML=
list.map(ui.card).join('');
},

cart(){
let html=Object.values(cart.items).map(i=>{
return `<div>
${i.produto.nome} x${i.q}
<button onclick="app.dec('${i.produto.nome}')">-</button>
<button onclick="app.add('${i.produto.nome}')">+</button>
<button onclick="app.remove('${i.produto.nome}')">x</button>
</div>`;
}).join('');

document.getElementById("cartBody").innerHTML=html;
document.getElementById("cartTotal").innerText=
"R$ "+cart.price().toFixed(2);
}
};
