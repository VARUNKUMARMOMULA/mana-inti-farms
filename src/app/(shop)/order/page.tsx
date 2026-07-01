import { Metadata } from 'next';
import OrderClient from './OrderClient';

export const metadata: Metadata = {
  title: 'Checkout | Mana Inti Farms',
  robots: 'noindex, nofollow',
};

export default function OrderPage() {
  return <OrderClient />;
}
