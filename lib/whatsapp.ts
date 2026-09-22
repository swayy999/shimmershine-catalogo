// Número fijo de contacto. Se puede sobreescribir con la variable de entorno
// NEXT_PUBLIC_WHATSAPP_PHONE, pero nunca es un campo editable dentro de la
// página pública.
const DEFAULT_PHONE = "+56966129549";

function rawPhone(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE || DEFAULT_PHONE;
}

export function formatWhatsappDisplay(): string {
  const digits = rawPhone().replace(/[^0-9]/g, "");
  if (digits.length === 11 && digits.startsWith("56")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
  }
  return `+${digits}`;
}

export function buildWhatsappLink(no: number, nombre: string): string {
  const phone = rawPhone().replace(/[^0-9]/g, "");
  const pieza = String(no).padStart(3, "0");
  const msg = encodeURIComponent(
    `Hola, me interesa la pieza N.º ${pieza} (${nombre || "Pieza"}) del catálogo.`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}
