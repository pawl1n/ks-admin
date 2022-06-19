import { Category } from './category';

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  images?: Array<string>;
  price: number;
  category: Category;
  article?: string;
  stock?: number;
  size?: string;
  type?: string;
}

export function instanceofProduct(object: any) {
  return 'name' in object && 'price' in object;
}
