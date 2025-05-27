
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  manufacturer: string;
  software_version: string | null;
  requirements: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItemType {
  product: ProductType;
  quantity: number;
}
