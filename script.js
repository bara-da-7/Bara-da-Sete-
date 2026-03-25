import { useState, useEffect, useRef, useCallback } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { getProdutos, type Produto } from "@/lib/api";
import { useCart } from "@/lib/cart";
import { ProdutoCard } from "@/components/ProdutoCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { CartSidebar } from "@/components/CartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AdminPanel } from "@/components/AdminPanel";

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [flyItems, setFlyItems] = useState<{ id: number; x: number; y: number }[]>([]);
  const flyIdRef = useRef(0);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalQuantidade } = useCart();
  const qty = totalQuantidade();

  function carregarProdutos() {
    setLoading(true);
    getProdutos().then(data => {
      setProdutos(data);
      setLoading(false);
    });
  }

  useEffect(() => { carregarProdutos(); }, []);

  function handleTodosClick() {
    setCategoriaAtiva("Todos");
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);
    if (clickCountRef.current >= 10) {
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      setAdminOpen(true);
    }
  }

  const categorias = ["Todos", ...Array.from(new Set(
    produtos
      .filter(p => (p.ativo === "sim" || p.ativo === true as unknown as string) && p.categoria)
      .map(p => p.categoria!)
  ))];

  const produtosFiltrados = produtos
    .filter(p => {
      const ativo = p.ativo === "sim" || p.ativo === true as unknown as string;
      if (!ativo) return false;
      const matchBusca = busca === "" || p.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCat = categoriaAtiva === "Todos" || p.categoria === categoriaAtiva;
      return matchBusca && matchCat;
    })
    .sort((a, b) => {
      if (a.promocao && !b.promocao) return -1;
      if (!a.promocao && b.promocao) return 1;
      return a.nome.localeCompare(b.nome, "pt-BR");
    });

  const handleFlyAnimation = useCallback((srcRect: DOMRect) => {
    if (!cartBtnRef.current) return;
    const cartRect = cartBtnRef.current.getBoundingClientRect();
    const id = flyIdRef.current++;
    const startX = srcRect.left + srcRect.width / 2;
    const startY = srcRect.top + srcRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    setFlyItems(prev => [...prev, { id, x: startX, y: startY }]);
    setTimeout(() => {
      const el = document.getElementById(`fly-${id}`);
      if (el) {
        el.style.setProperty("--tx", `${endX - startX}px`);
        el.style.setProperty("--ty", `${endY - startY}px`);
      }
    }, 10);
    setTimeout(() => setFlyItems(prev => prev.filter(f => f.id !== id)), 700);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <header className="relative overflow-hidden" style={{ height: 200 }}>
        <div className="w-full h-full flex flex-col items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, hsl(0 100% 8%) 0%, hsl(0 90% 12%) 50%, hsl(43 74% 20%) 100%)" }}>
          <div className="text-center px-4">
            <h1 className="text-4xl font-black tracking-tight gold select-none cursor-default"
              style={{ textShadow: "0 2px 20px rgba(212,175,55,0.4)" }}>
              Bará da Sete
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
              Produtos selecionados com qualidade
            </p>
          </div>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-4 left-8 w-16 h-16 rounded-full opacity-10" style={{ background: "hsl(var(--gold))" }} />
            <div className="absolute bottom-4 right-12 w-24 h-24 rounded-full opacity-5" style={{ background: "hsl(var(--gold))" }} />
            <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full opacity-10" style={{ background: "hsl(var(--gold))" }} />
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 px-4 py-3" style={{ background: "hsl(var(--background))", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="relative max-w-lg mx-auto">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input type="search" value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full pl-11 pr-10 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-yellow-500"
            style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
          {busca && (
            <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10">
              <X size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          )}
        </div>
      </div>

      {categorias.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categorias.map(cat => (
            <button key={cat}
              onClick={cat === "Todos" ? handleTodosClick : () => setCategoriaAtiva(cat)}
              className={`category-chip ${categoriaAtiva === cat ? "active" : ""}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      <main className="px-4 pb-28 pt-2">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-5xl">🔍</div>
            <div className="text-center">
              <p className="font-semibold text-lg">Nenhum produto encontrado</p>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Tente outro termo de busca ou categoria</p>
            </div>
            {(busca || categoriaAtiva !== "Todos") && (
              <button onClick={() => { setBusca(""); setCategoriaAtiva("Todos"); }} className="btn-gold px-6 py-2 text-sm">
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? "produto" : "produtos"}
              {categoriaAtiva !== "Todos" ? ` em ${categoriaAtiva}` : ""}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {produtosFiltrados.map(p => (
                <ProdutoCard key={p.id ?? p.nome} produto={p} onFlyAnimation={handleFlyAnimation} />
              ))}
            </div>
          </>
        )}
      </main>

      {flyItems.map(({ id, x, y }) => (
        <div key={id} id={`fly-${id}`} className="fly-animation" style={{ left: x - 20, top: y - 20 }} />
      ))}

      <button ref={cartBtnRef} onClick={() => setCartOpen(true)}
        className="float-cart fixed bottom-6 right-5 z-40 flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl btn-gold"
        style={{ boxShadow: "0 8px 32px rgba(212,175,55,0.4)" }}>
        <ShoppingCart size={20} />
        {qty > 0 && (
          <>
            <span className="font-bold">{qty}</span>
            <span className="hidden sm:inline text-sm font-semibold">Ver carrinho</span>
          </>
        )}
      </button>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <AdminPanel open={adminOpen} onClose={() => { setAdminOpen(false); carregarProdutos(); }} />
    </div>
  );
}
