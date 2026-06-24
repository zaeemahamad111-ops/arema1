import WhyAremaClient from './WhyAremaClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('whyArema');
}

export default function Page() {
  return <WhyAremaClient />;
}
