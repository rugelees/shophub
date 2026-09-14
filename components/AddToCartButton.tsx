"use client";

import { useCart } from "@/context/CartContext";
import type { ProductSummary } from "@/types/product";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: ProductSummary;
  variant?: "compact" | "full";
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  variant = "full",
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      className={`${styles.button} ${variant === "compact" ? styles.compact : styles.full}`}
      onClick={() => addItem(product)}
      disabled={disabled}
    >
      {disabled ? "Sin stock" : "Añadir al carrito"}
    </button>
  );
}
