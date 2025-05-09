import React, { useState } from "react";
import styles from "../TaskModal/TaskModal.module.scss";
import { createComment } from "../../services/commentService.ts";
import { doc } from "firebase/firestore";
import { db } from "../../firebase.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { Task } from "../../types/TaskTypes.ts";

export interface CommentData {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
  isReply: boolean;
}

interface CommentProps {
  comment: CommentData;
  onDelete: (id: string) => void;
  task: Task;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onDelete,
  task,
}) => {
  const [addReply, setAddReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();

  const handleAddReply = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && replyText !== "") {
      createComment(
        replyText,
        user.email,
        doc(db, "tasks", task.id),
        true,
        doc(db, "comments", comment.id),
      );
      setReplyText("");
      setAddReply(false)
    } else if (e.key === "Escape") {
      setReplyText("");
      setAddReply(false)
    }
  };

  return (
    <div className={styles.comment} style={{
      marginLeft: comment.isReply ? 50 : 0
    }}>
      <div className={styles.commentInfo}>
        <div className={styles.commentName}>{comment.author.slice(0,2)}</div>
        <p className={styles.commentText}>{comment.text}</p>
        <button onClick={() => onDelete(comment.id)}>Delete</button>
        {!comment.isReply && <button onClick={() => setAddReply(!addReply)}>{addReply ? 'Cancel' :'Reply'}</button>}
        {addReply && (
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleAddReply}
          />
        )}
      </div>
      <p className={styles.commentData}>{comment.createdAt.toLocaleString()}</p>
    </div>
  );
};
