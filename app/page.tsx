import { getCategoryPages, type CategoryPage } from "@/lib/products";
import { formatWhatsappDisplay } from "@/lib/whatsapp";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";

export default async function Home() {
  let pages: CategoryPage[] = [];
  let errorMessage: string | null = null;

  try {
    pages = await getCategoryPages();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar el catálogo.";
  }

  const totalPiezas = pages.reduce((sum, p) => sum + p.productos.length, 0);

  return (
    <div className="wrap">
      <Hero
        totalPiezas={totalPiezas}
        totalCategorias={pages.length}
        whatsappDisplay={formatWhatsappDisplay()}
      />

      {errorMessage ? (
        <p className="empty-state">{errorMessage}</p>
      ) : (
        <Catalog pages={pages} />
      )}

      <footer>
        <span>Precios en pesos chilenos (CLP).</span>
      </footer>
    </div>
  );
}
