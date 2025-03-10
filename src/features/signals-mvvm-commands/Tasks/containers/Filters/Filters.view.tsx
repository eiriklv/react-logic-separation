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
    <option selected={selectedOwnerId === ""} key={"all"}>
      All
    </option>,
    ...users.map((user) => (
      <option selected={selectedOwnerId === user.id} key={user.id}>
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
          <select onChange={handleChangeSelectedUser}>{userOptions}</select>
        </label>
      </div>
    </div>
  );
}
