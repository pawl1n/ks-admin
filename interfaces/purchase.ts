import { Product } from './product';
import { Provider } from './provider';

export interface Purchase {
  _id?: string;
  date?: string;
  number: number;
  status: string;
  list: [
    {
      product: Product;
      quantity: number;
      cost: number;
    }
  ];
  provider: Provider;
}
