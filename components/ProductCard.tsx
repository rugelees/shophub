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
  return (
    <article className={styles.card}>
      <Link href={`/productos/${product.id}`} className={styles.imageWrapper}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 90vw, 240px"
          className={styles.image}
        />
      </Link>

      <div className={styles.content}>
        <p className={styles.category}>{product.category}</p>
        <Link href={`/productos/${product.id}`} className={styles.title}>
          {product.title}
        </Link>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <p className={styles.stock}>Stock: {product.stock}</p>
        <AddToCartButton product={product} variant="compact" disabled={product.stock === 0} />
      </div>
    </article>
  );
}
