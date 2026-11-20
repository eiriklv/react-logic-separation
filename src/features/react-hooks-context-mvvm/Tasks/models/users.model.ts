import { User } from "../types";
import { IUsersService } from "../services/users.service";
import { useQuery } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";

export interface IUsersModel {
  users: User[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Types and interfaces
export type UsersModelDependencies = {
  usersService: Pick<IUsersService, "listUsers">;
};

export function useUsersModel(
  queryClient: QueryClient,
  dependencies: UsersModelDependencies,
): IUsersModel {
  // Queries
  const usersQuery = useQuery<User[]>(
    {
      queryKey: ["users"],
      queryFn: () => dependencies.usersService.listUsers(),
      retry: false,
    },
    queryClient,
  );

  // Computed values
  const users = usersQuery.data;
  const isLoading = usersQuery.isLoading;
  const error = usersQuery.error;

  return {
    users,
    isLoading,
    error,
  };
}
