# ShopHub 🛒

Plataforma de comercio electrónico construida con **Next.js (App Router)**, **React Context** y **TypeScript** como solución al preparcial (20%). Consuma la API pública de [DummyJSON](https://dummyjson.com/products).

## Funcionalidades

- **Catálogo principal (`/`)**: 8 productos obtenidos de forma asíncrona, presentados en tarjetas con miniatura, nombre, categoría, precio y stock. Cada tarjeta permite ir al detalle o añadir el producto directamente al carrito.
- **Detalle de producto (`/productos/[id]`)**: ruta dinámica con imagen principal y miniaturas, categoría/marca, precio (con descuento cuando aplica), disponibilidad de stock, descripción completa, botón de añadir al carrito y enlace de retorno al catálogo.
- **Barra superior persistente**: visible en todas las rutas, con la marca (enlace a `/`) y un contador del carrito que se actualiza reactivamente con cada adición, manteniendo su valor al navegar entre vistas.
- **Carrito global (React Context)**: estado compartido en toda la aplicación, con actualizaciones inmutables y persistencia en `localStorage` que sobrevive recargas del navegador.

## Arquitectura

| Módulo | Rol |
|---|---|
| `app/layout.tsx` | Layout raíz: monta `CartProvider` y el header persistente |
| `app/page.tsx` | Server Component: consulta el catálogo y renderiza las tarjetas |
| `app/productos/[id]/page.tsx` | Server Component: ruta dinámica con `generateMetadata`, `notFound()` y skeleton de carga |
| `context/CartContext.tsx` | Contexto del carrito con `useSyncExternalStore` (cliente) |
| `components/Header.tsx` | Header con contador reactivo y mini-carrito (cliente) |
| `components/ProductCard.tsx` | Tarjeta de producto (servidor; solo su botón es de cliente) |
| `components/AddToCartButton.tsx` | Botón de adición con confirmación visual (cliente) |
| `lib/api.ts` | Capa de acceso a la API de DummyJSON |
| `types/product.ts` | Contratos de datos con TypeScript |

## Ejecución

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Endpoints consumidos

- Catálogo: `GET https://dummyjson.com/products?limit=8&select=id,title,price,category,thumbnail,stock`
- Detalle: `GET https://dummyjson.com/products/{id}`
