import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container notFound">
      <p className="notFoundCode">404</p>
      <h1 className="notFoundTitle">Producto no encontrado</h1>
      <p className="notFoundText">
        El artículo que buscas no existe o fue retirado del catálogo.
      </p>
      <Link href="/" className="notFoundLink">
        ← Volver al catálogo
      </Link>
    </div>
  );
}
