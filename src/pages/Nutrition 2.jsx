import { useState } from "react";

function Nutrition() {
  const [query, setQuery] = useState("");
  const [nutrition, setNutrition] = useState(null);

  const getNutrition = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1`
      );

      const data = await res.json();

      if (data.products && data.products.length > 0) {
        const item = data.products[0];
        setNutrition(item);
      }
    } catch (err) {
      console.error("Error fetching nutrition:", err);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Nutrition Tracker (FREE)</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          className="p-3 w-full rounded bg-[#1a1a1a] border border-gray-700"
          placeholder="e.g., banana, chicken, rice"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={getNutrition}
          className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
        >
          Get Info
        </button>
      </div>

      {nutrition && (
        <div className="bg-[#111] p-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 capitalize">
            {nutrition.product_name}
          </h2>

          {nutrition.nutriments && (
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Calories:</strong> {nutrition.nutriments["energy-kcal_100g"] || "N/A"} kcal</p>
              <p><strong>Protein:</strong> {nutrition.nutriments.proteins_100g || "N/A"} g</p>
              <p><strong>Carbs:</strong> {nutrition.nutriments.carbohydrates_100g || "N/A"} g</p>
              <p><strong>Sugar:</strong> {nutrition.nutriments.sugars_100g || "N/A"} g</p>
              <p><strong>Fat:</strong> {nutrition.nutriments.fat_100g || "N/A"} g</p>
              <p><strong>Fiber:</strong> {nutrition.nutriments.fiber_100g || "N/A"} g</p>
              <p><strong>Sodium:</strong> {nutrition.nutriments.sodium_100g || "N/A"} g</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Nutrition;