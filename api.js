const SHEETS_API = "https://script.google.com/macros/s/AKfycbzZ6BsrhgLa1f6nAWTWlWCS5j_cq0xhos5pjHhSgRLUVxJPYIqoeoL-Gy6mCukzCxgz/exec";
const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  preco: string | number;
  imagem?: string;
  estoque: number;
  categoria?: string;
  ativo: string;
  promocao?: boolean;
  precoOriginal?: string | number | null;
}

export async function getProdutos(): Promise<Produto[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {}
  try {
    const res = await fetch(SHEETS_API);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export async function buscarCep(cep: string): Promise<ViaCepResponse> {
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length !== 8) return {};
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    return await res.json();
  } catch {
    return {};
  }
}

export interface ProdutoInput {
  nome: string;
  descricao?: string;
  preco: string;
  imagem?: string;
  estoque: number;
  categoria?: string;
  ativo: boolean;
  promocao: boolean;
  precoOriginal?: string | null;
}

export const adminApi = {
  async listar(): Promise<Produto[]> {
    const res = await fetch(`${BASE_URL}/api/products`);
    if (!res.ok) throw new Error("Erro ao listar");
    return res.json();
  },
  async criar(data: ProdutoInput): Promise<Produto> {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao criar");
    return res.json();
  },
  async atualizar(id: number, data: Partial<ProdutoInput>): Promise<Produto> {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar");
    return res.json();
  },
  async excluir(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir");
  },
  async uploadImagem(id: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append("imagem", file);
    const res = await fetch(`${BASE_URL}/api/products/${id}/image`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Erro ao enviar imagem");
    return (await res.json()).imageUrl;
  },
  async uploadImagemAvulsa(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("imagem", file);
    const res = await fetch(`${BASE_URL}/api/products/image-upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Erro ao enviar imagem");
    return (await res.json()).imageUrl;
  },
};
