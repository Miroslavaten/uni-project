import { ReactNode } from 'react';

export type TodoContextType = {
  todos: string[];
  addTodo: (todo: string) => void;
};

export type TodoProviderProps = {
  children: ReactNode;
};
