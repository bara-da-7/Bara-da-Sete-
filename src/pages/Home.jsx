import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { getProdutos } from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { produtos, setProdutos } = useStore();

  useEffect(() => {
    getProdutos().then(setProdutos);
  }, []);

  return (
    <div>
      <h1>Bará da Sete</h1>

      <div>
        {produtos.map(p => (
          <ProductCard key={p.nome} produto={p} />
        ))}
      </div>
    </div>
  );
}
