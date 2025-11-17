import { ISdk } from "../sdks/sdk";
import { Task } from "../types";
import { createTasksService } from "./tasks.service";
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

      const sdkMock: ISdk = {
        listTasks: vi.fn(async () => initialTasks),
        upsertTask: vi.fn(),
        deleteTask: vi.fn(),
      };

      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => "abc"),
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

      const sdkMock: ISdk = {
        listTasks: vi
          .fn<ISdk["listTasks"]>()
          .mockResolvedValueOnce(initialTasks)
          .mockResolvedValueOnce([...initialTasks, task]),
        upsertTask: vi.fn<ISdk["upsertTask"]>().mockResolvedValueOnce(task),
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
      expect(tasks).toEqual([
        ...initialTasks,
        { id: taskId, text: taskText, ownerId: taskOwnerId },
      ]);
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

      const sdkMock: ISdk = {
        listTasks: vi
          .fn<ISdk["listTasks"]>()
          .mockResolvedValueOnce(initialTasks)
          .mockResolvedValueOnce([...initialTasks, task])
          .mockResolvedValueOnce(initialTasks),
        upsertTask: vi.fn(),
        deleteTask: vi.fn().mockResolvedValueOnce(taskId),
      };

      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => "abc"),
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
      expect(tasksAfterAdd).toEqual([...initialTasks, task]);

      // act
      await tasksService.deleteTask(taskId);
      const tasksAfterDelete = await tasksService.listTasks();

      // assert
      expect(tasksAfterDelete).toEqual(initialTasks);
    });
  });
});
