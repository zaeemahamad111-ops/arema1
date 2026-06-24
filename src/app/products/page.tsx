import ProductsClient from './ProductsClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('products');
}

export default function Page() {
  return <ProductsClient />;
}
