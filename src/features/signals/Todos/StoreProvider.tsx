import { TodosModel } from "./model";
import { StoreContext } from "./signal-hooks";

export const StoreProvider = ({
  children,
  store,
}: React.PropsWithChildren<{ store: TodosModel }>) => {
  return (
    <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
  );
};
