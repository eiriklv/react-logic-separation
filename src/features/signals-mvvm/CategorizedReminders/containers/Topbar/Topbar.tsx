import { useCallback, useContext } from "react";
import { TopbarContext } from "./Topbar.context";

export function Topbar() {
  // Get dependencies
  const { useTopbarViewModel } = useContext(TopbarContext);

  // Use view model
  const { selectedCategory, categories, setSelectedCategory } =
    useTopbarViewModel();

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedCategory(event.target.value);
    },
    [setSelectedCategory],
  );

  const categoryItems = categories.map((category) => (
    <li key={category}>{category}</li>
  ));

  return (
    <div>
      <h3>Categorized Reminders</h3>
      <div>
        <label>
          Selected category:
          <input
            type="text"
            value={selectedCategory}
            onChange={handleChangeCategory}
          />
        </label>
      </div>
      <div>
        Available categories:
        <ul>{categoryItems}</ul>
      </div>
    </div>
  );
}
