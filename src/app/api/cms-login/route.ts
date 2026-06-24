import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedPassword = process.env.CMS_ADMIN_PASSWORD || 'aremafoods2026';

    if (username === 'admin' && password === expectedPassword) {
      const response = NextResponse.json({ success: true });
      
      const cookieStore = await cookies();
      cookieStore.set('arema_cms_session', 'arema-admin-authorized', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('arema_cms_session');
  return NextResponse.json({ success: true });
}
