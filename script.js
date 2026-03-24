import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "bara-da-sete.firebaseapp.com",
  projectId: "bara-da-sete"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let produtos=[];
let carrinho={};

/* FIREBASE */
onSnapshot(collection(db,"produtos"),snap=>{
    produtos=[];
    snap.forEach(d=>produtos.push({id:d.id,...d.data()}));
    render();
});

/* RENDER */
function render(){
    let el=document.getElementById("produtos");
    el.innerHTML="";

    produtos.forEach(p=>{
        let qtd=carrinho[p.id]||0;

        el.innerHTML+=`
        <div class="card">
            ${p.promocao?'<div class="ribbon">PROMOÇÃO</div>':''}
            <img src="${p.imagem}">
            <h3>${p.nome}</h3>
            <div class="price">R$ ${p.preco}</div>

            <div class="controls">
                <button onclick="menos('${p.id}')">-</button>
                ${qtd}
                <button onclick="mais('${p.id}')">+</button>
            </div>
        </div>`;
    });
}

/* CARRINHO */
document.querySelector(".cart-float").onclick=()=>{
    carrinhoModal.style.display="block";
    renderCarrinho();
}

window.mais=id=>{
    carrinho[id]=(carrinho[id]||0)+1;
    atualizar();
}

window.menos=id=>{
    carrinho[id]--;
    if(carrinho[id]<=0) delete carrinho[id];
    atualizar();
}

function atualizar(){
    contador.innerText=Object.values(carrinho).reduce((a,b)=>a+b,0);
}

function renderCarrinho(){
    let el=document.getElementById("itensCarrinho");
    el.innerHTML="";
    let total=0;

    produtos.forEach(p=>{
        if(carrinho[p.id]){
            let qtd=carrinho[p.id];
            total+=qtd*p.preco;

            el.innerHTML+=`${p.nome} x${qtd} - R$ ${(qtd*p.preco).toFixed(2)}<br>`;
        }
    });

    totalCarrinho.innerText="Total: R$ "+total.toFixed(2);
}

/* CEP */
tipo.onchange=()=>{
    cep.style.display=tipo.value==="entrega"?"block":"none";
    endereco.style.display=tipo.value==="entrega"?"block":"none";
}

cep.onblur=async ()=>{
    let res=await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
    let data=await res.json();
    endereco.value=`${data.logradouro} - ${data.bairro}`;
}

/* WHATSAPP */
window.enviarPedido=()=>{
    let msg="🛒 *PEDIDO*%0A%0A";
    msg+=`👤 ${cliente.value}%0A`;

    produtos.forEach(p=>{
        if(carrinho[p.id]){
            msg+=`🔹 ${p.nome} x${carrinho[p.id]}%0A`;
        }
    });

    window.open(`https://wa.me/5554996169777?text=${msg}`);
}

/* IA REAL */
async function gerarDescricaoIA(){
    let res = await fetch("https://api.openai.com/v1/chat/completions",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer SUA_KEY"
        },
        body:JSON.stringify({
            model:"gpt-4o-mini",
            messages:[
                {role:"user",content:`Descreva produto: ${nome.value} e sugira categoria`}
            ]
        })
    });

    let data=await res.json();
    desc.value=data.choices[0].message.content;

    if(nome.value.includes("vela")) categoria.value="Velas";
}

/* ADMIN */
let clicks=0;
document.querySelector(".logo").onclick=()=>{
    clicks++;
    if(clicks>=5) admin.style.display="block";
}

window.fecharAdmin=()=>admin.style.display="none";

window.salvarProduto=async()=>{
    let reader=new FileReader();
    reader.onload=async ()=>{
        await addDoc(collection(db,"produtos"),{
            nome:nome.value,
            categoria:categoria.value,
            preco:parseFloat(preco.value),
            estoque:parseInt(estoque.value),
            imagem:reader.result,
            promocao:promo.value==="true"
        });
        alert("Salvo");
    }
    reader.readAsDataURL(img.files[0]);
}
