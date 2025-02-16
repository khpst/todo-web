export interface GraphQLResponse<T> {
  data: T | null;
  errors?: Array<{ message: string }>;
}
