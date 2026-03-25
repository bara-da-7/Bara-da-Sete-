import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSidebar({ open, onClose, onCheckout }: Props) {
  const { items, removeItem, addItem, decreaseItem, totalPreco, totalQuantidade } = useCart();
  const itemList = Object.values(items);
  const total = totalPreco();
  const qty = totalQuantidade();

  return (
    <>
      <div className={`overlay-fade fixed inset-0 z-40 ${open ? "open" : ""}`}
        style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className={`cart-slide fixed top-0 right-0 z-50 h-full flex flex-col ${open ? "open" : ""}`}
        style={{ width: 340, background: "hsl(var(--card))", borderLeft: "1px solid hsl(var(--border))" }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="gold" />
            <h2 className="font-bold text-lg">Seu Carrinho</h2>
            {qty > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full btn-gold">{qty}</span>}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {itemList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
              <div className="text-6xl">🛒</div>
              <p className="text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
                Seu carrinho está vazio.<br />Adicione produtos para continuar.
              </p>
            </div>
          ) : itemList.map(({ produto, quantidade }) => {
            const preco = typeof produto.preco === "number" ? produto.preco : parseFloat(String(produto.preco).replace(",", "."));
            const subtotal = preco * quantidade;
            return (
              <div key={produto.nome} className="flex gap-3 p-3 rounded-xl"
                style={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}>
                <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden">
                  {produto.imagem
                    ? <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl" style={{ background: "hsl(var(--muted))" }}>🛍️</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{produto.nome}</p>
                  <p className="text-xs gold font-semibold">R$ {subtotal.toFixed(2).replace(".", ",")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="quantity-btn" style={{ width: 24, height: 24, fontSize: "0.9rem" }}
                      onClick={() => decreaseItem(produto.nome)}>−</button>
                    <span className="text-sm font-bold w-5 text-center gold">{quantidade}</span>
                    <button className="quantity-btn" style={{ width: 24, height: 24, fontSize: "0.9rem" }}
                      onClick={() => addItem(produto)} disabled={quantidade >= produto.estoque}>+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(produto.nome)}
                  className="self-start p-1 rounded-lg hover:bg-red-500/20 transition-colors"
                  style={{ color: "hsl(var(--destructive))" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
        {itemList.length > 0 && (
          <div className="p-4 space-y-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
            <div className="flex items-center justify-between">
              <span style={{ color: "hsl(var(--muted-foreground))" }}>Total</span>
              <span className="text-xl font-bold gold">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <button onClick={onCheckout} className="btn-gold w-full py-3 text-base">Finalizar Pedido 🚀</button>
          </div>
        )}
      </div>
    </>
  );
}
