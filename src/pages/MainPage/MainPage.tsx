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
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque ut
          tempora, provident laudantium iusto, esse cumque numquam quia nostrum
          dolores enim quo sapiente doloremque totam minus quos, quis
          consequatur distinctio! Magnam debitis minus atque nisi fugiat tempora
          quidem modi repellat dignissimos maiores velit, distinctio, voluptates
          nobis quia cum consequatur corporis. Provident fugiat doloribus
          laudantium soluta tempora necessitatibus repellendus perspiciatis aut!
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
};

export default MainPage;
