import { cartStore } from "../store/cartStore";

export default function Checkout({ goBack }) {
  const items = Object.values(cartStore.get());

  function enviar() {
    const texto = items.map(i =>
      `${i.quantidade}x ${i.produto.nome}`
    ).join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`);
  }

  return (
    <div>
      <h1>Checkout</h1>

      {items.map(i => (
        <div key={i.produto.nome}>
          {i.produto.nome} x {i.quantidade}
        </div>
      ))}

      <button onClick={enviar}>
        Enviar no WhatsApp
      </button>

      <button onClick={goBack}>
        Voltar
      </button>
    </div>
  );
}
