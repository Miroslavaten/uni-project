import React, { FC, useRef, useState } from "react";
import { useColumns } from "../../hooks/useColumns.ts";
import { useTasks } from "../../hooks/useTasks.ts";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { KanbanColumnPropsWithRegister } from "../../types/KanbanTypes.ts";
import { doc, DocumentReference, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.ts";
import styles from "./kanban.module.scss";
import AddIcon from "../../assets/addIcon.svg";
import { TaskCard } from "./TaskCards/TaskCard/TaskCard.tsx";
import { Task } from "../../types/TaskTypes.ts";
import TaskModal from "./TaskDetailsModal/TaskDetailsModal.tsx";
import { CreateTaskModal } from "./TaskCards/CreateTaskCard/CreateTaskCard.tsx";
import { useAuth } from "../../hooks/useAuth.ts";

export const KanbanBoard: FC = () => {
  const { columns, loading: columnsLoading } = useColumns();
  const columnsRefs = useRef<Record<string, () => void>>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  if (columnsLoading) {
    return <div>Loading columns...</div>;
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
    const task = active.data.current?.task as Task;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveTaskId(null);

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newColumnId = over.id as string;

      if (active.data.current?.columnId !== newColumnId) {
        try {
          const taskRef = doc(db, "tasks", taskId) as DocumentReference;
          const columnRef = doc(
            db,
            "columns",
            newColumnId,
          ) as DocumentReference;
          await updateDoc(taskRef, "columnId", columnRef);
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
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
            activeTaskId={activeTaskId}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            columnId={activeTask.columnId.id}
            onClick={() => {}}
            isDragging={false}
          />
        ) : null}
      </DragOverlay>
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
  activeTaskId,
}) => {
  const { tasks, loading: tasksLoading, refetch } = useTasks(columnId);
  const { setNodeRef } = useDroppable({
    id: columnId,
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { user } = useAuth();

  // Регистрируем refetch в родительском компоненте
  React.useEffect(() => {
    registerRefetch(refetch);
  }, [refetch, registerRefetch]);

  return (
    <div className={styles.column} ref={setNodeRef}>
      <div className={styles.columnHeader}>
        <h2 className={styles.columnTitle}>{title}</h2>
        <div>
          <img
            src={AddIcon as string}
            alt="add icon"
            className={styles.addIcon}
            onClick={() => setIsCreating(true)}
          />
        </div>
      </div>
      {isCreating && (
        <CreateTaskModal
          columnRef={doc(db, "columns", columnId)}
          author={user?.email || ""}
          onClose={() => setIsCreating(false)}
          onCreated={refetch}
        />
      )}
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
              isDragging={task.id === activeTaskId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
