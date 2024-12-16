import { TimerFeature } from "./features/Timer"
import { TodosFeature } from "./features/Todos"
import "./App.css";

function App() {
  return (
    <>
      <TodosFeature />
      <TimerFeature />
    </>
  )
}

export default App
