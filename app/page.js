"use client";

import { useEffect, useRef, useState } from "react";
import TodoList from "@/components/TodoList";
import TodoForm from "@/components/TodoForm";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const { theme = "dark", setTheme } = useTheme();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const menuRef = useRef(null);

  const router = useRouter();

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      if (res.status === 401 || res.status === 404) {
        return router.push("/login");
      }
      const data = await res.json();
      console.log("data in fetch todos : ", data);
      if (!data.error) {
        setTodos(data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user");
      if (res.status === 401 || res.status === 404) {
        return router.push("/login");
      }
      const data = await res.json();
      console.log("data in fetch user : ", data);
      if (!data.error) {
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchUser();
  }, []);

  // Add new todo
  const addTodo = async (text) => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        "Content-type": "application/json",
        body: JSON.stringify({ text }),
      });
      if (res.status === 401 || res.status === 404) {
        return router.push("/login");
      }
      const data = await res.json();
      console.log("data in add Todo : ", data);
      if (!data.error) {
        setTodos([data.data, ...todos]);
      }
    } catch (error) {
      console.log("Error while posting : ", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (res.status === 401 || res.status === 404) {
        return router.push("/login");
      }
      const data = await res.json();
      console.log("data in delete todo : ", data);
      if (!data.error) {
        setTodos(todos.filter((todo) => todo._id !== id));
      }
    } catch (error) {
      console.log("Error While Deleting : ", error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo._id === id);
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        "Content-type": "application/json",
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (res.status === 401 || res.status === 404) {
        return router.push("/login");
      }
      const data = await res.json();
      console.log("data in toggle todo : ", data);
      if (!data.error) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      }
    } catch (error) {
      console.log("Error While Editing : ", error);
    }
  };

  // Update todo text
  const updateTodo = async (id, newText) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        "Content-type": "application/json",
        body: JSON.stringify({ text: newText }),
      });

      if (res.status === 401 || res.status === 404) {
        return router.push("/login");
      }

      const data = await res.json();
      console.log("data in update todo : ", data);
      if (!data.error) {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? { ...todo, text: newText } : todo,
          ),
        );
      }
    } catch (error) {
      console.log("Error While updating Text", error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      
      if (res.ok) {
        return router.push("/login");
      }
    } catch (error) {
      console.log("Error logging out : ", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        <header className="mb-8 flex justify-between items-center relative">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-600">
            Todo App
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="py-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <UserIcon className="h-5 w-5" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 max-w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4 shadow-lg z-10 text-gray-900 dark:text-gray-100">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div
                    className="text-xs text-gray-600 dark:text-gray-400 mb-3 truncate"
                    title={user.email}
                  >
                    {user.email}
                  </div>
                  <button
                    onClick={() => handleLogout(user._id)}
                    className="w-full text-left text-red-500 hover:underline text-sm cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <TodoForm addTodo={addTodo} />

        <main className="mt-6">
          <TodoList
            todos={todos}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            updateTodo={updateTodo}
          />
        </main>
      </div>
    </div>
  );
}
