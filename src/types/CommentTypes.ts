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
