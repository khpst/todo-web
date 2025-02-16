import { GraphQLResponse } from "@/types/api";

export const fetchGraphQL = async <T>(query: string, variables = {}): Promise<GraphQLResponse<T>> => {
  const response = await fetch('http://localhost:3280/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error('GraphQL request failed' + response.statusText);
  }

  const data = await response.json();
  console.log('debug query: ', data);
  return data
};