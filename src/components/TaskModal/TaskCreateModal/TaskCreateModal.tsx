import React, { FC, useState } from "react";
import styles from "./taskDetailsModal.module.scss";
import { DocumentReference } from "firebase/firestore";
import {createTask} from "../../../services/taskService.ts";

interface CreateTaskModalProps {
    columnRef: DocumentReference;
    onClose: () => void;
    onCreated: () => void;
    author: string;
}

export const CreateTaskModal: FC<CreateTaskModalProps> = ({ columnRef, onClose, onCreated, author }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

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
                    <h2>Создание задачи</h2>
                    <button onClick={onClose} className={styles.icon}>X</button>
                </div>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Заголовок"
                    className={styles.input}
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание"
                    className={styles.textarea}
                />
                <button onClick={handleCreate} className={styles.saveButton} disabled={loading}>
                    {loading ? "Создание..." : "Создать"}
                </button>
            </div>
        </div>
    );
};
