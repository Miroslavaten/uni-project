import React, {FC} from "react";
import {useColumns} from "../hooks/useColumns";
import {useTasks} from "../hooks/useTasks";
import {DndContext, DragEndEvent, useDroppable} from "@dnd-kit/core";
import {KanbanColumnProps} from "../types/KanbanTypes";
import styles from "../styles/kanban.module.scss";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase.ts";
import {TaskCard} from "./TaskCard.tsx";

export const KanbanBoard: FC = () => {
    const {columns, loading: columnsLoading} = useColumns();

    if (columnsLoading) {
        return <div>Loading columns...</div>;
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            const taskId = active.id as string;
            const newColumnId = over.id as string;

            if (active.data.current?.columnId !== newColumnId) {
                try {
                    const taskRef = doc(db, "tasks", taskId);
                    await updateDoc(taskRef, {
                        columnId: doc(db, "columns", newColumnId),
                    });
                } catch (error) {
                    console.error("Failed to move task:", error);
                }
            }
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className={styles.board}>
                {columns.map((column) => (
                    <KanbanColumn key={column.id} columnId={column.id} title={column.title}/>
                ))}
            </div>
        </DndContext>
    );
};

const KanbanColumn: FC<KanbanColumnProps> = ({columnId, title}) => {
    const {tasks, loading: tasksLoading} = useTasks(columnId);
    const {setNodeRef} = useDroppable({
        id: columnId,
    });

    return (
        <div className={styles.column} ref={setNodeRef}>
            <h2 className={styles.columnTitle}>{title}</h2>
            {tasksLoading ? (
                <div>Loading tasks...</div>
            ) : (
                <div className={styles.taskList}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} columnId={columnId}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KanbanBoard;
