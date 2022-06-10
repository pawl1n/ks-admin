import { ShippingAddres } from './shippingAddres';

export interface User {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  isAdmin?: boolean;
  shipping?: ShippingAddres;
}
