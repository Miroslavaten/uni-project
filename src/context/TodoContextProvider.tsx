import { createContext, useContext, useState } from "react";
import { TodoContextType, TodoProviderProps } from "../types/TodoTypes";

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  addTodo: () => {},
});
export const useTodo = () => useContext(TodoContext);
const TodoContextProvider = ({ children }: TodoProviderProps) => {
  const [todos, setTodos] = useState<string[]>([]);

  const addTodo = (todo: string) => {
    setTodos((prev) => [...prev, todo]);
  };
  return (
    <TodoContext.Provider value={{ todos, addTodo }}>
      {children}
    </TodoContext.Provider>
  );
};
export default TodoContextProvider;
