import ContactClient from './ContactClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('contact');
}

export default function Page() {
  return <ContactClient />;
}
