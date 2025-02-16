import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  // Clear both cookies
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    expires: new Date(0)
  });

  response.cookies.set({
    name: 'refreshToken',
    value: '',
    httpOnly: true,
    expires: new Date(0)
  });

  return response;
}
