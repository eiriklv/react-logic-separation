import { User } from "../types";
import { IUsersService } from "../services/users.service";
import { useQuery } from "@tanstack/react-query";

export interface IUserModel {
  user: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Types and interfaces
export type UserModelDependencies = {
  usersService: Pick<IUsersService, "getUserById">;
};

export function useUserModel(userId: string, dependencies: UserModelDependencies): IUserModel {
  // Queries
  const userQuery = useQuery<User | undefined>({
    queryKey: ["user", userId],
    queryFn: () => dependencies.usersService.getUserById(userId),
    retry: false,
  });

  // Computed values
  const user = userQuery.data;
  const isLoading = userQuery.isLoading;
  const error = userQuery.error;

  return {
    user,
    isLoading,
    error,
  }
}