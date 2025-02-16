import { NextResponse, NextRequest } from 'next/server';
import { fetchGraphQL } from '@/utils/graphql';
import { USER_BY_ID_QUERY } from "@/constants/queries";
import { decode } from "@/utils/jwt";
import { User } from '@/types/user';

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")!.value;
  const { sub: userId } = await decode(token);

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const { data } = await fetchGraphQL(USER_BY_ID_QUERY, {
    id: parseInt(userId as string),
  });

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const user: User = (data as any).usersById;

  return NextResponse.json({ user });
}
