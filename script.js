window.app={

produtos:[],
busca:"",

async init(){
this.produtos=await api.produtos();
this.render();
},

render(){
let list=this.produtos.filter(p=>
p.nome.toLowerCase().includes(this.busca.toLowerCase())
);

ui.render(list);
ui.cart();

document.getElementById("count").innerText=cart.total();
},

add(nome,e){
let p=this.produtos.find(p=>p.nome==nome);
cart.add(p);

if(e){
let r=e.target.getBoundingClientRect();
let c=document.getElementById("btnCart").getBoundingClientRect();

let f=document.createElement("div");
f.className="fly";
f.style.left=r.left+"px";
f.style.top=r.top+"px";

f.style.setProperty("--tx",(c.left-r.left)+"px");
f.style.setProperty("--ty",(c.top-r.top)+"px");

document.body.appendChild(f);
setTimeout(()=>f.remove(),600);
}

this.render();
},

dec(n){cart.dec(n);this.render()},
remove(n){cart.remove(n);this.render()}

};

document.getElementById("app").innerHTML=`
<div class="header">
<h1>Bará da Sete</h1>
</div>

<input placeholder="Buscar..." oninput="app.busca=this.value;app.render()">

<div id="produtos" class="grid"></div>

<button id="btnCart" onclick="toggleCart()" style="position:fixed;bottom:20px;right:20px">
🛒 <span id="count">0</span>
</button>

<div id="overlay" class="overlay" onclick="toggleCart()"></div>

<div id="cart" class="cart">
<div style="padding:10px;font-weight:bold">Carrinho</div>

<div id="cartBody" style="flex:1;overflow:auto"></div>

<div style="padding:10px">
<div id="cartTotal"></div>
<button onclick="checkout.open()" class="btn">Finalizar</button>
</div>
</div>
`;

function toggleCart(){
document.getElementById("cart").classList.toggle("open");
document.getElementById("overlay").classList.toggle("open");
}

app.init();
