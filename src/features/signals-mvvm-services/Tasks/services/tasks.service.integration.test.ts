import { Task } from "../types";
import { createTasksService, SdkDependencies } from "./tasks.service";
import defaultDependencies, {
  TasksServiceDependencies,
} from "./tasks.service.dependencies";

/**
 * TODO(eiriklv): Add tests using real SDK instance
 * and real dependencies to ensure that it integrates correctly
 */
describe(`Tasks Service Integration`, () => {
  it("should have unique ids for added tasks", async () => {
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
    const updatedTasks: Task[] = [task];

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
      generateId: defaultDependencies.generateId,
    };

    const tasksService = createTasksService(sdkMock, tasksServiceDependencies);

    // act
    const firstAddedTask = await tasksService.addTask(taskText, taskOwnerId);
    const secondAddedTask = await tasksService.addTask(taskText, taskOwnerId);

    // assert
    expect(firstAddedTask.id).not.toEqual(secondAddedTask.id);
  });
});
