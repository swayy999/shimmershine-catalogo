export function formatPrice(value: string): string {
  if (!value) return "";
  const n = Number(String(value).replace(/[^0-9.-]/g, ""));
  if (Number.isNaN(n)) return "";
  return "$" + n.toLocaleString("es-CL");
}
