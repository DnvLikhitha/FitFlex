import { useState } from "react";

function Nutrition() {
  const [query, setQuery] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const getNutrition = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=10`
      );

      const data = await res.json();

      if (data.products && data.products.length > 0) {
        // Filter products that have nutrition data
        const validProducts = data.products.filter(p => 
          p.product_name && p.nutriments && p.nutriments["energy-kcal_100g"]
        );
        
        if (validProducts.length === 1) {
          // If only one result, show it directly
          setNutrition(validProducts[0]);
          setShowResults(false);
        } else if (validProducts.length > 1) {
          // Show multiple results to choose from
          setSearchResults(validProducts);
          setShowResults(true);
          setNutrition(null);
        }
      }
    } catch (err) {
      console.error("Error fetching nutrition:", err);
    }
  };

  const selectProduct = (product) => {
    setNutrition(product);
    setShowResults(false);
    setSearchResults([]);
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

      {showResults && searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select a product:</h2>
          <div className="space-y-3">
            {searchResults.slice(0, 5).map((product, index) => (
              <button
                key={index}
                onClick={() => selectProduct(product)}
                className="w-full text-left p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg hover:border-blue-500 hover:bg-[#222] transition-all"
              >
                <div className="font-semibold">{product.product_name}</div>
                {product.brands && (
                  <div className="text-sm text-gray-400 mt-1">{product.brands}</div>
                )}
                <div className="text-sm text-gray-500 mt-1">
                  {product.nutriments["energy-kcal_100g"]} kcal per 100g
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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