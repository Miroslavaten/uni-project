import { Task } from "./TaskTypes.ts";

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  isReply: boolean;
  commentId?: string | null;
  children: Comment[];
}

export interface CommentData {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
  isReply: boolean;
}

export interface CommentProps {
  comment: CommentData;
  onDelete: (id: string) => void;
  refetch?: () => void;
  task: Task;
}
