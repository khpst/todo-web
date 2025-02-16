import { NextResponse } from 'next/server';
import { generateToken, generateRefreshToken } from '@/utils/jwt';
import { fetchGraphQL } from '@/utils/graphql';
import { LOGIN_QUERY } from '@/constants/queries';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const { data } = await fetchGraphQL<LoginResponse>(LOGIN_QUERY, {
      username,
      password,
    });

    if(!data) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (data.users && data.users.length > 0) {
      const user = data.users[0];
      const token = await generateToken(user.id.toString());
      const refreshToken = await generateRefreshToken(user.id.toString());
      const response = NextResponse.json({ message: 'Login successful' });

      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60
      });

      response.cookies.set({
        name: 'refreshToken',
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
