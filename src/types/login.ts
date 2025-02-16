interface LoginResponse {
  users: Array<{
    id: string;
    username: string;
  }>;
}