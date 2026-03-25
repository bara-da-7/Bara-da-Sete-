(async()=>{
let p=await api.produtos();
document.getElementById("admin").innerHTML=
p.map(x=>`<div>${x.nome}</div>`).join('');
})();
