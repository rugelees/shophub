"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { ProductSummary } from "@/types/product";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: ProductSummary) => void;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "shophub-cart";
const EMPTY_CART: CartItem[] = [];

let cachedCart: CartItem[] | null = null;
const listeners = new Set<() => void>();

function readStoredCart(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return EMPTY_CART;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return EMPTY_CART;
    return parsed as CartItem[];
  } catch (error) {
    console.error("No fue posible leer el carrito almacenado", error);
    return EMPTY_CART;
  }
}

function getSnapshot(): CartItem[] {
  if (cachedCart === null) {
    cachedCart = readStoredCart();
  }
  return cachedCart;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cachedCart = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commitCart(next: CartItem[]): void {
  cachedCart = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("No fue posible guardar el carrito", error);
  }
  listeners.forEach((listener) => listener());
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((product: ProductSummary) => {
    const current = getSnapshot();
    const existing = current.find((item) => item.id === product.id);

    if (existing) {
      commitCart(
        current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return;
    }

    commitCart([
      ...current,
      {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      },
    ]);
  }, []);

  const incrementQuantity = useCallback((id: number) => {
    const current = getSnapshot();
    commitCart(
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);
  
  const decrementQuantity = useCallback((id: number) => {
    const current = getSnapshot();
    const next = current
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    commitCart(next);
  }, []);

  const removeItem = useCallback((id: number) => {
    const current = getSnapshot();
    commitCart(current.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    commitCart(EMPTY_CART);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      addItem,
      incrementQuantity,
      decrementQuantity, 
      removeItem,
      clearCart,
    }),
    [items, addItem, incrementQuantity, decrementQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe utilizarse dentro de un CartProvider");
  }
  return context;
}
