import { Product } from './product';
import { ShippingAddres } from './shippingAddres';
import { User } from './user';

export interface Order {
  _id?: string;
  date?: string;
  order: number;
  status: string;
  list: [
    {
      product: Product;
      quantity: number;
      cost: number;
    }
  ];
  user: User;
  shipping?: ShippingAddres;
}
