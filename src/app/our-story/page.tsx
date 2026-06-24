import OurStoryClient from './OurStoryClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('ourStory');
}

export default function Page() {
  return <OurStoryClient />;
}
