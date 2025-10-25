// app/api/auth/refresh/route.ts
import { api } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const res = await api.post<{ token: string }>(`/auth/refresh-token`, {
      refreshToken: refreshToken,
    });

    const token = res.data.token;

    cookieStore.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 10,
    });

    console.log('REFRESH TOKEN KICKED IN');

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
