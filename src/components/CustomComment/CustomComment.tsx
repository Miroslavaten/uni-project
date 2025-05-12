import React, { useState } from "react";
import styles from "./customComment.module.scss";
import { createComment, updateComment } from "../../services/commentService.ts";
import { EditableField } from "../CustomInputs/CustomInputs.tsx";
import { doc } from "firebase/firestore";
import { db } from "../../firebase.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { CommentProps } from "../../types/CommentTypes.ts";

export const Comment: React.FC<CommentProps> = ({
  comment,
  onDelete,
  refetch,
  task,
}) => {
  const [description, setDescription] = useState<string>(comment.text);
  const [addReply, setAddReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const { user } = useAuth();

  const handleAddReply = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && replyText !== "") {
      await createComment(
        replyText,
        user?.email || "",
        doc(db, "tasks", task.id),
        true,
        doc(db, "comments", comment.id),
      );
      await refetch?.();
      setReplyText("");
      setAddReply(false);
    } else if (e.key === "Escape") {
      setReplyText("");
      setAddReply(false);
    }
  };

  return (
    <div
      className={`${styles.comment} ${comment.isReply ? styles.commentReply : ""}`}
    >
      <div className={styles.commentContent}>
        <div className={styles.commentInfo}>
          <div className={styles.commentName}>{comment.author.slice(0, 2)}</div>
          <EditableField
            className={styles.commentText}
            value={description}
            onSave={async (val) => {
              setDescription(val);
              await updateComment(comment.id, val);
            }}
          />
        </div>
        {!comment.isReply && addReply && (
          <input
            className={styles.addReplyInput}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleAddReply}
          />
        )}
        <div className={` ${addReply ? styles.replyButtonWrapper : ""}`}>
          <button
            className={styles.deleteCommentButton}
            onClick={() => onDelete(comment.id)}
          >
            Delete
          </button>
          {!comment.isReply && (
            <button
              className={styles.replyCommentButton}
              onClick={() => setAddReply(!addReply)}
            >
              {addReply ? "Cancel" : "Reply"}
            </button>
          )}
        </div>
      </div>
      <p className={styles.commentData}>{comment.createdAt.toLocaleString()}</p>
    </div>
  );
};
