import {DocumentReference} from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  legend: string;
  columnId: DocumentReference;
  order: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCardProps {
  id: string;
  title: string;
  description: string;
}

export interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
  onUpdated?: () => void;
}
