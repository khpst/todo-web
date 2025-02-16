import { NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/utils/jwt';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    
    const payload: any = verifyToken(refreshToken);
    if (!payload) {
      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const newToken = generateToken(payload.userId);

    return NextResponse.json(
      { token: newToken },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
