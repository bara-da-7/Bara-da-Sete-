import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA--Yx-rJnPlRFXzMc0GhDzAqNav5bGOLw",
  authDomain: "bara-da-sete.firebaseapp.com",
  projectId: "bara-da-sete"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let produtos = [];
let carrinho = {};

onSnapshot(collection(db,"produtos"), snap=>{
    produtos=[];
    snap.forEach(d=>produtos.push({id:d.id,...d.data()}));
    render();
    renderAdmin();
});

function render(){
    let busca = document.getElementById("busca").value.toLowerCase();

    let lista = produtos
    .filter(p=>p.nome.toLowerCase().includes(busca))
    .sort((a,b)=>{
        if(a.promocao && !b.promocao) return -1;
        if(!a.promocao && b.promocao) return 1;
        return a.nome.localeCompare(b.nome);
    });

    let el=document.getElementById("produtos");
    el.innerHTML="";

    lista.forEach(p=>{
        let preco = p.promocao ? p.precoPromo : p.preco;
        let qtd = carrinho[p.id] || 0;

        el.innerHTML += `
        <div class="card ${p.promocao?'promo':''}">
            <img src="${p.imagem}">
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>

            ${p.promocao ? `<span class="old">R$ ${p.preco}</span>` : ""}

            <div class="price">R$ ${Number(preco).toFixed(2)}</div>

            <div class="actions">
                <button onclick="menos('${p.id}')">-</button>
                <span>${qtd}</span>
                <button onclick="mais('${p.id}')">+</button>
            </div>
        </div>`;
    });

    atualizarCarrinho();
}

window.mais = (id)=>{
    carrinho[id]=(carrinho[id]||0)+1;
    render();
}

window.menos = (id)=>{
    if(!carrinho[id]) return;
    carrinho[id]--;
    render();
}

function atualizarCarrinho(){
    let total = Object.values(carrinho).reduce((a,b)=>a+b,0);
    document.getElementById("contador").innerText = total+" itens";
}

document.getElementById("busca").addEventListener("input", render);

async function salvarProduto(){
    let file=document.getElementById("img").files[0];
    let reader=new FileReader();

    reader.onload=async ()=>{
        await addDoc(collection(db,"produtos"),{
            nome:nome.value,
            preco:parseFloat(preco.value),
            estoque:parseInt(estoque.value),
            descricao:desc.value,
            imagem:reader.result,
            promocao:promo.value==="true",
            precoPromo:parseFloat(precoPromo.value)||0
        });
        alert("Salvo");
    }
    reader.readAsDataURL(file);
}

function renderAdmin(){
    let el=document.getElementById("listaAdmin");
    el.innerHTML="<h3>Produtos</h3>";

    produtos.forEach(p=>{
        el.innerHTML+=`
        <div>
            ${p.nome} - R$ ${p.preco}
            <button onclick="editar('${p.id}')">Editar</button>
            <button onclick="excluir('${p.id}')">Excluir</button>
        </div>`;
    });
}

window.excluir = async(id)=>{
    await deleteDoc(doc(db,"produtos",id));
}

window.editar = async(id)=>{
    let novoNome = prompt("Novo nome");
    await updateDoc(doc(db,"produtos",id),{nome:novoNome});
}

let clicks=0;
window.clickLogo=()=>{
    clicks++;
    if(clicks>=10){
        let u=prompt("Usuário");
        let s=prompt("Senha");
        if(u==="adm" && s==="99861309"){
            document.getElementById("admin").style.display="block";
        }
    }
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
