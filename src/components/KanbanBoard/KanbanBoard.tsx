import React, { FC, useRef, useState } from "react";
import { useColumns } from "../../hooks/useColumns.ts";
import { useTasks } from "../../hooks/useTasks.ts";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { KanbanColumnPropsWithRegister } from "../../types/KanbanTypes.ts";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.ts";
import styles from "./kanban.module.scss";
import AddIcon from "../../assets/addIcon.svg";
import { TaskCard } from "./TaskCard/TaskCard.tsx";
import { Task } from "../../types/TaskTypes.ts";
import TaskModal from "../TaskModal/TaskModal.tsx";

export const KanbanBoard: FC = () => {
  const { columns, loading: columnsLoading } = useColumns();
  const columnsRefs = useRef<Record<string, () => void>>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (columnsLoading) {
    return <div>Loading columns...</div>;
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newColumnId = over.id as string;

      if (active.data.current?.columnId !== newColumnId) {
        try {
          const taskRef = doc(db, "tasks", taskId);
          await updateDoc(taskRef, {
            columnId: doc(db, "columns", newColumnId),
          });
          Object.values(columnsRefs.current).forEach((refetch) => refetch());
        } catch (error) {
          console.error("Failed to move task:", error);
        }
      }
    }
  };

  const handleTaskUpdated = () => {
    if (selectedTask) {
      const columnId = selectedTask.columnId.id; // Firestore reference
      const refetch = columnsRefs.current[columnId];
      if (refetch) refetch();
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.board}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            registerRefetch={(refetch) => {
              columnsRefs.current[column.id] = refetch;
            }}
            onTaskClick={setSelectedTask}
          />
        ))}
      </div>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdated={handleTaskUpdated}
        />
      )}
    </DndContext>
  );
};

const KanbanColumn: FC<KanbanColumnPropsWithRegister> = ({
  columnId,
  title,
  registerRefetch,
  onTaskClick,
}) => {
  const { tasks, loading: tasksLoading, refetch } = useTasks(columnId);
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  // Регистрируем refetch в родительском компоненте
  React.useEffect(() => {
    registerRefetch(refetch);
  }, [refetch, registerRefetch]);

  return (
    <div className={styles.column} ref={setNodeRef}>
      <div className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>{title}</h2>
        <div>
          <img src={AddIcon} alt="add icon" className={styles.addIcon} />
        </div>
      </div>
      {tasksLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <div className={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={columnId}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
