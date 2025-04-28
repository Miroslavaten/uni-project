import React, {FC} from "react";
import {Task} from "../types/TaskTypes.ts";
import {useDraggable} from "@dnd-kit/core";
import styles from "../styles/taskCard.module.scss";

export const TaskCard: FC<{ task: Task; columnId: string }> = ({task, columnId}) => {
    const {id, title, description, author} = task;

    const {setNodeRef, listeners, attributes, transform} = useDraggable({
        id,
        data: {columnId},
    });

    return (
    <div ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
            }} className={styles.card}>
        <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.statusDot}/>
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.author}>@{author}</div>
    </div>
    );
};