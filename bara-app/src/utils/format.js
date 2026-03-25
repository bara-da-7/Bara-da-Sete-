export function formatPrice(valor) {
  const n = typeof valor === "string"
    ? parseFloat(valor.replace(",", "."))
    : Number(valor);

  if (isNaN(n)) return valor;

  return n.toFixed(2).replace(".", ",");
}
