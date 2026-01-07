export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  images: {
    id: string;
    url: string;
    alt: string;
  }[];
  specs: string[];
  availableSizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
};

export type CartItem = {
  id: string;
  name:string;
  image: string;
  alt: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: CartItem[];
};

export type User = {
  id: string;
  name: string;
  email: string;
};

    