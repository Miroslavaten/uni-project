import { DocumentReference } from "firebase/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: DocumentReference;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
  onUpdated?: () => void;
}
