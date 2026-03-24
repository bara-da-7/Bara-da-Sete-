import { db, auth, storage } from "./firebase.js";

import {
collection, addDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let produtos = [];
let carrinho = {};
let clicks = 0;

function formatar(v){
    return v.toFixed(2).replace(".", ",");
}

// 🔄 TEMPO REAL
onSnapshot(collection(db,"produtos"), snap=>{
    produtos = snap.docs.map(d=>({id:d.id,...d.data()}));
    render();
});

// 🎨 RENDER
function render(){
    let el = document.getElementById("produtos");
    el.innerHTML="";

    produtos.sort((a,b)=>{
        if(a.promocao && !b.promocao) return -1;
        if(!a.promocao && b.promocao) return 1;
        return a.nome.localeCompare(b.nome);
    });

    produtos.forEach(p=>{
        let qtd = carrinho[p.id] || 0;
        let valor = p.promocao ? p.precoPromo : p.preco;

        el.innerHTML+=`
        <div class="card">
            ${p.promocao?'<div class="ribbon">PROMO</div>':''}
            <img src="${p.imagem}">
            <h3>${p.nome}</h3>

            <div class="price">
            ${p.promocao?`<span class="old">R$ ${formatar(p.preco)}</span>`:""}
            R$ ${formatar(valor)}
            </div>

            <div class="controls">
                <button onclick="menos('${p.id}')">-</button>
                ${qtd}
                <button onclick="mais('${p.id}')">+</button>
            </div>
        </div>`;
    });
}

// 🛒
window.mais = id=>{
    let p = produtos.find(x=>x.id===id);
    if((carrinho[id]||0)>=p.estoque) return;
    carrinho[id]=(carrinho[id]||0)+1;
    atualizar();
    render();
};

window.menos = id=>{
    carrinho[id]--;
    if(carrinho[id]<=0) delete carrinho[id];
    atualizar();
    render();
};

function atualizar(){
    contador.innerText = Object.values(carrinho).reduce((a,b)=>a+b,0);
}

// 🛒 MODAL
window.abrirCarrinho=()=>{
    carrinhoModal.style.display="block";
    renderCarrinho();
};

function renderCarrinho(){
    let el = itensCarrinho;
    el.innerHTML="";
    let total=0;

    produtos.forEach(p=>{
        if(carrinho[p.id]){
            let qtd=carrinho[p.id];
            let val=p.promocao?p.precoPromo:p.preco;

            total+=qtd*val;

            el.innerHTML+=`${p.nome} x${qtd} - R$ ${formatar(qtd*val)}<br>`;
        }
    });

    totalCarrinho.innerText="Total: R$ "+formatar(total);
}

// 📦 CEP
tipo.onchange=()=>{
    cep.style.display=tipo.value==="entrega"?"block":"none";
    endereco.style.display=tipo.value==="entrega"?"block":"none";
};

cep.onblur=async()=>{
    let res=await fetch(`https://viacep.com.br/ws/${cep.value}/json/`);
    let d=await res.json();
    endereco.value=`${d.logradouro} - ${d.bairro}`;
};

// 📲 WHATS
window.enviarPedido=()=>{
    let total=0;
    let msg="🛒 *Pedido*%0A";

    msg+=`👤 ${cliente.value}%0A`;
    msg+=`🚚 ${tipo.value}%0A`;

    if(tipo.value==="entrega"){
        msg+=`📍 ${endereco.value}%0A`;
    }

    produtos.forEach(p=>{
        if(carrinho[p.id]){
            let qtd=carrinho[p.id];
            let val=p.promocao?p.precoPromo:p.preco;

            total+=qtd*val;

            msg+=`🔹 ${p.nome} x${qtd}%0A`;
        }
    });

    msg+=`💰 Total: R$ ${formatar(total)}`;

    window.open(`https://wa.me/5554996169777?text=${msg}`);
};

// 🔐 ADMIN
window.abrirAdmin=()=>{
    clicks++;
    if(clicks>=10) admin.style.display="block";
};

window.login=async()=>{
    await signInWithEmailAndPassword(auth,email.value,senha.value);
    alert("Logado!");
};

// 🤖 IA
window.gerarDescricao=()=>{
    desc.value = `Produto ${nome.value} com qualidade superior.`;
};

// 🧠 CATEGORIA
window.sugerirCategoria=()=>{
    let n=nome.value.toLowerCase();
    if(n.includes("vela")) categoria.value="Velas";
    else if(n.includes("incenso")) categoria.value="Incensos";
    else categoria.value="Outros";
};

// 💾 SALVAR
window.salvarProduto=async()=>{
    let file=img.files[0];
    let r=ref(storage,"produtos/"+file.name);

    await uploadBytes(r,file);
    let url=await getDownloadURL(r);

    await addDoc(collection(db,"produtos"),{
        nome:nome.value,
        preco:parseFloat(preco.value),
        estoque:parseInt(estoque.value),
        descricao:desc.value,
        categoria:categoria.value,
        imagem:url,
        promocao:promo.checked,
        precoPromo:parseFloat(precoPromo.value||0)
    });

    alert("Salvo!");
};
