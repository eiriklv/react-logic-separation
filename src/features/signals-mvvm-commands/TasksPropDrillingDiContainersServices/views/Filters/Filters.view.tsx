import { useCallback } from "react";
import defaultDependencies, {
  FiltersDependencies,
} from "./Filters.view.dependencies";

type Props = {
  dependencies?: FiltersDependencies;
};

export function Filters({ dependencies = defaultDependencies }: Props) {
  // Get dependencies
  const { useFiltersViewModel } = dependencies;

  // Use view model
  const {
    setSelectedOwnerId,
    selectedOwnerId,
    users = [],
  } = useFiltersViewModel();

  const handleChangeSelectedUser = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOwnerId(event.target.value);
    },
    [setSelectedOwnerId],
  );

  const userOptions = [
    <option key={"all"} value={""}>
      All
    </option>,
    ...users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    )),
  ];

  return (
    <div>
      <h3>Filters</h3>
      <div>
        <label>
          Owner:
          <select value={selectedOwnerId} onChange={handleChangeSelectedUser}>
            {userOptions}
          </select>
        </label>
      </div>
    </div>
  );
}
