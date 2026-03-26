import { useEffect, useState } from "react";
import { getProdutos } from "../services/api";
import ProductCard from "../components/ProductCard";
import CartSidebar from "../components/CartSidebar";

export default function Home({ goCheckout }) {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getProdutos();
    setProdutos(data);
  }

  return (
    <div>
      <h1>Bará da Sete</h1>

      <div className="grid">
        {produtos.map(p => (
          <ProductCard
            key={p.nome}
            produto={p}
            refresh={() => setProdutos([...produtos])}
          />
        ))}
      </div>

      <CartSidebar goCheckout={goCheckout} />
    </div>
  );
}
