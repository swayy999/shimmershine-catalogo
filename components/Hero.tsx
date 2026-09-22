export default function Hero({
  totalPiezas,
  totalCategorias,
  whatsappDisplay,
}: {
  totalPiezas: number;
  totalCategorias: number;
  whatsappDisplay: string;
}) {
  return (
    <header className="hero">
      <p className="hero-kicker">Catálogo</p>
      <h1 className="hero-name">ShimmerShine</h1>
      <p className="hero-tagline">Joyería en plata 925</p>
      <div className="hero-contact">
        <span>WhatsApp de contacto</span>
        <span>{whatsappDisplay}</span>
      </div>
      <div className="hero-meta">
        <span>
          <strong>{totalPiezas}</strong> piezas
        </span>
        <span>
          <strong>{totalCategorias}</strong> categorías
        </span>
      </div>
    </header>
  );
}
