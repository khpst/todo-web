export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: "low" | "normal" | "high";
  status: "pending" | "completed";
  userId: number;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface TodoCardProps {
  title: string;
  description: string;
  priority: "high" | "normal" | "low";
  status: "pending" | "completed";
  onDelete: () => void;
  onStatusChange: () => void;
}
