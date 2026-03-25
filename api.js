const API_BASE = 'https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec';

// URL da planilha Google Sheets (leitura de fallback)
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec';

async function getProdutos() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  try {
    const res = await fetch(SHEETS_URL);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function buscarCep(cep) {
  const c = cep.replace(/\D/g, '');
  if (c.length !== 8) return {};
  try {
    const res = await fetch(`https://viacep.com.br/ws/${c}/json/`);
    return await res.json();
  } catch {
    return {};
  }
}

const adminApi = {
  async listar() {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Erro ao listar');
    return res.json();
  },
  async criar(data) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar');
    return res.json();
  },
  async atualizar(id, data) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar');
    return res.json();
  },
  async excluir(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir');
  },
  async uploadImagem(id, file) {
    const fd = new FormData();
    fd.append('imagem', file);
    const res = await fetch(`${API_BASE}/products/${id}/image`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Erro ao enviar imagem');
    return (await res.json()).imageUrl;
  },
};
