"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { TodoCard } from "@/components/TodoCard";
import { Todo } from "@/types/todo";
import { DialogTodoForm } from "@/components/DialogTodoForm";
import DialogConfirm from "@/components/DialogConfirm";
import { User } from "@/types/user";

export default function Dashboard() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogout, setShowLogout] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    todoId: 0,
  });

  useEffect(() => {
    setCurrentTime(new Date());
    fetchTodos();
    fetchUserInfo();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todo");
      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateTodo = async (data: {
    title: string;
    description: string;
    priority: string;
  }) => {
    try {
      const response = await fetch("/api/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        fetchTodos(); // Refresh the todo list
      }
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  const showDeleteDialog = async (id: number) => {
    setDeleteDialog({
      isOpen: true,
      todoId: id,
    });
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todo?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteDialog({ isOpen: false, todoId: 0 });
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const handleStatusChange = async (todo: Todo) => {
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    try {
      const response = await fetch("/api/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...todo,
          status: newStatus,
        }),
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to update todo status:", error);
    }
  };

  return (
    <div className="min-h-screen text-gray-700 bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          {/* Time Display */}
          <div className="grid grid-cols-2 gap-2">
            <div className="text-4xl font-bold row-span-2">
              {currentTime.getDate()}
            </div>
            <div className="text-lg">
              {currentTime.toLocaleString("en-US", { weekday: "long" })}
            </div>
            <div className="text-sm text-gray-600">
              {currentTime.toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsDialogOpen(true)}
            >
              New Task
            </button>
            <label className="text-base">
              Welcome, {user?.displayName || "User"}!
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                className="w-10 h-10 rounded-full bg-gray-300"
                onClick={() => setShowLogout(!showLogout)}
              >
                <label className="text-xl pointer-events-none">👤</label>
              </button>
              {showLogout && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    handleLogout();
                    setShowLogout(false); // Close the dropdown after clicking
                  }}
                  className="absolute right-0 mt-4 bg-white shadow-lg rounded-md py-2 px-4 text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full my-10 border-b border-dashed border-gray-400"></div>

        {/* Todo Sections */}
        <div className="space-y-8">
          {/* TODO Tasks */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-center">TODO TASKS</h2>
            <div className="space-y-4">
              {todos.filter((todo) => todo.status === "pending").length ===
              0 ? (
                <div className="text-center p-8 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    No pending tasks. Create a new task to get started!
                  </p>
                </div>
              ) : (
                todos
                  .filter((todo) => todo.status === "pending")
                  .reverse()
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      title={todo.title}
                      description={todo.description}
                      priority={todo.priority}
                      status={todo.status}
                      onDelete={() => showDeleteDialog(todo.id)}
                      onStatusChange={() => handleStatusChange(todo)}
                    />
                  ))
              )}
            </div>
          </section>

          <div className="w-full h-4 my-2 border-b border-dashed border-gray-400"></div>

          {/* DONE Tasks */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-center">DONE TASKS</h2>
            <div className="space-y-4">
              {todos.filter((todo) => todo.status === "completed").length ===
              0 ? (
                <div className="text-center p-8 bg-white/30 backdrop-blur-sm rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    No completed tasks yet. Complete a task to see it here!
                  </p>
                </div>
              ) : (
                todos
                  .filter((todo) => todo.status === "completed")
                  .reverse()
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      title={todo.title}
                      description={todo.description}
                      priority={todo.priority}
                      status={todo.status}
                      onDelete={() => showDeleteDialog(todo.id)}
                      onStatusChange={() => handleStatusChange(todo)}
                    />
                  ))
              )}
            </div>
          </section>
        </div>
      </div>
      <DialogTodoForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateTodo}
      />
      <DialogConfirm
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, todoId: 0 })}
        onConfirm={() => handleDeleteTodo(deleteDialog.todoId)}
        title="Delete Todo"
        message="Are you sure you want to delete this todo?"
      />
    </div>
  );
}
