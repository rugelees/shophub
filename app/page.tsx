import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <div className="container">
      <div className={styles.heading}>
        <h1>Catálogo de productos</h1>
        <p>Productos disponibles en la tienda</p>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
