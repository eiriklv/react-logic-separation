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
      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => "abc"),
      };

      const tasksService = createService(tasksServiceDependencies);

      // act
      const tasks = await tasksService.listTasks();

      // assert
      expect(tasks).toEqual([]);
    });

    it("should reflect added tasks", async () => {
      // arrange
      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => "abc"),
      };

      const tasksService = createService(tasksServiceDependencies);

      // act
      await tasksService.addTask("New task", "user-1");
      const tasks = await tasksService.listTasks();

      // assert
      expect(tasks).toEqual([
        { id: "abc", text: "New task", ownerId: "user-1" },
      ]);
    });

    it("should reflect deleted tasks", async () => {
      // arrange
      const tasksServiceDependencies: TasksServiceDependencies = {
        generateId: vi.fn(() => "abc"),
      };

      const tasksService = createService(tasksServiceDependencies);

      // act
      await tasksService.addTask("New task", "user-1");
      const tasksAfterAdd = await tasksService.listTasks();

      // assert
      expect(tasksAfterAdd).toEqual([
        { id: "abc", text: "New task", ownerId: "user-1" },
      ]);

      // act
      await tasksService.deleteTask("abc");
      const tasksAfterDelete = await tasksService.listTasks();

      // assert
      expect(tasksAfterDelete).toEqual([]);
    });
  });
});
