"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import styles from "./page.module.css";

const PAYMENT_METHODS = [
  "Tarjeta de crédito",
  "Tarjeta débito",
  "PSE",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CheckoutForm {
  nombre: string;
  correo: string;
  pago: string;
  terminos: boolean;
}

const INITIAL_FORM: CheckoutForm = {
  nombre: "",
  correo: "",
  pago: "",
  terminos: false,
};

function validate(form: CheckoutForm) {
  const errors: Partial<Record<keyof CheckoutForm, string>> = {};

  if (form.nombre.trim().length < 5) {
    errors.nombre = "El nombre debe tener al menos 5 caracteres.";
  }
  if (!EMAIL_PATTERN.test(form.correo.trim())) {
    errors.correo = "No has ingresado un correo valido";
  }
  if (!form.pago) {
    errors.pago = "Selecciona un medio de pago.";
  }

  return errors;
}

export default function CheckoutPage() {
  const {
    items,
    totalPrice,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const errors = validate(form);
  const isFormValid =
    Object.keys(errors).length === 0 && form.terminos === true;

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target;
    const checked =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleBlur(name: keyof CheckoutForm) {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearCart();
    setForm(INITIAL_FORM);
    setTouched({});
    setSubmitting(false);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="container">
        <div className={styles.confirmed}>
          <h1>Orden confirmada</h1>
          <p>Gracias por tu compra. Tu orden fue registrada correctamente.</p>
          <Link href="/" className={styles.confirmedLink}>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className={styles.empty}>
          <h1>Checkout</h1>
          <p>Tu carrito está vacío</p>
          <Link href="/" className={styles.confirmedLink}>
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.heading}>
        <h1>Checkout</h1>
        <p>Revisa tu orden y completa los datos de facturación.</p>
      </div>

      <div className={styles.layout}>
        <section className={styles.summary}>
          <div className={styles.summaryHeader}>
            <h2 className={styles.sectionTitle}>Resumen de la compra</h2>
            <button
              type="button"
              className={styles.clearCart}
              onClick={clearCart}
            >
              Eliminar carrito
            </button>
          </div>

          <ul className={styles.itemList}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={56}
                    height={56}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  <p className={styles.itemPrice}>
                    {formatPrice(item.price)} c/u
                  </p>
                  <button
                    type="button"
                    className={styles.removeItem}
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.quantity}>
                    <button
                      type="button"
                      onClick={() => decrementQuantity(item.id)}
                      aria-label={`Disminuir cantidad de ${item.title}`}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => incrementQuantity(item.id)}
                      aria-label={`Aumentar cantidad de ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.subtotal}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className={styles.total}>
            Precio total: <strong>{formatPrice(totalPrice)}</strong>
          </p>
        </section>

        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Datos de cliente</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                onBlur={() => handleBlur("nombre")}
              />
              {touched.nombre && errors.nombre && (
                <p className={styles.error}>{errors.nombre}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                onBlur={() => handleBlur("correo")}
              />
              {touched.correo && errors.correo && (
                <p className={styles.error}>{errors.correo}</p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="pago">medio de pago</label>
              <select
                id="pago"
                name="pago"
                value={form.pago}
                onChange={handleChange}
                onBlur={() => handleBlur("pago")}
              >
                <option value="">Selecciona un medio de pago:</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {touched.pago && errors.pago && (
                <p className={styles.error}>{errors.pago}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.checkbox}>
                <input
                  name="terminos"
                  type="checkbox"
                  checked={form.terminos}
                  onChange={handleChange}
                />
                Acepto los términos y condiciones de shophub
              </label>
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={!isFormValid || submitting}
            >
              {submitting ? "Enviando tu orden…" : "Confirmar pedido"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
