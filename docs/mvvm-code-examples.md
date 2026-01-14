# Code examples / stepwise non-MVC -> MVC -> MVVM

#### Code Example (version 1 - explicit controller view):

In this example we're using an explicit controller component, view component and hooks to represent the domain models.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
  id: string;
  text: string;
  status: STATUS;
}

/**
 * Models
 */
const useTasksModel = (): {
  tasks: Task[];
  addTask: (text: string) => void;
  isLoading: boolean;
} => {
  // ...
}

const useStatusFilterModel = (): {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void
} => {
  // ...
}

/**
 * Controller (has a reference to the view and model)
 */
const TasksController = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksModel();

  const {
    statusFilter,
  } = useStatusFilterModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

  const filteredTasks = tasks.filter((task) => task.status === statusFilter);

  return (
    <TasksView
      tasks={filteredTasks}
      isLoading={isLoading}
      onChangeTaskText={handleChangeTaskText}
      onSubmitTask={handleSubmitTask}
      taskText={taskText}
    />
  );
}

/**
 * View
 */
const TasksView = ({
  tasks,
  isLoading,
  onChangeTaskText,
  onSubmitTask,
  taskText
}) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
      <input type="text" value={taskText} onChange={onChangeTaskText} />
      <button type="submit" onClick={onSubmitTask}>
    </div>
  );
}
```

#### Code Example (version 2 - controller, view and separate controller logic hook):

To make things a bit cleaner we can factor out the controller logic of the controller view into a separate controller logic hook. This makes it easier to see that it is the controller logic that owns the reference to the domain models.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
  id: string;
  text: string;
  status: STATUS;
}

/**
 * Models
 */
const useTasksModel = (): {
  tasks: Task[];
  addTask: (text: string) => void;
  isLoading: boolean;
} => {
  // ...
}

const useStatusFilterModel = (): {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void
} => {
  // ...
}

/**
 * Controller logic hook (has a reference to the model)
 */
const useTasksController = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksModel();

  const {
    statusFilter
  } = useStatusFilterModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

  const filteredTasks = tasks.filter((task) => task.status === statusFilter);

  return {
    tasks: filteredTasks,
    isLoading,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
  }
}

/**
 * Controller (has a reference to the view and controller logic hook)
 */
const TasksController = () => {
  const {
    tasks,
    isLoading,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
  } = useTasksController();

  return (
    <TasksView
      tasks={tasks}
      isLoading={isLoading}
      onChangeTaskText={handleChangeTaskText}
      onSubmitTask={handleSubmitTask}
      taskText={taskText}
    />
  );
}

/**
 * View
 */
const TasksView = ({
  tasks,
  isLoading,
  onChangeTaskText,
  onSubmitTask,
  taskText
}) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
      <input type="text" value={taskText} onChange={onChangeTaskText} />
      <button type="submit" onClick={onSubmitTask}>
    </div>
  );
}
```

#### Code Example (version 3 - "controller-view" with separate controller logic hook):

From the previous example we see that the `<TasksController>` no longer provides any value - it is simply a relay / wrapper that maps the output from the controller logic hook into the controller component. Let effectively merge the `<TasksView>` and `<TasksController>` component into one "controller-view" instead, keeping the `<TasksView>` name.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
  id: string;
  text: string;
  status: STATUS;
}

/**
 * Models
 */
const useTasksModel = (): {
  tasks: Task[];
  addTask: (text: string) => void;
  isLoading: boolean;
} => {
  // ...
}

const useStatusFilterModel = (): {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void
} => {
  // ...
}

/**
 * Controller logic hook (has a reference to the model)
 */
const useTasksController = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksModel();

  const {
    statusFilter
  } = useStatusFilterModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

  const filteredTasks = tasks.filter((task) => task.status === statusFilter);

  return {
    tasks: filteredTasks,
    isLoading,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
  }
}

/**
 * Controller-View (has a reference to the controller logic hook - we have in practice merged the controller and the view)
 */
const TasksView = () => {
  const {
    tasks,
    isLoading,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
  } = useTasksController();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
      <input type="text" value={taskText} onChange={onChangeTaskText} />
      <button type="submit" onClick={onSubmitTask}>
    </div>
  );
}
```

#### Code Example (version 4 - "controller-view" with embedded controller logic):

One of the advantages of React is that we don't actually have to discern between the controller and the view, so if we want we can also merge the controller logic hook and the controller-view, leaving us with less parts to connect together. This becomes a tradeoff between less parts and of it no longer being as clear which parts of the "controller-view" component are controller logic and which parts are pure view-logic (like mapping the data into renderable elements).

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
  id: string;
  text: string;
  status: STATUS;
}

/**
 * Models
 */
const useTasksModel = (): {
  tasks: Task[];
  addTask: (text: string) => void;
  isLoading: boolean;
} => {
  // ...
}

const useStatusFilterModel = (): {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void
} => {
  // ...
}

/**
 * Controller/View (has a reference to the model)
 */
const TasksView = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksModel();

  const {
    statusFilter
  } = useStatusFilterModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  /**
   * TODO(eiriklv):
   *
   * Make the structure recognizable and explain why it the
   * filtering should ideally be done in the view model
   * and not in the view or controller
   */
  const filteredTasks = tasks.filter((task) => task.status === statusFilter);

  const taskItems = filteredTasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
      <input type="text" value={taskText} onChange={onChangeTaskText} />
      <button type="submit" onClick={onSubmitTask}>
    </div>
  );
}
```

#### Code Example (version 1 - "controller-view" with separate controller logic hook and separate view model hook):

Anything that is related to the domain models is factored out to a view model hook. The distinction between domain logic and controller/view logic matters. It's important that only domain related things are factored out and not to include anything that is related to controller logic - that is view specific and does not belong in the view model. Doing so will only give you headache and trouble down the road, as it mixes together two different layers and very different concerns.

TODO(eiriklv): Add more explanation and potentially additional examples.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
  id: string;
  text: string;
  status: STATUS;
}

/**
 * Models
 */
const useTasksModel = (): {
  tasks: Task[];
  addTask: (text: string) => void;
  isLoading: boolean;
} => {
  // ...
}

const useStatusFilterModel = (): {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void
} => {
  // ...
}

/**
 * View Model (has references to the domain models)
 */
const useTasksViewModel = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksModel();

  const {
    statusFilter,
  } = useStatusFilterModel();

  const filteredTasks = tasks.filter((task) => task.status === statusFilter);

  /**
   * TODO(eiriklv): Add separate commands instead of mapping directly from the domain models,
   * and show that this is where you would do validation, etc.
   *
   * The main point is to make the domains as easy as possible to use for
   * the consuming view and that it should be insulated from changes in the domain
   * by terminating it in the view model, not the view itself.
   */

  return {
    tasks: filteredTasks,
    addTask,
    isLoading,
  }
}

/**
 * Controller logic hook (has a reference to the view model)
 */
const useTasksController = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksViewModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

  return {
    tasks,
    isLoading,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
  }
}

/**
 * Controller-View (has a reference to the controller logic hook)
 */
const TasksView = () => {
  const {
    tasks,
    isLoading,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
  } = useTasksController();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
      <input type="text" value={taskText} onChange={onChangeTaskText} />
      <button type="submit" onClick={onSubmitTask}>
    </div>
  );
}
```

#### Code Example (version 2 - "controller-view" with embedded controller logic and separate view model hook):

We do the exact same thing here; factor out anything related to the domain models into a separate view model hook.

TODO(eiriklv): Add more explanation and potentially additional examples.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
  id: string;
  text: string;
  status: STATUS;
}

/**
 * Models
 */
const useTasksModel = (): {
  tasks: Task[];
  addTask: (text: string) => void;
  isLoading: boolean;
} => {
  // ...
}

const useStatusFilterModel = (): {
  statusFilter: Status;
  setStatusFilter: (status: Status) => void
} => {
  // ...
}

/**
 * View Model (has references to the domain models)
 */
const useTasksViewModel = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksModel();

  const {
    statusFilter,
  } = useStatusFilterModel();

  const filteredTasks = tasks.filter((task) => task.status === statusFilter);

  /**
   * TODO(eiriklv): Add separate commands instead of mapping directly from the domain models,
   * and show that this is where you would do validation, etc.
   *
   * The main point is to make the domains as easy as possible to use for
   * the consuming view and that it should be insulated from changes in the domain
   * by terminating it in the view model, not the view itself.
   */

  return {
    tasks: filteredTasks,
    addTask,
    isLoading,
  }
}

/**
 * Controller/View (has a reference to the model)
 */
const TasksView = () => {
  const {
    tasks,
    addTask,
    isLoading,
  } = useTasksViewModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
      <input type="text" value={taskText} onChange={handleChangeTaskText} />
      <button type="submit" onClick={handleSubmitTask}>
    </div>
  );
}
```
