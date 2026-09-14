import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container notFound">
      <h1>Producto no encontrado</h1>
      <p>El producto que buscas no existe o fue retirado del catálogo.</p>
      <Link href="/">← Volver al catálogo</Link>
    </div>
  );
}
