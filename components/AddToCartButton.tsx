"use client";

import { useEffect, useRef, useState } from "react";
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
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (disabled) return;
    addItem(product);
    setAdded(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setAdded(false), 1400);
  };

  const classNames = [
    styles.button,
    variant === "compact" ? styles.compact : styles.full,
    added ? styles.added : "",
    disabled ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Añadir ${product.title} al carrito`}
    >
      {added ? "Añadido ✓" : disabled ? "Sin stock" : "Añadir al carrito"}
    </button>
  );
}
