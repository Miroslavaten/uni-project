import React, { FC } from 'react';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import styles from './mainPage.module.scss';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import { useAuth } from '../../hooks/useAuth.ts';

const MainPage: FC = () => {
  const { user } = useAuth();
  return (
    <div>
      <div className={styles.header}>
        <p className={styles.userName}>
          {user ? user.email : 'not authorized'}
        </p>
        <button onClick={() => signOut(auth)} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
      <div>
        <h1 className={styles.title}>ToDo List</h1>
        <p className={styles.description}>
          A shared Kanban board for teams and individuals to organize tasks,
          track progress, and collaborate in real time.
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
};

export default MainPage;
