import { createContext, useContext, useState } from "react";

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState({});
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const add = (produto) => {
    setCarrinho(prev => {
      const atual = prev[produto.nome];
      const qtd = atual ? atual.quantidade + 1 : 1;

      if (qtd > produto.estoque) return prev;

      return {
        ...prev,
        [produto.nome]: { produto, quantidade: qtd }
      };
    });
  };

  const decrease = (nome) => {
    setCarrinho(prev => {
      const item = prev[nome];
      if (!item) return prev;

      if (item.quantidade <= 1) {
        const copy = { ...prev };
        delete copy[nome];
        return copy;
      }

      return {
        ...prev,
        [nome]: { ...item, quantidade: item.quantidade - 1 }
      };
    });
  };

  return (
    <StoreContext.Provider value={{
      produtos, setProdutos,
      carrinho,
      busca, setBusca,
      categoria, setCategoria,
      add, decrease
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
