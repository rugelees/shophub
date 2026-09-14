import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductById } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import styles from "./page.module.css";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const product = await getProductById(numericId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container">
      <Link href="/" className={styles.back}>
        ← Volver al catálogo
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 800px) 90vw, 420px"
            className={styles.image}
            priority
          />
        </div>

        <div className={styles.info}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.stock}>
            {product.stock > 0
              ? `Disponible (${product.stock} unidades)`
              : "Agotado"}
          </p>
          <p className={styles.description}>{product.description}</p>
          <AddToCartButton product={product} disabled={product.stock === 0} />
        </div>
      </div>
    </div>
  );
}
