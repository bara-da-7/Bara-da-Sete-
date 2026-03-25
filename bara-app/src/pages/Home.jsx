import { useEffect, useState } from "react";
import { getProdutos } from "../services/api";
import { cartStore } from "../store/cartStore";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getProdutos();
    setProdutos(data);
  }

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) &&
    p.ativo
  );

  return (
    <div>
      {/* HEADER */}
      <header className="hero">
        <h1>Bará da Sete</h1>
        <p>Produtos selecionados com qualidade</p>
      </header>

      {/* SEARCH */}
      <div className="sticky-bar">
        <input
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid">
        {filtrados.map(produto => (
          <ProductCard
            key={produto.nome}
            produto={produto}
            onAdd={() => {
              cartStore.add(produto);
              setProdutos([...produtos]); // força re-render
            }}
          />
        ))}
      </div>
    </div>
  );
}
