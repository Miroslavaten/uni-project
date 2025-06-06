import React, { FC, useState } from "react";
import styles from "./createTaskCard.module.scss";
import { createTask } from "../../../../services/taskService.ts";
import { CreateTaskModalProps } from "../../../../types/TaskTypes.ts";

export const CreateTaskModal: FC<CreateTaskModalProps> = ({
  columnRef,
  onClose,
  onCreated,
  author,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createTask(author, title, description, columnRef);
      onCreated();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании задачи:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create task</h2>
          <button onClick={onClose} className={styles.icon}>
            ✕
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className={styles.taskTitle}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className={styles.taskDescription}
        />
        <button
          onClick={handleCreate}
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};
