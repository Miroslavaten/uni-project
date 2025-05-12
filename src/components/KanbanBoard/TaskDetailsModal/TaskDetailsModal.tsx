import React, { FC, useState } from 'react';
import styles from './taskDetailsModal.module.scss';
import { deleteTask, updateTask } from '../../../services/taskService.ts';
import { EditableField } from '../../CustomInputs/CustomInputs.tsx';
import { TaskDetailsProps } from '../../../types/TaskTypes.ts';
import { useComments } from '../../../hooks/useComment.ts';
import {
  createComment,
  deleteComment,
} from '../../../services/commentService.ts';
import { useAuth } from '../../../hooks/useAuth.ts';
import { doc } from 'firebase/firestore';
import { db } from '../../../firebase.ts';
import { Comment } from '../../CustomComment/CustomComment.tsx';

const TaskModal: FC<TaskDetailsProps> = ({ task, onClose, onUpdated }) => {
  if (!task) return null;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const { comments, loading: commentsLoading, refetch } = useComments(task.id);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  const handleDeleteTask = async () => {
    if (confirm('Delete task?')) {
      await deleteTask(task.id);
      onUpdated?.();
      onClose();
    }
  };

  const handleCreateComment = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && newComment !== '') {
      await createComment(
        newComment,
        user?.email || '',
        doc(db, 'tasks', task.id)
      );
      setNewComment('');
      await refetch();
    } else if (e.key === 'Escape') {
      setNewComment('');
      await refetch();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Delete comment?')) {
      await deleteComment(commentId);
      await refetch();
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalWrapper} onClick={onClose}>
        <div className={styles.modalHeader}>
          <button onClick={handleDeleteTask} className={styles.deleteButton}>
            Delete
          </button>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.taskInfoWrapper}>
            <div className={styles.taskInfo}>
              <EditableField
                value={title}
                onSave={async (val) => {
                  setTitle(val);
                  await updateTask(task.id, { title: val });
                  onUpdated?.();
                }}
                className={styles.title}
              />
              <EditableField
                value={description}
                onSave={async (val) => {
                  setDescription(val);
                  await updateTask(task.id, { description: val });
                  onUpdated?.();
                }}
                textarea
                className={styles.description}
              />
            </div>
            <div className={styles.extraInfo}>
              <p>
                <strong>Author:</strong> {task.author}
              </p>
              <p>
                <strong>Created:</strong> {task.createdAt.toLocaleString()}
              </p>
              <p>
                <strong>Updated:</strong> {task.updatedAt.toLocaleString()}
              </p>
            </div>
          </div>
          <h3 className={styles.commentsTitle}>Comments</h3>
          <div className={styles.comments}>
            <div className={styles.commentsWrapper}>
              {commentsLoading ? (
                <p>Loading comments...</p>
              ) : comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id}>
                    <Comment
                      comment={comment}
                      onDelete={handleDeleteComment}
                      refetch={refetch}
                      task={task}
                    />
                    {comment.children.map((child) => (
                      <Comment
                        key={child.id}
                        comment={child}
                        onDelete={handleDeleteComment}
                        task={task}
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
            <div key={'add comment'}>
              <p>Add comment:</p>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleCreateComment}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
