import type {
  ProductDetail,
  ProductSummary,
  ProductsResponse,
} from "@/types/product";

const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(): Promise<ProductSummary[]> {
  const res = await fetch(
    `${BASE_URL}?limit=8&select=id,title,price,category,thumbnail,stock`
  );

  if (!res.ok) {
    throw new Error(`Error al consultar el catálogo (código ${res.status})`);
  }

  const data: ProductsResponse = await res.json();
  return data.products;
}

export async function getProductById(id: number): Promise<ProductDetail | null> {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error al consultar el producto (código ${res.status})`);
  }

  return (await res.json()) as ProductDetail;
}
