import { cartStore } from "../store/cartStore";
import { formatPrice } from "../utils/format";

export default function ProductCard({ produto, refresh }) {
  const cart = cartStore.get();
  const qtd = cart[produto.nome]?.quantidade || 0;

  return (
    <div className="product-card">
      <img src={produto.imagem} width="100%" />

      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>

      <strong>R$ {formatPrice(produto.preco)}</strong>

      {qtd === 0 ? (
        <button onClick={() => {
          cartStore.add(produto);
          refresh();
        }}>
          Adicionar
        </button>
      ) : (
        <>
          <button onClick={() => {
            cartStore.decrease(produto.nome);
            refresh();
          }}>-</button>

          {qtd}

          <button onClick={() => {
            cartStore.add(produto);
            refresh();
          }}>+</button>
        </>
      )}
    </div>
  );
}
