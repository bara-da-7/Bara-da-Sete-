import { useStore } from "../store/useStore";

export default function ProductCard({ produto }) {
  const { add, decrease, carrinho } = useStore();
  const qtd = carrinho[produto.nome]?.quantidade || 0;

  return (
    <div className="product-card">
      <img src={produto.imagem} />

      <h3>{produto.nome}</h3>
      <p>R$ {produto.preco}</p>

      {qtd === 0 ? (
        <button onClick={() => add(produto)}>Adicionar</button>
      ) : (
        <div>
          <button onClick={() => decrease(produto.nome)}>-</button>
          <span>{qtd}</span>
          <button onClick={() => add(produto)}>+</button>
        </div>
      )}
    </div>
  );
}
