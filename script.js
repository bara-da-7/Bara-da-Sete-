import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA--Yx-rJnPlRFXzMc0GhDzAqNav5bGOLw",
  authDomain: "bara-da-sete.firebaseapp.com",
  projectId: "bara-da-sete",
  storageBucket: "bara-da-sete.firebasestorage.app",
  messagingSenderId: "162143376770",
  appId: "1:162143376770:web:4e62e135636a477057eb9b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let produtos = [];

onSnapshot(collection(db, "produtos"), (snapshot) => {
    produtos = [];
    snapshot.forEach(docSnap => {
        produtos.push({ id: docSnap.id, ...docSnap.data() });
    });
    render();
    renderAdmin();
});

function render(){
    let busca = document.getElementById("busca").value.toLowerCase();
    let el = document.getElementById("produtos");

    let lista = produtos
    .filter(p => p.nome.toLowerCase().includes(busca))
    .sort((a,b)=>{
        if(a.promocao && !b.promocao) return -1;
        if(!a.promocao && b.promocao) return 1;
        return a.nome.localeCompare(b.nome);
    });

    el.innerHTML="";

    lista.forEach(p=>{
        let preco = p.promocao ? p.precoPromo : p.preco;

        el.innerHTML += `
        <div class="card ${p.promocao ? 'promo':''}">
            <img src="${p.imagem}">
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>

            ${p.promocao ? `<p class="old">R$ ${p.preco}</p>` : ''}

            <p class="price">R$ ${preco.toFixed(2)}</p>

            <div class="actions">
                <button>-</button>
                <span>0</span>
                <button>+</button>
            </div>
        </div>
        `;
    });
}

document.getElementById("busca").addEventListener("input", render);

function gerarDesc(){
    let nome = document.getElementById("nome").value;
    document.getElementById("desc").value =
    `${nome} com acabamento de qualidade, ideal para uso espiritual, oferecendo resistência e presença marcante.`;
}

async function salvarProduto(){
    let file = document.getElementById("img").files[0];
    let reader = new FileReader();

    reader.onload = async function(){
        await addDoc(collection(db, "produtos"), {
            nome: nome.value,
            preco: parseFloat(preco.value),
            estoque: parseInt(estoque.value),
            descricao: desc.value,
            imagem: reader.result,
            promocao: promo.value === "true",
            precoPromo: parseFloat(precoPromo.value) || 0
        });
        alert("Salvo!");
    }

    reader.readAsDataURL(file);
}

function renderAdmin(){
    let el = document.getElementById("listaAdmin");
    el.innerHTML = "<h3>Produtos cadastrados</h3>";

    produtos.forEach(p=>{
        el.innerHTML += `<p>${p.nome} - R$ ${p.preco}</p>`;
    });
}

let clicks=0;
window.clickLogo = function(){
    clicks++;
    if(clicks>=10){
        let user=prompt("Usuário");
        let pass=prompt("Senha");
        if(user==="adm" && pass==="99861309"){
            document.getElementById("admin").style.display="block";
        }
    }
}

window.finalizar = function(){
    let msg = "Pedido:%0A";
    produtos.forEach(p=>{
        msg += `${p.nome}%0A`;
    });
    window.open(`https://wa.me/5554996169777?text=${msg}`);
}
