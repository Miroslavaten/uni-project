import React, { FC, useState } from "react";
import styles from "./TaskModal.module.scss";
import { updateTask } from "../../services/taskService.ts";
import { EditableField } from "../Editable/EditableField.tsx";
import { TaskDetailsProps } from "../../types/TaskTypes.ts";

const TaskModal: FC<TaskDetailsProps> = ({ task, onClose, onUpdated }) => {
  if (!task) return null;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [legend, setLegend] = useState(task.legend);

  return (
    <div onClick={onClose}>
      <button className={styles.closeButton} onClick={onClose}>
        ✕
      </button>
      <p>Task Id: </p>

      <div onClick={(e) => e.stopPropagation()}>
        <div className={styles.taskInfo}>
          <EditableField
            value={title}
            onSave={async (val) => {
              setTitle(val);
              await updateTask(task.id, { title: val });
              onUpdated?.();
            }}
            className={styles.editable}
          />
          <EditableField
            value={description}
            onSave={async (val) => {
              setDescription(val);
              await updateTask(task.id, { description: val });
              onUpdated?.();
            }}
            textarea
            className={styles.editable}
          />
          <EditableField
            value={legend}
            onSave={async (val) => {
              setLegend(val);
              await updateTask(task.id, { legend: val });
              onUpdated?.();
            }}
            textarea
            className={styles.editable}
          />
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
        <div className={styles.comments}>
          <div className={styles.comment}>
            <div className={styles.commentInfo}>
              <div className={styles.commentName}>AT</div>
              <p className={styles.commentText}>I don't wanna do this</p>
            </div>
            <p className={styles.commentData}>Thu 12:45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
