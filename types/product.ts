export interface ProductSummary {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
  stock: number;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  brand?: string;
  images?: string[];
  rating?: number;
  discountPercentage?: number;
}

export interface ProductsResponse {
  products: ProductSummary[];
  total: number;
  skip: number;
  limit: number;
}
