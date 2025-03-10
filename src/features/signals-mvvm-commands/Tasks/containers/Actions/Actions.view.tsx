import { useCallback, useContext, useState } from "react";
import { ActionsContext } from "./Actions.view.context";

export function Actions() {
  // Get dependencies
  const { useActionsViewModel } = useContext(ActionsContext);

  // Use view model
  const { addTask, users = [] } = useActionsViewModel();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [taskText, setTaskText] = useState("");

  const handleChangeUser = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedUserId(event.target.value);
    },
    [],
  );

  const handleChangeTaskText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTaskText(event.target.value);
    },
    [],
  );

  const handleSubmitTask = useCallback(() => {
    addTask(taskText, selectedUserId);
    setTaskText("");
  }, [addTask, selectedUserId, taskText]);

  const userOptions = users.map((user) => (
    <option selected={selectedUserId === user.id} key={user.id}>
      {user.name}
    </option>
  ));

  return (
    <div>
      <h3>Actions</h3>
      <div>
        <label>
          Add task
          <input type="text" value={taskText} onChange={handleChangeTaskText} />
        </label>
        <label>
          Owner:
          <select onChange={handleChangeUser}>{userOptions}</select>
        </label>
        <button onClick={handleSubmitTask}>+</button>
      </div>
    </div>
  );
}
