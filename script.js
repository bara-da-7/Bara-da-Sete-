import { db, auth, storage } from "./firebase.js";
import {
  collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let produtos = [];
let carrinho = {};

// 🔥 TEMPO REAL (AQUI É O PULO DO GATO)
onSnapshot(collection(db, "produtos"), snapshot => {
  produtos = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  render();
  renderAdmin();
});

// 🎨 PREÇO BR
function formatar(v){
  return v.toFixed(2).replace(".", ",");
}

// 🎨 RENDER
function render(){
  let el = document.getElementById("produtos");
  el.innerHTML = "";

  produtos
    .sort((a,b)=>{
      if(a.promocao && !b.promocao) return -1;
      if(!a.promocao && b.promocao) return 1;
      return a.nome.localeCompare(b.nome);
    })
    .forEach(p=>{

      let qtd = carrinho[p.id] || 0;
      let valor = p.promocao ? p.precoPromo : p.preco;

      el.innerHTML += `
      <div class="card">
        ${p.promocao ? '<div class="ribbon">PROMOÇÃO</div>' : ''}

        <img src="${p.imagem}">

        <h3>${p.nome}</h3>

        <div class="price">
          ${p.promocao ? `<span class="old">R$ ${formatar(p.preco)}</span>` : ""}
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

// 🛒 CONTROLES
window.mais = id => {
  let p = produtos.find(x=>x.id===id);
  if((carrinho[id]||0) >= p.estoque) return;

  carrinho[id] = (carrinho[id]||0)+1;
  render();
};

window.menos = id => {
  carrinho[id]--;
  if(carrinho[id]<=0) delete carrinho[id];
  render();
};

// 🔐 LOGIN REAL
window.login = async () => {
  let email = document.getElementById("email").value;
  let senha = document.getElementById("senha").value;

  await signInWithEmailAndPassword(auth, email, senha);

  document.getElementById("admin").style.display="block";
};

// 🧠 IA REAL (OpenAI)
window.gerarDescricao = async () => {
  let nome = document.getElementById("nome").value;

  let res = await fetch("https://api.openai.com/v1/chat/completions", {
    method:"POST",
    headers:{
      "Authorization":"Bearer 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",
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      model:"gpt-4o-mini",
      messages:[
        {role:"system", content:"Crie descrição curta, direta, comercial."},
        {role:"user", content:nome}
      ]
    })
  });

  let data = await res.json();
  document.getElementById("desc").value =
    data.choices[0].message.content;
};

// 📤 SALVAR PRODUTO COMPLETO
window.salvarProduto = async () => {

  let file = document.getElementById("img").files[0];
  let storageRef = ref(storage, "produtos/"+file.name);

  await uploadBytes(storageRef, file);
  let url = await getDownloadURL(storageRef);

  await addDoc(collection(db,"produtos"),{
    nome: nome.value,
    preco: parseFloat(preco.value),
    estoque: parseInt(estoque.value),
    descricao: desc.value,
    categoria: categoria.value,
    imagem: url,
    promocao: promo.checked,
    precoPromo: parseFloat(precoPromo.value || 0)
  });

  alert("Salvo!");
};

// 🧠 IA CATEGORIA
window.sugerirCategoria = () => {
  let nome = document.getElementById("nome").value.toLowerCase();

  if(nome.includes("vela")) categoria.value="Velas";
  else if(nome.includes("incenso")) categoria.value="Incensos";
  else categoria.value="Outros";
};
