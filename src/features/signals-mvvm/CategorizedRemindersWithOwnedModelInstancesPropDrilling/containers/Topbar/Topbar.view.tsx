import { useCallback, useContext } from "react";
import { TopbarContext } from "./Topbar.view.context";
import { SelectedCategoryModel } from "../../models/selected-category.model";

type Props = {
  selectedCategoryModel: SelectedCategoryModel;
};

export function Topbar({ selectedCategoryModel }: Props) {
  // Get dependencies
  const { useTopbarViewModel } = useContext(TopbarContext);

  // Use view model
  const { selectedCategory, categories, setSelectedCategory } =
    useTopbarViewModel({ selectedCategoryModel });

  const handleChangeCategory = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedCategory(event.target.value);
    },
    [setSelectedCategory],
  );

  const categoryItems = categories.map((category) => (
    <option key={category}>{category}</option>
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
        <select>{categoryItems}</select>
      </div>
    </div>
  );
}
