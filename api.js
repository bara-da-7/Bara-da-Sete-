const SHEETS_API = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec";

window.api = {
  async getProdutos() {
    try {
      const res = await fetch(SHEETS_API);
      return await res.json();
    } catch {
      return [];
    }
  },

  async buscarCep(cep) {
    cep = cep.replace(/\D/g,'');
    if(cep.length !== 8) return {};

    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return await res.json();
  }
};
