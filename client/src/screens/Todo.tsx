import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axiosInstance, { endpoints } from "../apis";
import { FiLogOut, FiEdit, FiTrash, FiSave } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";
import { Axios, AxiosResponse } from "axios";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Todo() {
  const { signOut, user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [loading, setLoading] = useState({
    fetch: true,
    add: false,
    update: false,
    deleteId: "",
    generateSummary: false,
  });

  const addTodo = useCallback(async () => {
    if (input.trim()) {
      setLoading((prev) => ({ ...prev, add: true }));
      try {
        const { data } = await axiosInstance.post(endpoints.todo.create, {
          title: input.trim(),
        });
        setTodos((prev) => [...prev, data.data]);
        setInput("");
      } catch (error) {
        console.error("Error adding todo:", error);
      } finally {
        setLoading((prev) => ({ ...prev, add: false }));
      }
    }
  }, [input]);

  const toggleStatus = useCallback(
    async (id: string) => {
      setLoading((prev) => ({ ...prev, update: true }));
      const completed = !todos.find((todo) => todo.id === id)?.completed;
      try {
        const { data } = await axiosInstance.put(endpoints.todo.update, {
          id,
          completed,
        });
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? data.data : todo))
        );
      } catch (error) {
        console.error("Error updating todo status:", error);
      } finally {
        setLoading((prev) => ({ ...prev, update: false }));
      }
    },
    [todos]
  );

  const deleteTodo = useCallback(async (id: string) => {
    setLoading((prev) => ({ ...prev, deleteId: id }));
    try {
      const { data } = await axiosInstance.delete(endpoints.todo.delete(id));
      if (data.success) {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setLoading((prev) => ({ ...prev, deleteId: "" }));
    }
  }, []);

  const updateTitle = useCallback(
    async (id: string) => {
      if (editingTitle.trim()) {
        setLoading((prev) => ({ ...prev, update: true }));
        try {
          const { data } = await axiosInstance.put(endpoints.todo.update, {
            id,
            title: editingTitle.trim(),
          });
          setTodos((prev) =>
            prev.map((todo) => (todo.id === id ? data.data : todo))
          );
          setEditingTodoId(null);
          setEditingTitle("");
        } catch (error) {
          console.error("Error updating title:", error);
        } finally {
          setLoading((prev) => ({ ...prev, update: false }));
        }
      }
    },
    [editingTitle, todos]
  );

  const fetchAllTodos = useCallback(async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const { data } = await axiosInstance.get(endpoints.todo.get);
      setTodos(data.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, []);

  const generateSummary = useCallback(async () => {
    setLoading((prev) => ({ ...prev, generateSummary: true }));
    try {
      const response = axiosInstance.post(endpoints.todo.genereate_summary);
      toast.promise(response, {
        pending: "Generating summary...",
        success: {
          render({ data }) {
            return data.data.message;
          },
        },
        error: {
          render({ data }) {
            // @ts-expect-error
            return data?.response?.data?.message || data?.message;
          },
        },
      });
      const { data } = await response;
      console.info(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading((prev) => ({ ...prev, generateSummary: false }));
    }
  }, []);

  useEffect(() => {
    if (user === null) return;
    fetchAllTodos();
  }, [fetchAllTodos, user]);

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Todo Manager</h2>
        <button
          onClick={signOut}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
          title="Logout"
        >
          <FiLogOut className="text-xl" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div> */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Todo Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={generateSummary}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg shadow hover:opacity-90 transition"
            title="Summary"
            disabled={loading.generateSummary}
          >
            <span className="text-sm sm:text-base font-medium">
              {loading.generateSummary ? (
                <div className=" w-16 px-4 py-1 flex items-center justify-center">
                  <ImSpinner2 className="animate-spin" />
                </div>
              ) : (
                "Summary"
              )}
            </span>
          </button>

          <button
            onClick={signOut}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
            title="Logout"
          >
            <FiLogOut className="text-xl" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Add a new todo..."
            className="border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            disabled={loading.add}
          />
          <button
            onClick={addTodo}
            disabled={loading.add}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg transition ${
              loading.add ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading.add ? <ImSpinner2 className="animate-spin" /> : "Add"}
          </button>
        </div>

        <ul className="space-y-4">
          {/* Skeleton while fetching */}
          {loading.fetch &&
            Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg animate-pulse"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>
                </div>
              </li>
            ))}

          {/* Actual todos */}
          {!loading.fetch &&
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => toggleStatus(todo.id)}
                    disabled={loading.update}
                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                      todo.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-400"
                    } ${loading.update ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {todo.completed && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {editingTodoId === todo.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && updateTitle(todo.id)
                      }
                      disabled={loading.update}
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setEditingTodoId(todo.id);
                        setEditingTitle(todo.title);
                      }}
                      className={`flex-grow cursor-pointer ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 ml-3">
                  {editingTodoId === todo.id ? (
                    <button
                      onClick={() => updateTitle(todo.id)}
                      disabled={loading.update}
                      className={`text-green-500 hover:text-green-700 transition ${
                        loading.update ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                      title="Save Todo"
                    >
                      {loading.update ? (
                        <ImSpinner2 className="animate-spin" />
                      ) : (
                        <FiSave className="text-lg" />
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingTodoId(todo.id);
                        setEditingTitle(todo.title);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition"
                      title="Edit Todo"
                    >
                      <FiEdit className="text-lg" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    disabled={loading.deleteId === todo.id}
                    className={`text-red-500 hover:text-red-700 transition ${
                      loading.deleteId === todo.id
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                    title="Delete Todo"
                  >
                    {loading.deleteId === todo.id ? (
                      <ImSpinner2 className="animate-spin" />
                    ) : (
                      <FiTrash className="text-lg" />
                    )}
                  </button>
                </div>
              </li>
            ))}
        </ul>

        {!loading.fetch && todos.length === 0 && (
          <p className="text-center text-gray-400 mt-6">
            No todos yet. Add one!
          </p>
        )}
      </div>
    </div>
  );
}
