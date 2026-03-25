window.cart={
items:JSON.parse(localStorage.getItem("cart")||"{}"),

save(){localStorage.setItem("cart",JSON.stringify(this.items))},

add(p){
if(!this.items[p.nome]) this.items[p.nome]={produto:p,q:0};
if(this.items[p.nome].q>=p.estoque) return;
this.items[p.nome].q++;
this.save();
},

dec(n){
if(!this.items[n])return;
this.items[n].q--;
if(this.items[n].q<=0) delete this.items[n];
this.save();
},

remove(n){
delete this.items[n];
this.save();
},

total(){
return Object.values(this.items).reduce((a,i)=>a+i.q,0)
},

price(){
return Object.values(this.items).reduce((a,i)=>a+i.q*parseFloat(i.produto.preco),0)
}
}
