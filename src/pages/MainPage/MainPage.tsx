import { FC } from 'react';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import styles from './mainPage.module.scss';
import TaskModal from '../../components/TaskModal/TaskModal';

const MainPage: FC = () => {
  return (
    <div>
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
      <TaskModal />
    </div>
  );
};

export default MainPage;
