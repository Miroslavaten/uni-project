import { DocumentReference } from "firebase/firestore";

export const PRIORITIES = {
  high: "#f22222",
  medium: "#226ef2",
  low: "#75f222",
};

export const PRIORITY_VALUES = {
  low: 0,
  medium: 1,
  high: 2,
};

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: DocumentReference;
  author: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  priorityValue?: number;
}

export interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export interface CreateTaskModalProps {
  columnRef: DocumentReference;
  onClose: () => void;
  onCreated: () => void;
  author: string;
}
