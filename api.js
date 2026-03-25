const API = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec";

window.api = {
async produtos(){
  try{
    const r = await fetch(API);
    return await r.json();
  }catch{
    return [];
  }
},

async cep(v){
  v = v.replace(/\D/g,'');
  if(v.length!==8) return {};
  const r = await fetch(`https://viacep.com.br/ws/${v}/json/`);
  return await r.json();
}
};
