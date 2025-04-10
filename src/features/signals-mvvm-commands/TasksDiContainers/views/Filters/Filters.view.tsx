import { useCallback, useContext } from "react";
import { FiltersContext } from "./Filters.view.context";

export function Filters() {
  // Get dependencies
  const { useFiltersViewModel } = useContext(FiltersContext);

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
