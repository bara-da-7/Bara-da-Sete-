import { useStore } from "../store/useStore";

export default function CartSidebar() {
  const { carrinho } = useStore();

  const items = Object.values(carrinho);

  return (
    <div className="cart">
      {items.length === 0 ? "Carrinho vazio" : items.map(i => (
        <div key={i.produto.nome}>
          {i.produto.nome} x{i.quantidade}
        </div>
      ))}
    </div>
  );
}
