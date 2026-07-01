import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Fresh Country Eggs & Chicken | Mana Inti Farms',
  description: 'Order 100% natural, antibiotic-free free-range country eggs and freshly dressed country chicken (Natukodi) online. Delivered fresh to your home in Hyderabad.',
  alternates: {
    canonical: 'https://manaintifarms.com/products',
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
