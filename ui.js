export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div className="skeleton-pulse" style={{ height: 140 }} />
      <div className="p-3 space-y-2">
        <div className="skeleton-pulse rounded h-4 w-3/4" />
        <div className="skeleton-pulse rounded h-3 w-full" />
        <div className="skeleton-pulse rounded h-5 w-1/3" />
        <div className="flex justify-between mt-3">
          <div className="skeleton-pulse rounded-full w-8 h-8" />
          <div className="skeleton-pulse rounded w-6 h-4" />
          <div className="skeleton-pulse rounded-full w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
import { useRef } from "react";
import type { Produto } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";

interface Props {
  produto: Produto;
  onFlyAnimation?: (rect: DOMRect) => void;
}

export function ProdutoCard({ produto, onFlyAnimation }: Props) {
  const { addItem, decreaseItem, itemCount } = useCart();
  const btnRef = useRef<HTMLButtonElement>(null);
  const qtd = itemCount(produto.nome);
  const preco = typeof produto.preco === "string"
    ? parseFloat(produto.preco.replace(",", "."))
    : produto.preco;
  const semEstoque = produto.estoque <= 0;
  const estoqueAtingido = qtd >= produto.estoque;

  function handleAdd() {
    if (estoqueAtingido || semEstoque) return;
    addItem(produto);
    if (btnRef.current && onFlyAnimation) {
      onFlyAnimation(btnRef.current.getBoundingClientRect());
    }
  }

  return (
    <div className="card-hover rounded-2xl overflow-hidden flex flex-col"
      style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
      <div className="relative overflow-hidden" style={{ height: 140 }}>
        {produto.imagem ? (
          <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-cover" loading="lazy"
            onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200/1a0000/D4AF37?text=Sem+Imagem"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: "hsl(var(--muted))" }}>🛍️</div>
        )}
        {semEstoque && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.65)" }}>
            <span className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" }}>
              Esgotado
            </span>
          </div>
        )}
        {produto.categoria && (
          <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(212,175,55,0.9)", color: "#0a0000" }}>
            {produto.categoria}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1 gap-1">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{produto.nome}</h3>
        {produto.descricao && (
          <p className="text-xs line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>{produto.descricao}</p>
        )}
        <div className="mt-auto pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold gold">
              R$ {isNaN(preco) ? produto.preco : preco.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {produto.estoque > 0 ? `${produto.estoque} disp.` : ""}
            </span>
          </div>
          {qtd === 0 ? (
            <button ref={btnRef} onClick={handleAdd} disabled={semEstoque}
              className="w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 btn-gold disabled:opacity-40 disabled:cursor-not-allowed">
              <ShoppingCart size={15} />
              {semEstoque ? "Esgotado" : "Adicionar"}
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <button className="quantity-btn" onClick={() => decreaseItem(produto.nome)}>−</button>
              <span className="flex-1 text-center font-bold text-sm gold">{qtd}</span>
              <button ref={btnRef} className="quantity-btn" onClick={handleAdd} disabled={estoqueAtingido}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
