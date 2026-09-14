"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import styles from "./Header.module.css";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          ShopHub
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Catálogo
          </Link>
          <span className={styles.cart}>
            Carrito: <strong>{totalItems}</strong>
          </span>
        </nav>
      </div>
    </header>
  );
}
