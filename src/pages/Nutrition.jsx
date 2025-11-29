import { useState } from "react";
import { FaAppleAlt, FaFire, FaDrumstickBite, FaBreadSlice, FaCheese } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Nutrition() {
  const [query, setQuery] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [dailyIntake, setDailyIntake] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const getNutrition = async () => {
    if (!query) return;

    try {
      const API_KEY = "80481f65007a4c418bc3cfceb9d3aa03";
      
      const searchUrl = `https://api.spoonacular.com/food/products/search?query=${query}&number=5&apiKey=${API_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.status === "failure") {
        toast.error(searchData.message || "API error occurred");
        return;
      }

      if (!searchData.products || searchData.products.length === 0) {
        toast.error(`No nutrition found for: ${query}`);
        return;
      }

      if (searchData.products.length > 1) {
        const validProducts = searchData.products.map(p => ({
          id: p.id,
          product_name: p.title,
          brands: p.brand || "",
          image_url: p.image,
          nutriments: {
            "energy-kcal_100g": Math.round((p.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount || 0) * (100 / (p.servingSize || 100)))
          }
        }));
        setSearchResults(validProducts);
        setShowResults(true);
        setNutrition(null);
        return;
      }

      const product = searchData.products[0];
      const nutrients = product.nutrition?.nutrients || [];
      const servingSize = product.servingSize || 100;
      const multiplier = 100 / servingSize;

      const calories = (nutrients.find(n => n.name === "Calories")?.amount || 0) * multiplier;
      const protein = (nutrients.find(n => n.name === "Protein")?.amount || 0) * multiplier;
      const carbs = (nutrients.find(n => n.name === "Carbohydrates")?.amount || 0) * multiplier;
      const fat = (nutrients.find(n => n.name === "Fat")?.amount || 0) * multiplier;
      const sugar = (nutrients.find(n => n.name === "Sugar")?.amount || 0) * multiplier;
      const fiber = (nutrients.find(n => n.name === "Fiber")?.amount || 0) * multiplier;
      const sodium = (nutrients.find(n => n.name === "Sodium")?.amount || 0) * multiplier / 1000;
      const saturatedFat = (nutrients.find(n => n.name === "Saturated Fat")?.amount || 0) * multiplier;

      setNutrition({
        product_name: product.title,
        image_url: product.image,
        brands: product.brand,
        nutriments: {
          "energy-kcal_100g": Math.round(calories),
          proteins_100g: Math.round(protein * 10) / 10,
          carbohydrates_100g: Math.round(carbs * 10) / 10,
          fat_100g: Math.round(fat * 10) / 10,
          sugars_100g: Math.round(sugar * 10) / 10,
          fiber_100g: Math.round(fiber * 10) / 10,
          sodium_100g: Math.round(sodium * 100) / 100,
          "saturated-fat_100g": Math.round(saturatedFat * 10) / 10
        }
      });
      setShowResults(false);
    } catch (err) {
      console.error("Error fetching nutrition:", err);
      toast.error("Failed to fetch nutrition data. Please try again.");
    }
  };

  const selectProduct = async (product) => {
    try {
      const API_KEY = "80481f65007a4c418bc3cfceb9d3aa03";
      const infoUrl = `https://api.spoonacular.com/food/products/${product.id}?apiKey=${API_KEY}`;
      const infoRes = await fetch(infoUrl);
      const infoData = await infoRes.json();

      const nutrients = infoData.nutrition?.nutrients || [];
      const servingSize = infoData.servingSize || 100;
      const multiplier = 100 / servingSize;

      const calories = (nutrients.find(n => n.name === "Calories")?.amount || 0) * multiplier;
      const protein = (nutrients.find(n => n.name === "Protein")?.amount || 0) * multiplier;
      const carbs = (nutrients.find(n => n.name === "Carbohydrates")?.amount || 0) * multiplier;
      const fat = (nutrients.find(n => n.name === "Fat")?.amount || 0) * multiplier;
      const sugar = (nutrients.find(n => n.name === "Sugar")?.amount || 0) * multiplier;
      const fiber = (nutrients.find(n => n.name === "Fiber")?.amount || 0) * multiplier;
      const sodium = (nutrients.find(n => n.name === "Sodium")?.amount || 0) * multiplier / 1000;
      const saturatedFat = (nutrients.find(n => n.name === "Saturated Fat")?.amount || 0) * multiplier;

      setNutrition({
        product_name: infoData.title,
        image_url: infoData.image,
        brands: infoData.brand,
        nutriments: {
          "energy-kcal_100g": Math.round(calories),
          proteins_100g: Math.round(protein * 10) / 10,
          carbohydrates_100g: Math.round(carbs * 10) / 10,
          fat_100g: Math.round(fat * 10) / 10,
          sugars_100g: Math.round(sugar * 10) / 10,
          fiber_100g: Math.round(fiber * 10) / 10,
          sodium_100g: Math.round(sodium * 100) / 100,
          "saturated-fat_100g": Math.round(saturatedFat * 10) / 10
        }
      });
      setShowResults(false);
      setSearchResults([]);
    } catch (err) {
      console.error("Error fetching product details:", err);
      toast.error("Failed to fetch product details. Please try again.");
    }
  };

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-r from-gray-900 via-green-900 to-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div className="relative z-10 h-full flex items-center px-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Nutrition Tracker</h1>
            <p className="text-xl text-gray-300">Fuel your body, power your performance</p>
          </div>
        </div>
      </div>

      {/* Daily Macros Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Calories</span>
            <FaFire className="text-orange-500 text-xl" />
          </div>
          <div className="text-sm text-green-400 font-bold mb-2">{dailyIntake.calories}/{dailyGoals.calories}</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage(dailyIntake.calories, dailyGoals.calories)}%` }}
            ></div>
          </div>
          <div className="text-2xl font-black text-white">{Math.round(getProgressPercentage(dailyIntake.calories, dailyGoals.calories))}%</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Protein</span>
            <FaDrumstickBite className="text-red-500 text-xl" />
          </div>
          <div className="text-sm text-green-400 font-bold mb-2">{dailyIntake.protein}g/{dailyGoals.protein}g</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage(dailyIntake.protein, dailyGoals.protein)}%` }}
            ></div>
          </div>
          <div className="text-2xl font-black text-white">{Math.round(getProgressPercentage(dailyIntake.protein, dailyGoals.protein))}%</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Carbs</span>
            <FaBreadSlice className="text-blue-500 text-xl" />
          </div>
          <div className="text-sm text-green-400 font-bold mb-2">{dailyIntake.carbs}g/{dailyGoals.carbs}g</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage(dailyIntake.carbs, dailyGoals.carbs)}%` }}
            ></div>
          </div>
          <div className="text-2xl font-black text-white">{Math.round(getProgressPercentage(dailyIntake.carbs, dailyGoals.carbs))}%</div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all group hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Fat</span>
            <FaCheese className="text-yellow-500 text-xl" />
          </div>
          <div className="text-sm text-green-400 font-bold mb-2">{dailyIntake.fat}g/{dailyGoals.fat}g</div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage(dailyIntake.fat, dailyGoals.fat)}%` }}
            ></div>
          </div>
          <div className="text-2xl font-black text-white">{Math.round(getProgressPercentage(dailyIntake.fat, dailyGoals.fat))}%</div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <FaAppleAlt className="text-green-500 mr-3" />
          Search Food 
        </h2>
        <div className="flex gap-4">
          <input
            type="text"
            className="p-3 w-full rounded-xl bg-white/5 border border-green-500/20 focus:border-green-500 focus:outline-none text-white"
            placeholder="e.g., banana, chicken, rice, eggs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getNutrition()}
          />
          <button
            onClick={getNutrition}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 font-bold text-white transition-all hover:scale-105"
          >
            Search
          </button>
        </div>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Select a product:</h2>
          <div className="space-y-3">
            {searchResults.slice(0, 5).map((product, index) => (
              <button
                key={index}
                onClick={() => selectProduct(product)}
                className="w-full text-left p-4 bg-white/5 border border-green-500/20 rounded-xl hover:border-green-500 hover:bg-white/10 transition-all group"
              >
                <div className="font-semibold text-white text-lg group-hover:text-green-400 transition-colors">{product.product_name}</div>
                {product.brands && (
                  <div className="text-sm text-gray-400 mt-1">{product.brands}</div>
                )}
                <div className="text-sm text-gray-400 mt-1">
                  {product.nutriments["energy-kcal_100g"]} kcal per 100g
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {nutrition && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white capitalize">
              {nutrition.product_name}
            </h2>
            {nutrition.image_url && (
              <img src={nutrition.image_url} alt={nutrition.product_name} className="w-16 h-16 object-cover rounded-lg" />
            )}
          </div>

          {nutrition.nutriments && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Calories</span>
                  <FaFire className="text-orange-500" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments["energy-kcal_100g"] || "N/A"} <span className="text-sm text-gray-400">kcal/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Protein</span>
                  <FaDrumstickBite className="text-red-500" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments.proteins_100g || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Carbohydrates</span>
                  <FaBreadSlice className="text-blue-500" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments.carbohydrates_100g || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Fat</span>
                  <FaCheese className="text-yellow-500" />
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments.fat_100g || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sugar</span>
                  <span className="text-2xl">🍬</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments.sugars_100g || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Fiber</span>
                  <span className="text-2xl">🌾</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments.fiber_100g || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Sodium</span>
                  <span className="text-2xl">🧂</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments.sodium_100g || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Saturated Fat</span>
                  <span className="text-2xl">🥓</span>
                </div>
                <div className="text-2xl font-black text-white mt-2">
                  {nutrition.nutriments["saturated-fat_100g"] || "N/A"} <span className="text-sm text-gray-400">g/100g</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <p className="text-sm text-gray-300 flex items-center">
              <span className="mr-2">ℹ️</span>
              <span>All nutrition values are per 100g. Adjust portions accordingly for accurate tracking.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Nutrition;