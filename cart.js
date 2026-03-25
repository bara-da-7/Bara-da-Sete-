import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Produto } from "./api";

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartStore {
  items: Record<string, CartItem>;
  addItem: (produto: Produto) => void;
  removeItem: (nome: string) => void;
  decreaseItem: (nome: string) => void;
  clearCart: () => void;
  totalQuantidade: () => number;
  totalPreco: () => number;
  itemCount: (nome: string) => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: {},
      addItem: (produto) => {
        const items = { ...get().items };
        const preco = typeof produto.preco === "string"
          ? parseFloat(produto.preco.replace(",", "."))
          : produto.preco;
        const produtoNormalizado = { ...produto, preco };
        if (items[produto.nome]) {
          if (items[produto.nome].quantidade >= produto.estoque) return;
          items[produto.nome] = { ...items[produto.nome], quantidade: items[produto.nome].quantidade + 1 };
        } else {
          items[produto.nome] = { produto: produtoNormalizado, quantidade: 1 };
        }
        set({ items });
      },
      decreaseItem: (nome) => {
        const items = { ...get().items };
        if (!items[nome]) return;
        if (items[nome].quantidade <= 1) {
          delete items[nome];
        } else {
          items[nome] = { ...items[nome], quantidade: items[nome].quantidade - 1 };
        }
        set({ items });
      },
      removeItem: (nome) => {
        const items = { ...get().items };
        delete items[nome];
        set({ items });
      },
      clearCart: () => set({ items: {} }),
      totalQuantidade: () => Object.values(get().items).reduce((acc, i) => acc + i.quantidade, 0),
      totalPreco: () => Object.values(get().items).reduce((acc, i) => {
        const preco = typeof i.produto.preco === "number"
          ? i.produto.preco
          : parseFloat(String(i.produto.preco).replace(",", "."));
        return acc + preco * i.quantidade;
      }, 0),
      itemCount: (nome) => get().items[nome]?.quantidade ?? 0,
    }),
    { name: "bara-da-sete-cart" }
  )
);
