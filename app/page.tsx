import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export const metadata = {
  title: "Catálogo | ShopHub",
};

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <div className="container">
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Explora nuestro <span className={styles.heroAccent}>catálogo</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Productos seleccionados, cargados en tiempo real desde la API de
          DummyJSON. Añade artículos al carrito desde aquí o entra a su ficha
          para ver el detalle completo.
        </p>
      </section>

      <section aria-label="Listado de productos" className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
