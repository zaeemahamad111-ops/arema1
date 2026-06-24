import { cookies } from 'next/headers';
import CMSLogin from './CMSLogin';
import CMSClient from './CMSClient';

export const metadata = {
  title: 'Content Management System | Arema Foods',
  description: 'Manage page content, products, blog articles, and assets.',
};

export default async function CMSPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('arema_cms_session')?.value;
  const isAuthenticated = session === 'arema-admin-authorized';

  if (!isAuthenticated) {
    return <CMSLogin />;
  }

  return <CMSClient />;
}
