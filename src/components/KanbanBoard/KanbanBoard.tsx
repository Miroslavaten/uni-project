import React, { FC, useRef } from 'react';
import { useColumns } from '../../hooks/useColumns.ts';
import { useTasks } from '../../hooks/useTasks.ts';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { KanbanColumnPropsWithRegister } from '../../types/KanbanTypes.ts';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import styles from './kanban.module.scss';
import AddIcon from '../../assets/addIcon.svg';
import { TaskCard } from './TaskCard/TaskCard.tsx';

export const KanbanBoard: FC = () => {
  const { columns, loading: columnsLoading } = useColumns();
  const columnsRefs = useRef<Record<string, () => void>>({});

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
          const taskRef = doc(db, 'tasks', taskId);
          await updateDoc(taskRef, {
            columnId: doc(db, 'columns', newColumnId),
          });
          Object.values(columnsRefs.current).forEach((refetch) => refetch());
        } catch (error) {
          console.error('Failed to move task:', error);
        }
      }
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
          />
        ))}
      </div>
    </DndContext>
  );
};

const KanbanColumn: FC<KanbanColumnPropsWithRegister> = ({
  columnId,
  title,
  registerRefetch,
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
            <TaskCard key={task.id} task={task} columnId={columnId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
