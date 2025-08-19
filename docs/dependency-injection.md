# Dependency Injection in React

- [What](#what)
- [Why](#why)
  - [Challenges with module mocking](#challenges-with-module-mocking)
    - [Poor type safety by default](#poor-type-safety-by-default)
    - [Brittle tests](#brittle-tests)
    - [Implicitness and boundaries](#implicitness-and-boundaries)
- [How](#how)
  - [Proposed option 1](#proposed-option-1)
  - [Proposed option 2](#proposed-option-2)
- [Tradeoffs ](#tradeoffs)
  - [DI vs. non-DI](#di-vs-non-di)
  - [Option 1](#option-1)
  - [Option 2](#option-2)

## What

This document addresses:

- Dependency injection approaches in TypeScript/React
- Testing when using dependency injection

It does not cover:

- Collect-time optimization for tests (future proposal)
- MVVM architectural pattern (future proposal)
- Using signals for business logic (future proposal)

## Why

The motivation for proposing this is anchored in the «Enterprise scale» initiative which aims for:

- More reliability
- Less incidents
- Higher quality

This contents of the proposal itself is mainly motivated by the [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle), which boils down to:

- Instead of a higher level module depending directly on the implementation of a lower level module it instead depends on an interface, expecting a matching implementation to be injected whenever it's being used

Okay, sure - but which problems are we actually solving with this?

**What it solves or improves:**

- [Challenges with module mocking](#challenges-with-module-mocking)
  - [Poor type safety by default](#poor-type-safety-by-default)
  - [Brittle tests](#brittle-test)
  - [Implicitness and boundaries](#implicitness-and-boundaries)

## Challenges with module mocking

There are a couple of non-trivial problems when using path-based module mocking like `vi.mock`

### Poor type safety by default

#### Example using `vi.mock`

When module mocking using `vi.mock` you will by default not get any help from the type system to ensure that your mock is adhereing to the interface of the module being mocked.

When using `vi.mock`, make sure to follow the [recommended guidelines](https://docs.infra.cogheim.net/developer-portal/guides/applications/testing-practices/#mocking-modules) for ensuring type safety.

```tsx
// Tasks.tsx

/**
 * Which of these needs to be mocked during testing?
 */
import React from "react";
import { useTasks } from "../services/use-tasks"; // Impure hook
import { TaskItem } from "../components/TaskItem"; // Pure component

export const Tasks: React.FC = () => {
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

```tsx
// Tasks.spec.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

/**
 * Alternative 1:
 *
 * Everything here is completely untyped by default,
 * so we get no help filling the mocked values correctly.
 *
 * We can use `originalImport` to get the actual module,
 * and with that get typing from the mocked dependency,
 * but that would still only work if that's actually
 * the dependency being used by the module, which
 * cannot be enforced. That also removes any possiblity
 * of being able to remove the default dependency
 * from the module graph (collect-time)
 */
vi.mock("../services/use-tasks", () => ({
  useTasks: vi.fn(() => ({
    isLoading: false,
    tasks: [
      {
        id: "task-1",
        text: "Dummy task 1",
      },
      {
        id: "task-2",
        text: "Dummy task 2",
      },
    ],
  })),
}));

/**
 * Alternative 2:
 *
 * This is a better alternative, as it provides typing for the
 * mocked module, but it still doesn't ensure that this is
 * actually a module used by the unit under test
 */
vi.mock(import("../services/use-tasks"), () => ({
  useTasks: vi.fn(() => ({
    isLoading: false,
    tasks: [
      {
        id: "task-1",
        text: "Dummy task 1",
      },
      {
        id: "task-2",
        text: "Dummy task 2",
      },
    ],
  })),
}));

describe("Tasks", () => {
  it("should display all loaded tasks", async () => {
    // arrange
    render(<Tasks />);

    // act
    await screen.findByText("Tasks");

    // assert
    expect(screen.getByText(/Dummy task 1/)).toBeInDocument();
    expect(screen.getByText(/Dummy task 2/)).toBeInDocument();
  });
});
```

#### Example using dependency injection

When using dependency injection the dependencies are explicitly defined as part of the public interface of the unit - this ensures that typing is enforced during testing.

```tsx
// Tasks.tsx

import React from "react";
import type { Task } from "../types";
import { useTasks as useTasksImpl } from "../services/use-tasks";
import { TaskItem } from "../components/TaskItem";

/**
 * Alternative 1:
 *
 * We can choose to depend directly on the type
 * of the implementation(s) we want to depend on.
 *
 * The advantage of this approach is that we don't
 * have to declare a separate type for the interface
 * we want to depend on. The drawback is that we're
 * creating coupling to the implementation itself.
 */
type Deps = {
  useTasks: typeof useTasksImpl;
};

/**
 * Alternative 2:
 *
 * We can also choose to instead declare a
 * specific interface we want to depend on,
 * where the implementation injected would
 * need to conform to this interface
 *
 * The advantage of this approach is that we
 * aren't creating any coupling to the implementation
 * itself, which means that changing the implementation
 * wouldn't affect the interface of the unit itself.
 * The drawback is we have to declare separate
 * interfaces for the dependencies.
 */
type Deps = {
  useTasks: () => { isLoading: boolean; tasks: Task[] };
};

type Props = {
  deps?: Deps;
};

export const Tasks: React.FC<Props> = ({
  deps = {
    useTasks: useTasksImpl,
  },
}) => {
  const { useTasks } = deps;
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

```tsx
// Tasks.spec.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Tasks", () => {
  it("should display all loaded tasks", async () => {
    /**
     * This is now typed through the component definition itself.
     *
     * The only reason for explicitly referring to the component
     * type is to be able to have it defined in a separate variable,
     * instead of defining it directly when passing the prop.
     *
     * In that case we would not need to refer to any types at all.
     */
    const deps: ComponentProps<typeof Tasks>["deps"] = {
      useTasks: vi.fn(() => ({
        isLoading: false,
        tasks: [
          {
            id: "task-1",
            text: "Dummy task 1",
          },
          {
            id: "task-2",
            text: "Dummy task 2",
          },
        ],
      })),
    };

    // arrange
    render(<Tasks deps={deps} />);

    // act
    await screen.findByText("Tasks");

    // assert
    expect(screen.getByText(/Dummy task 1/)).toBeInDocument();
    expect(screen.getByText(/Dummy task 2/)).toBeInDocument();
  });
});
```

### Brittle tests

#### Example using `vi.mock`

When module mocking using `vi.mock` you are doing so by referring to the path of the module that you want to mock. This has to manually be matched with the actual module being imported in the unit you're testing.

This means that your test will fail if you do things like:

- Rename a file containing a dependency
- Replace an imported library dependency with a different interface equivalent library

The unit continues to function as expected, but the module mocking in your test no longer has the intended effect, either causing non-useful failures or false positives (which are even worse).

```tsx
// Tasks.tsx

import React from "react";
import { useTasks } from "../new-location/use-tasks";
import { TaskItem } from "../components/TaskItem";

export const Tasks: React.FC = () => {
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

```tsx
// Tasks.spec.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

/**
 * This is still completely valid, since the module mocking
 * isn't tied to the module it's testing, just the mocked module
 * itself.
 *
 * The issue is that it no longer works the way we expect within the test,
 * because this dependency/path is no longer being used in the module under test.
 * This means that the real unmocked module is being used during testing.
 *
 * Similarly - if we made changes to the useTasks dependency,
 * those changes would be enforced by typing in the module itself,
 * while there would be nothing in the test telling you that something
 * is wrong - except for the test failing for non-obvious reasons
 */
vi.mock(import("../services/use-tasks"), () => ({
  useTasks: vi.fn(() => ({
    isLoading: false,
    tasks: [
      {
        id: "task-1",
        text: "Dummy task 1",
      },
      {
        id: "task-2",
        text: "Dummy task 2",
      },
    ],
  })),
}));

describe("Tasks", () => {
  it("should display all loaded tasks", async () => {
    // arrange
    render(<Tasks />);

    // act
    await screen.findByText("Tasks");

    // assert
    expect(screen.getByText(/Dummy task 1/)).toBeInDocument();
    expect(screen.getByText(/Dummy task 2/)).toBeInDocument();
  });
});
```

#### Example using dependency injection

When using dependency injection the dependencies are explicitly defined as part of the public interface of the unit - this ensures that typing is enforced during testing. The test would not break and no change would have to be made to the test as long as the interface of the dependencies stay the same.

```tsx
// Tasks.tsx

import React from "react";
import type { Task } from "../types";
import { useTasks as useTasksImpl } from "../new-location/use-tasks";
import { TaskItem } from "../components/TaskItem";

type Deps = {
  useTasks: () => { isLoading: boolean; tasks: Task[] };
};

type Props = {
  deps?: Deps;
};

export const Tasks: React.FC<Props> = ({
  deps = {
    useTasks: useTasksImpl,
  },
}) => {
  const { useTasks } = deps;
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

```tsx
// Tasks.spec.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Tasks", () => {
  it("should display all loaded tasks", async () => {
    /**
     * This is just as valid as before if the path of the
     * underlying dependency changed, since we're not relying
     * on the path, but rather the interface of the component props.
     *
     * If the interface of the dependency changed, then we would
     * be alerted about there being a type issue, since what we
     * have in the current mock would no longer match the
     * interface of useTasks (or deps)
     */
    const deps: ComponentProps<typeof Tasks>["deps"] = {
      useTasks: vi.fn(() => ({
        isLoading: false,
        tasks: [
          {
            id: "task-1",
            text: "Dummy task 1",
          },
          {
            id: "task-2",
            text: "Dummy task 2",
          },
        ],
      })),
    };

    // arrange
    render(<Tasks deps={deps} />);

    // act
    await screen.findByText("Tasks");

    // assert
    expect(screen.getByText(/Dummy task 1/)).toBeInDocument();
    expect(screen.getByText(/Dummy task 2/)).toBeInDocument();
  });
});
```

### Implicitness and boundaries

It's not clear what needs to be mocked during testing. When using module mocking it’s not possible to know from looking at the module itself which imports should be mocked during an isolated unit test - it can only be inferred from the test itself, if one exists.

When using module mocking there is nothing directly encouraging you to create appropriate boundaries between your unit and what it depends on, as there is nothing stopping you from brute-forcing tests with `vi.mock`

```tsx
// Tasks.tsx

/**
 * Which of these would because of side-effect
 * or other reasons need to be mocked during testing...?
 */
import React from "react";
import { useTasks } from "../services/use-tasks"; // Impure hook
import { TaskItem } from "../components/TaskItem"; // Pure component

export const Tasks: React.FC = () => {
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

When using dependency injection you're encouraged to deal with these questions up front, as you have to decide which dependencies should be injected, and therefore have to be mocked during an isolated unit test.

```tsx
// Tasks.tsx

/**
 * When using dependency injection then none
 * of the modules will ever be mocked using
 * path module mocking, so for someone wanting
 * to test this module the decision has already
 * been made by the module author/editor about
 * what needs to be injected during testing
 *
 * If you aren't able to test it in isolation
 * with the current set of dependencies, then
 * that means you'll have to make changes to
 * the module, not brute-force it using vi.mock
 */
import React from "react";
import type { Task } from "../types";
import { useTasks as useTasksImpl } from "../services/use-tasks";
import { TaskItem } from "../components/TaskItem";

type Deps = {
  useTasks: () => { isLoading: boolean; tasks: Task[] };
};

type Props = {
  deps?: Deps;
};

export const Tasks: React.FC<Props> = ({
  deps = {
    useTasks: useTasksImpl,
  },
}) => {
  const { useTasks } = deps;
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

# How

Since there are multiple ways of implementing dependency injection in React, we're proposing two distinct approaches, both with their own set of tradeoffs.

NOTE: Both of the proposed options are valid alternatives.

## Proposed option 1:

One way of doing dependency injection in React is to utilize [React context](https://react.dev/learn/passing-data-deeply-with-context). This is already an established pattern, though not that common to use on the unit-level like we're proposing here.

Main points:

- Every unit that needs dependency injection (mainly non-pure components and hooks) owns a context for this specific purpose
- The context is only ever used for static dependencies (not dynamic values)
- The context is not shared with any other units, or used for other purposes
- Default values are provided for all the dependencies
- In most cases no provider is used/necessary in the application itself, but only during testing to provide an alternative implementation of dependencies

Typical file structure:

```
/features/my-component
  my-component.ts(x)
  my-component.context.ts
  my-component.spec.ts(x)
```

What each file contains:

- `my-component.ts(x)`
  - The module/unit itself (be it a component or a hook)
- `my-component.context.ts`
  - Contains the imports of default dependencies and the dependency interface for the module/unit
  - Contains the React context for the module/unit, which will contain the current dependencies
- `my-component.spec.ts(x)`
  - Unit test for the module/unit

### Example

```tsx
// Tasks.tsx

import React from "react";
import { useContext } from "react";
import { TaskItemsContext } from "./Tasks.context";
import { TaskItem } from "../components/TaskItem";

export const Tasks: React.FC = () => {
  const { useTasks } = useContext(TasksContext);
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

```tsx
// Tasks.context.tsx

import { createContext } from "react";
import type { Task } from "../types";
import { useTasks } from "./services/use-tasks";

/**
 * The context can be used to inject any kind of
 * dependency - most often hooks and components
 * that have side-effect or in other ways prevent
 * you from testing the unit in isolation
 *
 * The main purpose is to facilitate testing
 * and storybooking without having to use module mocking
 *
 * The other purpose is to completely avoid prop drilling,
 * which reduces the amount of indirection in components.
 *
 * The interfaces of the components also become much simpler.
 */

export interface TasksDeps {
  useTasks: () => { isLoading: boolean; tasks: Task[] };
}

const defaultDeps: TasksDeps = {
  useTasks,
};

export const TasksContext = createContext<TasksDeps>(defaultDeps);
```

```tsx
// Tasks.spec.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Tasks", () => {
  it("should display all loaded tasks", async () => {
    // arrange
    const deps: TasksDeps = {
      useTasks: vi.fn(() => ({
        isLoading: false,
        tasks: [
          {
            id: "task-1",
            text: "Dummy task 1",
          },
          {
            id: "task-2",
            text: "Dummy task 2",
          },
        ],
      })),
    };

    render(
      <TasksContext.Provider value={deps}>
        <Tasks />
      </TasksContext.Provider>,
    );

    // act
    await screen.findByText("Tasks");

    // assert
    expect(screen.getByText(/Dummy task 1/)).toBeInDocument();
    expect(screen.getByText(/Dummy task 2/)).toBeInDocument();
  });
});
```

## Proposed option 2:

Another way of doing dependency injection in React is to do it via function arguments combined with default values. This approach isn't restricted to React components and hooks as it could be used for any JavaScript function.

Main points:

- Every unit that needs dependency injection (mainly non-pure components and hooks) declare a separate property for the purpose
- That separate property is only ever used for static dependencies (not dynamic values)
- Default values are provided for all the dependencies through the default value for function properties JavaScript feature

Typical file structure:

```
/features/my-component
  my-component.ts(x)
  my-component.spec.ts(x)
```

What each file contains:

- `my-component.ts(x)`
  - The module/unit itself (be it a component or a hook)
  - Contains the imports of default dependencies and the dependency interface for the module/unit
- `my-component.spec.ts(x)`
  - Unit test for the module/unit

### Example

```tsx
// Tasks.tsx

import React from "react";
import type { Task } from "../types";
import { TaskItem } from "../components/TaskItem";
import { useTasks as useTasksImpl } from "./services/use-tasks";

type TasksDeps = {
  useTasks: () => { isLoading: boolean; tasks: Task[] };
};

const defaultDeps: TasksDeps = {
  useTasks: useTasksImpl,
};

type Props = {
  deps?: TasksDeps;
};

export const Tasks: React.FC<Props> = ({ deps = defaultDeps }) => {
  const { useTasks } = deps;
  const { isLoading, tasks } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const taskItems = tasks.map((task) => <TaskItem key={task.id} task={task} />);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>{taskItems}</ul>
    </div>
  );
};
```

```tsx
// Tasks.spec.tsx

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

describe("Tasks", () => {
  it("should display all loaded tasks", async () => {
    // arrange
    const deps: ComponentProps<typeof Tasks>["deps"] = {
      useTasks: vi.fn(() => ({
        isLoading: false,
        tasks: [
          {
            id: "task-1",
            text: "Dummy task 1",
          },
          {
            id: "task-2",
            text: "Dummy task 2",
          },
        ],
      })),
    };

    render(<Tasks deps={deps} />);

    // act
    await screen.findByText("Tasks");

    // assert
    expect(screen.getByText(/Dummy task 1/)).toBeInDocument();
    expect(screen.getByText(/Dummy task 2/)).toBeInDocument();
  });
});
```

## Tradeoffs

### DI vs. non-DI

Advantages of DI:

- Less coupling, which makes changing things easier
- Better testability, encouraging more unit testing
- Better maintainability (especially of tests)

Drawbacks of DI:

- Additional learning curve / complexity
- Additional files (why?)
  - (option 1 only) Context cannot be exported from the same file as a React component, as that will break [fast refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)

### Option 1

Advantages:

- More flexible injection, as you don't need to do prop drilling when manually injecting dependencies several layers down the tree
- No additional props in the unit interface (so no need to find a naming convention)

Disadvantages:

- Additional complexity (context)
- Additional files
  - Context cannot be exported from the same file as a React component, as that [breaks fast refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)

### Option 2

Advantages:

- Less complexity (no additional concepts)
- Less files (no context)

Disadvantages:

- Should ideally provide clear conventions about how to structure and name the prop used for injecting dependencies
- Less flexible injection, since you have to prop drill if doing multiple layers of injection (for example when doing a partial integration test)
