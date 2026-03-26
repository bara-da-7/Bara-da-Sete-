import { cartStore } from "../store/cartStore";

export default function CartSidebar({ goCheckout }) {
  const items = Object.values(cartStore.get());

  return (
    <div>
      <h2>Carrinho</h2>

      {items.map(i => (
        <div key={i.produto.nome}>
          {i.produto.nome} x {i.quantidade}
        </div>
      ))}

      <h3>Total: R$ {cartStore.total()}</h3>

      <button onClick={goCheckout}>
        Finalizar
      </button>
    </div>
  );
}
