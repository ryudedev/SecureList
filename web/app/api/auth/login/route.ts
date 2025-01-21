import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();

  // Set httpOnly cookie from the server side
  const response = NextResponse.json({ success: true });

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return response;
}
