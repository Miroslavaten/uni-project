import { Task } from './TaskTypes.ts';

export interface KanbanColumnProps {
  columnId: string;
  title: string;
}

export interface KanbanColumnPropsWithRegister extends KanbanColumnProps {
  registerRefetch: (refetch: () => void) => void;
  columnId: string;
  title: string;
  onTaskClick: (task: Task | null) => void;
  activeTaskId: string | null;
}
