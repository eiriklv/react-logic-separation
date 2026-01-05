# MVVM (Model-View-ViewModel) Pattern in React

- [What](#what)
  - [MVVM Architectural Pattern](#enterprise-architecture-pattern)
  - [MVVM vs. MVC](#mvvm-vs-mvc)
  - [References](#references)
- [Why](#why)
  - [Testability](#testability)
  - [Maintainability](#maintainability)
  - [Scalability](#scalability)
  - [Collaboration](#collaboration)
- [How](#how)
  - [Pattern](#pattern)
    - [Naming conventions and folder structure](#naming-conventions-and-folder-structure)
    - [Separating business logic from the view](#separating-business-logic-from-the-view)
    - [ViewController vs. ViewModel](#viewcontroller-vs-viewmodel)
  - [Incremental Adoption](#incremental-adoption)
    - [Factor out to view model hooks](#factor-out-to-view-model-hooks)
    - [Factor out to shared domain model hooks](#factor-out-to-shared-domain-model-hooks)
  - [Other Considerations](#other-considerations)
    - [Sharing view models](#sharing-view-models)
- [Tradeoffs](#tradeoffs)

# What

This document covers the following:

- The MVVM architectural pattern
- A proposed implementation of the pattern in the context of TypeScript and React
- A proposed approach for incrementally adopting the pattern in our codebase

It does not cover:

- Using signals and plain classes for further de-coupling of business logic and React (future document/proposal)

## MVVM Architectural Pattern

Model–view–viewmodel (MVVM) is an architectural pattern that facilitates the separation of the development of a user interface (the view) from the development of the business logic (the model) such that the view is not dependent upon any specific model platform.

### Components of MVVM

**Model:**

Refers to the domain model and represents the business domain being modeled, containing things like business logic, rules, repositories, services, etc. Same as the "Model" in "Model-View-Controller".

**View:**

Represents the structure, layout, and appearance of what a user sees on the screen. Displays a representation of the domain model and receives the user's interaction with the view, which is forwarded to the domain model through the view controller. Same as the "View" in "Model-View-Controller".

**View model:**

The view model is an abstraction of the view exposing public properties and commands. This view model is consumed by the view, where it can display the properties and call the commands. The view model has no reference to the view, but the view model is owned by and referenced by the view.

## MVVM vs. MVC

The biggest difference between MVVM and MVC is that MVVM introduces a layer between the view controller (or view) and the model. This enables you to further decouple the development of the business logic and the user interface.

The same feature in both an MVC and an MVVM application could be structured in the following way:

### MVC

![MVC](../assets/mvc.png)

View:

- Displays properties passed to it
- Triggers commands passed to it on user interaction

Controller:

- Has a reference to the view
- Is responsible for rendering the view
- Has references to one or more models
- Is responsible for mapping properties and commands from those models into something that can be passed to and consumed by the view

Model:

- Contains the domain/business logic
- Exposes properties and commands that can be consumed

#### Code Example (alternative 1 - explicit controller view):

In this example we're using an explicit controller component, view component and a hook to represent the domain model.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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

#### Code Example (alternative 2 - controller factored out to hook):

In this example we've factored out the controller logic of the controller view into a separate hook. This makes it easier to see that it is the controller logic that owns the reference to the domain model.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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
 * Controller hook (has a reference to the model)
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
 * Controller (has a reference to the view and controller hook)
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

#### Code Example (alternative 3 - controller view/hook):

In this example we taken it a step further and

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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
 * Controller hook (has a reference to the model)
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
 * View (has a reference to the controller hook - we have in practice merged the controller and the view)
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

Code Example (alternative 4 - embedded controller/view):

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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
 * View/Controller (has a reference to the model)
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

### MVVM

![MVVM](../assets/mvvm.png)

View:

- Displays properties passed to it
- Triggers commands passed to it on user interaction

Controller:

- Has a reference to the view
- Is responsible for rendering the view
- _\*Has a reference to the view model_
- _\*Is responsible for forwarding the view model properties and commands into the view_

View model:

- Has references to one or more models
- Is responsible for mapping properties and commands from those models into something consumed by the view controller

Model:

- Contains the domain/business logic
- Exposes properties and commands that can be consumed

#### Code Example (alternative 1 - explicit controller view):

In this example we're using an explicit controller component, view component and a hook to represent the domain model.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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

  return {
    tasks: filteredTasks,
    addTask,
    isLoading,
  }
}

/**
 * Controller (has a reference to the view model)
 */
const TasksController = () => {
  const {
    tasks,
    addTask,
    isLoading
  } = useTasksViewModel();

  const [taskText, setTaskText] = useState('');

  const handleChangeTaskText = (event) => {
    setTaskText(event.target.value);
  }

  const handleSubmitTask = () => {
    addTask(taskText);
    setTaskText('');
  }

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

#### Code Example (alternative 2 - controller factored out to hook):

In this example we've factored out the controller logic of the controller view into a separate hook. This makes it easier to see that it is the controller logic that owns the reference to the domain model.

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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

  return {
    tasks: filteredTasks,
    addTask,
    isLoading,
  }
}

/**
 * Controller hook (has a reference to the view model)
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
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
    isLoading,
  }
}

/**
 * Controller (has a reference to the view and controller hook)
 */
const TasksController = () => {
  const {
    tasks,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
    isLoading,
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

#### Code Example (alternative 3 - controller view/hook):

In this example we taken it a step further and

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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

  return {
    tasks: filteredTasks,
    addTask,
    isLoading,
  }
}

/**
 * Controller hook (has a reference to the view model)
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
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
    isLoading,
  }
}

/**
 * View (has a reference to the controller hook - we have in practice merged the controller and the view)
 */
const TasksView = () => {
  const {
    tasks,
    taskText,
    handleChangeTaskText,
    handleSubmitTask,
    isLoading,
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

Code Example (alternative 4 - embedded controller/view):

```tsx
/**
 * Domain types
 */
type Status = 'TODO' | 'IN_PROGRESS' : 'DONE';

type Task = {
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

  return {
    tasks: filteredTasks,
    addTask,
    isLoading,
  }
}

/**
 * View/Controller (has a reference to the view model)
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

## References

- https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel
- https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm
- https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/patterns-wpf-apps-with-the-model-view-viewmodel-design-pattern
- https://learn.microsoft.com/en-us/previous-versions/xamarin/xamarin-forms/enterprise-application-patterns/mvvm

# Why

The main reason for introducing a pattern like MVVM is to enable better separation of concerns, making it possible to work much more independently in each layer of the application. By only having to agree on the interfaces between the layers it means that it to a much larger degree than before is possible to develop the layers separately and in parallel. This is mainly achieved by the view model, which acts as a mapping layer between the view layer and the business logic layer.

## Testability

Every layer can be tested separately (model, view, view model)

- Test the view independently of the business logic layer, only having to care about the interface of the view model
  - Simpler tests, because of less concerns
  - Tests are unaffected by changes in the view model layer and below, as long as the interface of the view model stays the same
- Test the view model independent of the view
  - Test the view logic without the actual view
- Test business logic independently of the view layer (view/view controller/view model)
  - Simpler tests, because of less concerns
  - Tests are unaffected by changes to the view layer, as it has no knowledge of it

Advantages:

- Opportunity for less brittle tests that break only for useful reasons

Code Examples:

```ts
// TODO (examples for testing each layer; view, view model, model)
```

## Maintainability

Because of the clear separation of the layers and the introduction of interfaces between them it should ideally increase the maintainability of the application. Each part can be approached separately, both in terms of application code and tests. Each layer can be changed/replaced independently without affecting the other layers. Only interface changes needs coordination between the layers.

Examples:

- Changing the view (how things are displayed and interacted with)
  - No changes to the view model and below, only the view/view controller
- Changing the business logic (how things work underneath)
  - Changes in the model layer
  - Changes in the view model layer
- Changes that require interface changes
  - New requirement in UX that triggers an interface change in the view model, which then propagates down to the model layer

Code Examples:

```ts
// TODO (one example for each)
```

## Scalability

Because of the clear separation of concerns when using MVVM it means that your business logic complexity does not affect your view logic complexity, and vice versa, ensuring better scalability of the application.

Example:

- Adding another view on top of existing business logic
  - New view with new view model interface
  - New view model with new implementation (different mappings of existing business logic)

Code Examples:

```ts
// TODO (one example for each)
```

## Collaboration

Since MVVM creates a much clearer separation between the view layer and business logic layer it increases the possibility to work in parallel. Agreeing on the interface returned by the view models is sufficient for working on both the view and the business logic in parallel. The views can be tested with mocked out view models following the interface, while the view model and business logic underneath can be tested separately according to agreed upon interface/contract.

Code Example:

```ts
// TODO
```

# How

TODO

## Pattern

TODO

### Naming conventions and folder structure

TODO

### Separating business logic from the view

TODO

### ViewController vs. ViewModel

TODO

## Incremental Adoption

TODO

### Factor out to view model hooks

TODO

### Factor out to shared domain model hooks

TODO

# Tradeoffs

TODO
