const API_URL = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec";

async function getProdutos() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function buscarCep(cep) {
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length !== 8) return {};

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    return await res.json();
  } catch {
    return {};
  }
}
