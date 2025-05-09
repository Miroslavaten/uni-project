import { FC } from 'react';
import styles from './TaskModal.module.scss';

const TaskModal: FC = () => {
  return (
    <div>
      <p>Task Id: </p>

      <div>
        <div className={styles.taskInfo}>
          <h2>Task name</h2>
          <h3>Description</h3>
          <textarea
            placeholder="Add a description"
            // value={description}
            // onChange={(e) => setDescription(e.target.value)}
          />
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
