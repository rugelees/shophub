"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import styles from "./Header.module.css";

export default function Header() {
  const { items, totalItems, totalPrice } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            S
          </span>
          <span className={styles.brandName}>
            Shop<span className={styles.brandAccent}>Hub</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Catálogo
          </Link>

          <div className={styles.cartWrapper}>
            <button
              type="button"
              className={styles.cartButton}
              onClick={() => setCartOpen((open) => !open)}
              aria-expanded={cartOpen}
              aria-haspopup="dialog"
              aria-label={`Carrito de compras, ${totalItems} productos`}
            >
              <svg
                className={styles.cartIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className={styles.cartLabel}>Carrito</span>
              <span className={styles.badge} aria-live="polite">
                {totalItems}
              </span>
            </button>

            {cartOpen && (
              <div className={styles.cartPanel} role="dialog" aria-label="Resumen del carrito">
                <p className={styles.cartPanelTitle}>Tu carrito</p>
                {items.length === 0 ? (
                  <p className={styles.cartEmpty}>
                    Todavía no has añadido productos.
                  </p>
                ) : (
                  <>
                    <ul className={styles.cartList}>
                      {items.map((item) => (
                        <li key={item.id} className={styles.cartItem}>
                          <span className={styles.cartItemTitle}>
                            {item.title}
                          </span>
                          <span className={styles.cartItemDetail}>
                            {item.quantity} × {formatPrice(item.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className={styles.cartTotal}>
                      Total: <strong>{formatPrice(totalPrice)}</strong>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
