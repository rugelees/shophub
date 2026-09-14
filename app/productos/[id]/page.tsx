import type { Metadata } from "next";
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

async function resolveProduct(id: string) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return null;
  }
  return getProductById(numericId);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await resolveProduct(id);

  if (!product) {
    return { title: "Producto no encontrado | ShopHub" };
  }

  return {
    title: `${product.title} | ShopHub`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await resolveProduct(id);

  if (!product) {
    notFound();
  }

  const inStock = product.stock > 0;
  const discount = product.discountPercentage ?? 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - discount / 100)
    : product.price;
  const mainImage = product.images?.[0] ?? product.thumbnail;

  return (
    <div className="container">
      <Link href="/" className={styles.back}>
        ← Volver al catálogo
      </Link>

      <div className={styles.layout}>
        <section className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <Image
              src={mainImage}
              alt={product.title}
              fill
              sizes="(max-width: 900px) 90vw, 480px"
              className={styles.mainImage}
              priority
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.slice(0, 4).map((image, index) => (
                <div key={image} className={styles.thumbnailWrapper}>
                  <Image
                    src={image}
                    alt={`${product.title} — vista ${index + 1}`}
                    fill
                    sizes="110px"
                    className={styles.thumbnail}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.info}>
          <div className={styles.tags}>
            <span className={styles.category}>{product.category}</span>
            {product.brand && (
              <span className={styles.brand}>{product.brand}</span>
            )}
          </div>

          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.priceBlock}>
            {hasDiscount ? (
              <>
                <span className={styles.priceFinal}>
                  {formatPrice(finalPrice)}
                </span>
                <span className={styles.priceOriginal}>
                  {formatPrice(product.price)}
                </span>
                <span className={styles.discount}>
                  -{Math.round(discount)}%
                </span>
              </>
            ) : (
              <span className={styles.priceFinal}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className={inStock ? styles.stockOk : styles.stockOut}>
            <span className={styles.stockDot} aria-hidden="true" />
            {inStock
              ? `Disponible · ${product.stock} unidades en stock`
              : "Producto agotado"}
          </p>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.actions}>
            <AddToCartButton
              product={product}
              variant="full"
              disabled={!inStock}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
