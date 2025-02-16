import { NextResponse, NextRequest } from 'next/server';
import { fetchGraphQL } from '@/utils/graphql';
import {
  TODOS_BY_USER_ID_QUERY,
  CREATE_TODO_MUTATION,
  DELETE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
} from "@/constants/queries";
import { TodosResponse } from "@/types/todo";
import { decode } from "@/utils/jwt";

export async function GET(request: NextRequest) {
  // already verified in middleware
  const token = request.cookies.get("token")!.value;

  const { sub: userId } = await decode(token);

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const { data } = await fetchGraphQL<TodosResponse>(TODOS_BY_USER_ID_QUERY, {
    userId: parseInt(userId as string),
  });

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")!.value;
  const { sub: userId } = await decode(token);

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const body = await request.json();
  const response = await fetchGraphQL(CREATE_TODO_MUTATION, {
    ...body,
    userId: parseInt(userId as string),
  });

  return NextResponse.json(response.data);
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("token")!.value;
  const { sub: userId } = await decode(token);

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  const response = await fetchGraphQL(DELETE_TODO_MUTATION, {
    keyId: parseInt(id),
    preCheck: {
      userId: { _eq: parseInt(userId as string) },
    },
  });

  return NextResponse.json(response.data);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("token")!.value;
  const { sub: userId } = await decode(token);

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, description, priority, status } = body;

  if (!id) {
    return NextResponse.json({ error: "Todo ID is required" }, { status: 400 });
  }

  const response = await fetchGraphQL(UPDATE_TODO_MUTATION, {
    id: parseInt(id),
    title: { set: title },
    description: { set: description },
    priority: { set: priority },
    status: { set: status },
    preCheck: {
      userId: { _eq: parseInt(userId as string) },
    },
  });

  return NextResponse.json(response.data);
}