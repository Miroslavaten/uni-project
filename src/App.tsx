import './styles/styles.scss';
import {KanbanBoard} from "./components/KanbanBoard.tsx";

function App() {
  console.log('tytyui');

  return (
    <div className="container">
      {/*<TodoList />*/}
      <KanbanBoard />
    </div>
  );
}

export default App;
