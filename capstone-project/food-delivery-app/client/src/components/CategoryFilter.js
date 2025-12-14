import { useContext } from "react";
import { RestaurantContext } from "../contexts/RestaurantContext";

const categories = ["All", "Snacks", "malwa-thali", "Biryani","punjabi-thali","south-indian-food"];

export default function CategoryFilter() {
  const { category, setCategory } = useContext(RestaurantContext);

  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={category === cat ? "active" : ""}
          onClick={() => setCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
