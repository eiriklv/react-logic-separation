import { useContext } from "react";
import { CategorySidebarContext } from "./CategorySidebar.view.context";

export function CategorySidebar() {
  // Get dependencies
  const { useCategorySidebarViewModel } = useContext(CategorySidebarContext);

  // Use view model
  const { selectedCategory, categories, setSelectedCategory } =
    useCategorySidebarViewModel();

  const categoryItems = categories.map((category) => {
    const isSelectedCategory = category === selectedCategory;

    /**
     * TODO: How to add count for each category?
     * Could make a CategorySidebarItem that is given
     * the category name and then it fetches the count
     * itself via it's own viewmodel (that has a param)
     * domain model can then have a getter called
     * getReminderCountByCategory
     *
     * Another alternative is to supply the count
     * together with the category name when providing
     * categories through the viewmodel
     *
     * Another alternative is to provide a separate
     * getter that has both the category names and counts
     * (to avoid unnecessary updates for consumers not caring about counts)
     */
    return (
      <li key={category}>
        <a
          href="#"
          onClick={() => setSelectedCategory(category)}
          style={{ fontWeight: isSelectedCategory ? "bold" : "normal" }}
        >
          {category}
        </a>
      </li>
    );
  });

  return (
    <div>
      <h4>Categories</h4>
      <ul>{categoryItems}</ul>
    </div>
  );
}
