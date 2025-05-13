import { useCallback, useState } from "react";
import { useActionsViewModel } from "./Actions.view-model";

export type ActionsDependencies = {
  useActionsViewModel: typeof useActionsViewModel;
};

type Props = {
  dependencies?: ActionsDependencies;
};

export function Actions({ dependencies = { useActionsViewModel } }: Props) {
  // Get dependencies
  const { useActionsViewModel } = dependencies;

  // Use view model
  const { addTask, users = [] } = useActionsViewModel();

  // Local view state
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

  const userOptions = [
    <option key={"no-selection"} disabled value={""}>
      Select a user
    </option>,
    ...users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    )),
  ];

  return (
    <div>
      <h3>Actions</h3>
      <div>
        <label>
          Add task
          <input type="text" value={taskText} onChange={handleChangeTaskText} />
        </label>
        <label>
          User:
          <select value={selectedUserId} onChange={handleChangeUser}>
            {userOptions}
          </select>
        </label>
        <button onClick={handleSubmitTask}>+</button>
      </div>
    </div>
  );
}
