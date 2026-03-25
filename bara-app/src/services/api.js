const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec";

export async function getProdutos() {
  try {
    const res = await fetch(SHEETS_URL);

    if (!res.ok) throw new Error("Erro ao buscar produtos");

    const data = await res.json();

    if (!Array.isArray(data)) return [];

    // 🔥 NORMALIZAÇÃO (CRUCIAL)
    return data.map(p => ({
      nome: p.nome || "",
      preco: p.preco || 0,
      precoOriginal: p.precoOriginal || null,
      promocao: p.promocao === "sim" || p.promocao === true,
      categoria: p.categoria || "Outros",
      descricao: p.descricao || "",
      imagem: p.imagem || "",
      estoque: Number(p.estoque || 0),
      ativo: p.ativo === "sim" || p.ativo === true,
    }));

  } catch (err) {
    console.error("Erro API:", err);
    return [];
  }
}
