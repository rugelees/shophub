import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/types/product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <article className={styles.card}>
      <Link
        href={`/productos/${product.id}`}
        className={styles.imageLink}
        aria-label={`Ver detalle de ${product.title}`}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 260px"
            className={styles.image}
          />
        </div>
      </Link>

      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <Link href={`/productos/${product.id}`} className={styles.title}>
          {product.title}
        </Link>

        <div className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span
            className={`${styles.stock} ${inStock ? styles.inStock : styles.outOfStock}`}
          >
            <span className={styles.stockDot} aria-hidden="true" />
            {inStock ? `${product.stock} en stock` : "Agotado"}
          </span>
        </div>

        <AddToCartButton product={product} variant="compact" disabled={!inStock} />
      </div>
    </article>
  );
}
