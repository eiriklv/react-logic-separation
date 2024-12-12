import { TimerFeature } from "./features/Timer"
import { TodosFeature } from "./features/Todos"

function App() {
  return (
    <>
      <h1>Root</h1>
      <TodosFeature />
      <TimerFeature />
    </>
  )
}

export default App
