// src/types/product.ts
export interface IProduct {
  id: number;
  title: string;
  price: number;
  images: string[];
  quantity?: number; // will be used by cart
}
