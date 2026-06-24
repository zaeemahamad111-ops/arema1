import CertificatesClient from './CertificatesClient';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return generatePageMetadata('certificates');
}

export default function Page() {
  return <CertificatesClient />;
}
