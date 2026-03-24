import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA--Y...",
  authDomain: "bara-da-sete.firebaseapp.com",
  projectId: "bara-da-sete"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let produtos=[];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || {};
let categoriaAtual="Todos";

onSnapshot(collection(db,"produtos"), snap=>{
    produtos=[];
    snap.forEach(d=>produtos.push({id:d.id,...d.data()}));
    render();
    renderFiltros();
});

function render(){
    let busca=document.getElementById("busca").value.toLowerCase();

    let lista = produtos
    .filter(p=>p.nome.toLowerCase().includes(busca))
    .filter(p=>categoriaAtual==="Todos" || p.categoria===categoriaAtual)
    .sort((a,b)=>{
        if(a.promocao && !b.promocao) return -1;
        return a.nome.localeCompare(b.nome);
    });

    let el=document.getElementById("produtos");
    el.innerHTML="";

    lista.forEach(p=>{
        let qtd=carrinho[p.id]||0;

        el.innerHTML+=`
        <div class="card ${p.promocao?'promo':''}">
            <img src="${p.imagem}">
            <h3>${p.nome}</h3>

            <p>R$ ${p.promocao?p.precoPromo:p.preco}</p>

            <div>
                <button onclick="menos('${p.id}')">-</button>
                ${qtd}
                <button onclick="mais('${p.id}')">+</button>
            </div>
        </div>`;
    });

    localStorage.setItem("carrinho",JSON.stringify(carrinho));
}

window.mais=(id)=>{
    let p = produtos.find(x=>x.id===id);
    if((carrinho[id]||0) >= p.estoque) return alert("Sem estoque");
    carrinho[id]=(carrinho[id]||0)+1;
    render();
}

window.menos=(id)=>{
    carrinho[id]--;
    if(carrinho[id]<=0) delete carrinho[id];
    render();
}

function renderFiltros(){
    let cats=["Todos",...new Set(produtos.map(p=>p.categoria||"Outros"))];
    let el=document.getElementById("filtros");

    el.innerHTML="";

    cats.forEach(c=>{
        el.innerHTML+=`<button onclick="filtrar('${c}')">${c}</button>`;
    });
}

window.filtrar=(c)=>{
    categoriaAtual=c;
    render();
}

window.finalizar=()=>{
    let msg="Pedido:%0A";
    produtos.forEach(p=>{
        if(carrinho[p.id]){
            msg+=`${p.nome} x${carrinho[p.id]}%0A`;
        }
    });
    window.open(`https://wa.me/5554996169777?text=${msg}`);
}
