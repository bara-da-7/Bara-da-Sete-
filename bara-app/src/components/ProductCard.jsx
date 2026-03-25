import { cartStore } from "../store/cartStore";
import { formatPrice } from "../utils/format";

export default function ProductCard({ produto, onAdd }) {
  const cart = cartStore.get();
  const qtd = cart[produto.nome]?.quantidade || 0;

  return (
    <div className="product-card">
      <img src={produto.imagem} />

      <h3>{produto.nome}</h3>

      <p>{produto.descricao}</p>

      <strong>R$ {formatPrice(produto.preco)}</strong>

      {qtd === 0 ? (
        <button onClick={onAdd}>Adicionar</button>
      ) : (
        <div>
          <button onClick={() => {
            cartStore.decrease(produto.nome);
            onAdd();
          }}>-</button>

          <span>{qtd}</span>

          <button onClick={onAdd}>+</button>
        </div>
      )}
    </div>
  );
}
