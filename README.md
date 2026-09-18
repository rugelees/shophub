# ShopHub

Tienda web hecha con Next.js (App Router), React Context y TypeScript. Los productos se consumen de la API pública de [DummyJSON](https://dummyjson.com/products).

## Ejecutar

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Rutas

- `/` — catálogo de productos
- `/productos/[id]` — detalle de un producto
- `/checkout` — resumen del carrito y formulario de facturación

## Decisiones de Arquitectura y Cambios del Parcial

### Punto 1: evolucion del contexto

En el preparcial el `CartContext` solo exponía `addItem` (adición acumulativa con `quantity` por producto), pero para el parcial se extendio el mismo patrón de `useSyncExternalStore` + `localStorage` añadiendo las operaciones `incrementQuantity`, `decrementQuantity`, `removeItem` y `clearCart`.

La inmutabilidad se garantiza porque ninguna operación muta el arreglo existente, pues iempre se construye un arreglo nuevo con `map` (para cambiar la cantidad de un ítem creando un objeto nuevo con spread `{ ...item, quantity: item.quantity + 1 }`) o con `filter` (para descartar el ítem al llegar a 0 o al eliminarlo). `decrementQuantity` combina ambas: primero `map` resta 1 y luego `filter` descarta los que quedaron en 0. El unico punto donde se "escribe" es `commitCart`, que reemplaza el snapshot de antes y persiste en `localStorage` y notifica a los listeners despues

### Punto 2: calculo de totales

`totalItems` y `totalPrice` no se guardan en ningún estado, pues se derivan del arreglo `items` con `reduce` dentro del `useMemo` que arma el valor del contexto, lo que hace que se eviten duplicados en memoria (los totales siempre son consistentes con los ítems porque se calculan en el mismo render a partir de la misma fuente) y el `useMemo` limita el recálculo a cuando `items` cambia realmente. Como el arreglo se reemplaza inmutablemente en cada operacion entonces la referencia nueva es lo que invalida la memoizacion.

### Punto 3: arquitectura del formulario

La vista `/checkout` es un componente cliente (`"use client"`) porque depende del estado global del carrito y de estado local interactivo. El formulario es completamente controlado por React, se usa un solo objeto de estado `form` (`nombre`, `correo`, `pago`, `terminos`) actualizado con un `handleChange` genérico que detecta el `type === "checkbox"` para guardar el booleano en lugar del string.

La validación se calcula con la función `validate(form)` que se ejecuta en cada render, devolviendo un objeto de errores (`nombre` mínimo 5 caracteres, formato de `correo` con expresión regular, `pago` obligatorio). Los mensajes solo se muestran si el campo correspondiente está en el objeto `touched`, que se marca con `onBlur`, de modo que el usuario no ve errores antes de interactuar. El botón se deshabilita mientras haya errores o los términos no estén aceptados.

El envío usa `event.preventDefault()` y un estado `submitting` que deshabilita el botón y cambia su texto durante la espera para asi poder evitar envios duplicados. La operación se simula con una espera de 1500 ms pues no hay back que realmente registre el envio y al resolverse se llama `clearCart()` (lo que pone el contador del header en 0), se reinicia el formulario con su estado inicial y se muestra la pantalla de confirmación. 
