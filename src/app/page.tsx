import HomePage from './HomePage';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('home');
}

export default function Page() {
  return <HomePage />;
}
