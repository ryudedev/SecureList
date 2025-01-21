// app/api/auth/token/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {

  const cookiesStore = await cookies();
  const token = cookiesStore.get('token');

  console.log('Token from cookies:', token); // ログ出力

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 });
  }

  return NextResponse.json({ token }, { status: 200 });
}
