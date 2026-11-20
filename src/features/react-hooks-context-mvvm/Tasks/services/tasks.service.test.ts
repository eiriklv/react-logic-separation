import { Task } from "../types";
import { createTasksService, SdkDependencies } from "./tasks.service";
import { TasksServiceDependencies } from "./tasks.service.dependencies";
import { createTasksServiceMock } from "./tasks.service.mock";

/**
 * Optional: Remove the default dependencies from the test
 * so that we avoid the unnecessary collect-time and side-effects
 */
vi.mock("./tasks.service.dependencies", () => ({ default: {} }));

describe.each([
  { id: "Real", createService: createTasksService },
  { id: "Mock", createService: createTasksServiceMock },
])("Tasks Service", ({ id, createService }) => {
  describe(`Tasks Service (${id})`, () => {
    it("should reflect the initial value", async () => {
      // arrange
      const initialTasks: Task[] = [];

      const sdkMock: SdkDependencies = {
        listTasks: vi.fn(async () => initialTasks),
        upsertTask: vi.fn(),
        deleteTask: vi.fn(),
      };

      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(),
        initialTasks,
      };

      const tasksService = createService(sdkMock, tasksServiceDependencies);

      // act
      const tasks = await tasksService.listTasks();

      // assert
      expect(tasks).toEqual(initialTasks);
    });

    it("should reflect added tasks", async () => {
      // arrange
      const taskId: string = "abc";
      const taskText: string = "New task";
      const taskOwnerId: string = "user-1";

      const task: Task = {
        id: taskId,
        text: taskText,
        ownerId: taskOwnerId,
      };

      const initialTasks: Task[] = [];

      const updatedTasks: Task[] = [...initialTasks, task];

      const sdkMock: SdkDependencies = {
        listTasks: vi
          .fn<SdkDependencies["listTasks"]>()
          .mockResolvedValueOnce(initialTasks)
          .mockResolvedValueOnce(updatedTasks),
        upsertTask: vi
          .fn<SdkDependencies["upsertTask"]>()
          .mockResolvedValueOnce(task),
        deleteTask: vi.fn(),
      };

      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => taskId),
        initialTasks,
      };

      const tasksService = createService(sdkMock, tasksServiceDependencies);

      // act
      const tasksBeforeAdd = await tasksService.listTasks();

      // assert
      expect(tasksBeforeAdd).toEqual(initialTasks);

      // act
      await tasksService.addTask(taskText, taskOwnerId);
      const tasks = await tasksService.listTasks();

      // assert
      expect(tasks).toEqual(updatedTasks);
    });

    it("should reflect multiple added tasks", async () => {
      // arrange
      const taskOwnerId: string = "user-1";

      const firstTask: Task = {
        id: "task-1",
        text: "Task 1",
        ownerId: taskOwnerId,
      };

      const secondTask: Task = {
        id: "task-2",
        text: "Task 2",
        ownerId: taskOwnerId,
      };

      const initialTasks: Task[] = [];

      const firstUpdatedTasks: Task[] = [...initialTasks, firstTask];
      const secondUpdatedTasks: Task[] = [
        ...initialTasks,
        firstTask,
        secondTask,
      ];

      const sdkMock: SdkDependencies = {
        listTasks: vi
          .fn<SdkDependencies["listTasks"]>()
          .mockResolvedValueOnce(initialTasks)
          .mockResolvedValueOnce(firstUpdatedTasks)
          .mockResolvedValueOnce(secondUpdatedTasks),
        upsertTask: vi
          .fn<SdkDependencies["upsertTask"]>()
          .mockResolvedValueOnce(firstTask)
          .mockResolvedValueOnce(secondTask),
        deleteTask: vi.fn(),
      };

      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi
          .fn<TasksServiceDependencies["generateId"]>()
          .mockReturnValueOnce(firstTask.id)
          .mockReturnValueOnce(secondTask.id),
        initialTasks,
      };

      const tasksService = createService(sdkMock, tasksServiceDependencies);

      // act
      const tasksBeforeAdd = await tasksService.listTasks();

      // assert
      expect(tasksBeforeAdd).toEqual(initialTasks);

      // act
      await tasksService.addTask(firstTask.text, taskOwnerId);
      const tasksAfterFirstUpdate = await tasksService.listTasks();

      // assert
      expect(tasksAfterFirstUpdate).toEqual(firstUpdatedTasks);

      // act
      await tasksService.addTask(secondTask.text, taskOwnerId);
      const tasks = await tasksService.listTasks();

      // assert
      expect(tasks).toEqual(secondUpdatedTasks);
    });

    it("should reflect deleted tasks", async () => {
      // arrange
      const taskId: string = "abc";
      const taskText: string = "New task";
      const taskOwnerId: string = "user-1";

      const task: Task = {
        id: taskId,
        text: taskText,
        ownerId: taskOwnerId,
      };

      const initialTasks: Task[] = [
        {
          id: "a",
          text: "b",
          ownerId: "c",
        },
      ];

      const updatedTasks: Task[] = [...initialTasks, task];

      const sdkMock: SdkDependencies = {
        listTasks: vi
          .fn<SdkDependencies["listTasks"]>()
          .mockResolvedValueOnce(initialTasks)
          .mockResolvedValueOnce(updatedTasks)
          .mockResolvedValueOnce(initialTasks),
        upsertTask: vi.fn(),
        deleteTask: vi.fn().mockResolvedValueOnce(taskId),
      };

      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => taskId),
        initialTasks,
      };

      const tasksService = createService(sdkMock, tasksServiceDependencies);

      // act
      const tasksBeforeAdd = await tasksService.listTasks();

      // assert
      expect(tasksBeforeAdd).toEqual(initialTasks);

      // act
      await tasksService.addTask(taskText, taskOwnerId);
      const tasksAfterAdd = await tasksService.listTasks();

      // assert
      expect(tasksAfterAdd).toEqual(updatedTasks);

      // act
      await tasksService.deleteTask(taskId);
      const tasksAfterDelete = await tasksService.listTasks();

      // assert
      expect(tasksAfterDelete).toEqual(initialTasks);
    });
  });
});
