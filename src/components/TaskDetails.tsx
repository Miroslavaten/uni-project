import React, {useState} from "react";
import {TaskDetailsProps} from "../types/TaskTypes";
import styles from "../styles/taskDetails.module.scss";
import {EditableField} from "./EditableField.tsx";
import {updateTask} from "../services/taskService.ts";


export const TaskDetailsModal: React.FC<TaskDetailsProps> = ({task, onClose, onUpdated}) => {
    if (!task) return null;
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [legend, setLegend] = useState(task.legend);
    // const [loading, setLoading] = useState(false);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>✕</button>
                <EditableField
                    value={title}
                    onSave={async (val) => {
                        setTitle(val);
                        await updateTask(task.id, {title: val});
                        onUpdated?.();
                    }}
                    className={styles.editable}
                />
                <EditableField
                    value={description}
                    onSave={async (val) => {
                        setDescription(val);
                        await updateTask(task.id, {description: val});
                        onUpdated?.();
                    }}
                    textarea
                    className={styles.editable}
                />
                <EditableField
                    value={legend}
                    onSave={async (val) => {
                        setLegend(val);
                        await updateTask(task.id, {legend: val});
                        onUpdated?.();
                    }}
                    textarea
                    className={styles.editable}
                />
                <p><strong>Author:</strong> {task.author}</p>
                <p><strong>Created:</strong> {task.createdAt.toLocaleString()}</p>
                <p><strong>Updated:</strong> {task.updatedAt.toLocaleString()}</p>
            </div>
        </div>
    );
};
