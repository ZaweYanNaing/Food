import { useState } from 'react';
import { Search, Filter, Clock, Users, Star, Heart, Share2 } from 'lucide-react';
import {Button} from '../components/ui/button';

interface Recipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  cuisineType: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  dietaryPreferences: string[];
  rating: number;
  reviewCount: number;
  isFavorite: boolean;
}

export default function RecipeCollectionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  // Sample recipe data - replace with API calls
  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      description: "A traditional Italian pizza with fresh mozzarella, basil, and tomato sauce",
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      cuisineType: "Italian",
      difficultyLevel: "medium",
      prepTime: 30,
      cookTime: 15,
      servings: 4,
      dietaryPreferences: ["vegetarian"],
      rating: 4.8,
      reviewCount: 127,
      isFavorite: false
    },
    {
      id: 2,
      title: "Spicy Thai Green Curry",
      description: "Aromatic and spicy curry with coconut milk, vegetables, and your choice of protein",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      cuisineType: "Thai",
      difficultyLevel: "hard",
      prepTime: 45,
      cookTime: 30,
      servings: 6,
      dietaryPreferences: ["vegan", "gluten-free"],
      rating: 4.6,
      reviewCount: 89,
      isFavorite: true
    },
    {
      id: 3,
      title: "Simple Caesar Salad",
      description: "Fresh romaine lettuce with classic Caesar dressing and croutons",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      cuisineType: "American",
      difficultyLevel: "easy",
      prepTime: 15,
      cookTime: 0,
      servings: 2,
      dietaryPreferences: ["vegetarian"],
      rating: 4.3,
      reviewCount: 56,
      isFavorite: false
    },
    {
      id: 4,
      title: "French Coq au Vin",
      description: "Classic French braised chicken in red wine with mushrooms and pearl onions",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      cuisineType: "French",
      difficultyLevel: "hard",
      prepTime: 60,
      cookTime: 90,
      servings: 4,
      dietaryPreferences: [],
      rating: 4.9,
      reviewCount: 203,
      isFavorite: false
    },
    {
      id: 5,
      title: "Japanese Miso Soup",
      description: "Traditional Japanese soup with dashi, miso paste, and fresh vegetables",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      cuisineType: "Japanese",
      difficultyLevel: "easy",
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      dietaryPreferences: ["vegan", "gluten-free"],
      rating: 4.5,
      reviewCount: 78,
      isFavorite: true
    },
    {
      id: 6,
      title: "Mexican Street Tacos",
      description: "Authentic street-style tacos with marinated meat, onions, and cilantro",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      cuisineType: "Mexican",
      difficultyLevel: "medium",
      prepTime: 40,
      cookTime: 25,
      servings: 6,
      dietaryPreferences: [],
      rating: 4.7,
      reviewCount: 145,
      isFavorite: false
    }
  ];

  const cuisineTypes = ['all', 'Italian', 'Thai', 'American', 'French', 'Japanese', 'Mexican', 'Indian', 'Chinese', 'Mediterranean'];
  const difficultyLevels = ['all', 'easy', 'medium', 'hard'];
  const dietaryOptions = ['all', 'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'all' || recipe.cuisineType === selectedCuisine;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficultyLevel === selectedDifficulty;
    const matchesDietary = selectedDietary === 'all' || recipe.dietaryPreferences.includes(selectedDietary);
    
    return matchesSearch && matchesCuisine && matchesDifficulty && matchesDietary;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'quickest':
        return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
      case 'easiest':
        return a.difficultyLevel === 'easy' ? -1 : b.difficultyLevel === 'easy' ? 1 : 0;
      default:
        return 0;
    }
  });

  const toggleFavorite = (recipeId: number) => {
    // Handle favorite toggle - update state or make API call
    console.log('Toggle favorite for recipe:', recipeId);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
              case 'easy': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Recipe Collection
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Discover diverse recipes from around the world, categorized by cuisine type, 
            dietary preferences, and cooking difficulty.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for recipes, ingredients, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Cuisine Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {cuisineTypes.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine === 'all' ? 'All Cuisines' : cuisine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {difficultyLevels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Difficulties' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dietary Filter */}
              <div className="flex items-center space-x-2">
                <select
                  value={selectedDietary}
                  onChange={(e) => setSelectedDietary(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {dietaryOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All Diets' : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="quickest">Quickest</option>
                <option value="easiest">Easiest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {sortedRecipes.length} of {recipes.length} recipes
            </p>
          </div>

          {sortedRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedRecipes.map((recipe) => (
                <article key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={recipe.imageUrl} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                        recipe.isFavorite 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recipe.difficultyLevel)}`}>
                        {recipe.difficultyLevel.charAt(0).toUpperCase() + recipe.difficultyLevel.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                        <span>{recipe.rating} ({recipe.reviewCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recipe.dietaryPreferences.map((diet, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {diet}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-600">{recipe.cuisineType}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button size="sm">
                          View Recipe
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join our community and share your own recipes, or request specific dishes 
            from our culinary experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Submit Your Recipe
            </Button>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Request a Recipe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
