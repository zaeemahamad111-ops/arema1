import BlogClient from './BlogClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('blog');
}

export default function Page() {
  return <BlogClient />;
}
