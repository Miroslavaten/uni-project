import React from "react";
import {TaskDetailsProps} from "../types/TaskTypes";
import styles from "../styles/taskDetails.module.scss";


export const TaskDetailsModal: React.FC<TaskDetailsProps> = ({task, onClose}) => {
    if (!task) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>✕</button>
                <h2>{task.title}</h2>
                <p><strong>Description:</strong> {task.description}</p>
                <p><strong>Legend:</strong> {task.legend}</p>
                <p><strong>Author:</strong> {task.author}</p>
                <p><strong>Created:</strong> {task.createdAt.toLocaleString()}</p>
                <p><strong>Updated:</strong> {task.updatedAt.toLocaleString()}</p>
            </div>
        </div>
    );
};
