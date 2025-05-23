import React, { FC, useRef } from "react";
import { PRIORITIES, Task } from "../../../../types/TaskTypes.ts";
import { useDraggable } from "@dnd-kit/core";
import styles from "./taskCard.module.scss";

export const TaskCard: FC<{
  task: Task;
  columnId: string;
  onClick: () => void;
  isDragging: boolean;
}> = ({ task, columnId, onClick, isDragging }) => {
  const { id, title, description, author } = task;

  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id,
    data: { columnId, task },
  });

  const mouseDownTime = useRef<number>(0);

  const handleMouseDown = () => {
    mouseDownTime.current = Date.now();
  };

  const handleMouseUp = () => {
    const duration = Date.now() - mouseDownTime.current;
    if (duration < 200) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        cursor: "grab",
        // position: transform ? 'fixed' : 'relative', //! fixed — держим под курсором (нифига он не держит)
        zIndex: transform ? 1000 : "auto",
        width: transform ? "275px" : "auto", // сохранить размер карточки
        opacity: isDragging ? 0.5 : 1,
      }}
      className={styles.card}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div
          className={styles.statusDot}
          style={{ backgroundColor: PRIORITIES[task.priority] }}
        />
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.author}>{author}</div>
    </div>
  );
};
