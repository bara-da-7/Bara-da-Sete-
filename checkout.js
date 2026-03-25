window.checkout={

open(){
document.getElementById("checkoutModal").style.display="block";
this.render();
},

render(){
document.getElementById("checkoutModal").innerHTML=`
<div style="background:#000;padding:20px">
<h2>Finalizar</h2>

<input id="nome" placeholder="Nome"><br><br>
<input id="cep" placeholder="CEP" onblur="checkout.buscarCep()"><br>
<input id="rua" placeholder="Rua"><br>
<input id="numero" placeholder="Número"><br>

<button onclick="checkout.send()">Enviar</button>
</div>
`;
},

async buscarCep(){
let v=document.getElementById("cep").value;
let d=await api.cep(v);

if(!d.erro){
document.getElementById("rua").value=d.logradouro||"";
}
},

send(){
let nome=document.getElementById("nome").value;

let msg=`Pedido Bara da Sete\nCliente:${nome}\n\n`;

Object.values(cart.items).forEach(i=>{
msg+=`${i.produto.nome} x${i.q}\n`;
});

msg+=`\nTotal:R$ ${cart.price().toFixed(2)}`;

window.open("https://wa.me/5554996169777?text="+encodeURIComponent(msg));

cart.items={};cart.save();
location.reload();
}
};
