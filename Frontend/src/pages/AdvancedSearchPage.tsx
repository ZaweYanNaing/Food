import { useState, useEffect } from 'react';
import { Search, Filter, Star, Heart, Clock, TrendingUp, Flame, Clock3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-toastify';

interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  difficulty: string;
  image_url?: string;
  categories: string[];
  firstName: string;
  lastName: string;
  average_rating: number;
  total_ratings: number;
  total_likes: number;
  created_at: string;
}

interface SearchFilters {
  query: string;
  category: string;
  difficulty: string;
  min_cooking_time: string;
  max_cooking_time: string;
  cuisine_type: string;
  servings: string;
  ingredients: string;
  sort_by: string;
}

export default function AdvancedSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'popular' | 'recent'>('search');

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    difficulty: '',
    min_cooking_time: '',
    max_cooking_time: '',
    cuisine_type: '',
    servings: '',
    ingredients: '',
    sort_by: 'relevance'
  });

  useEffect(() => {
    loadInitialData();
    
    // Check URL parameters for initial tab and search query
    const tab = searchParams.get('tab') as 'search' | 'trending' | 'popular' | 'recent';
    const query = searchParams.get('q');
    
    if (tab && ['trending', 'popular', 'recent'].includes(tab)) {
      setActiveTab(tab);
    }
    
    if (query) {
      setFilters(prev => ({ ...prev, query }));
      // Auto-search if query is provided
      setTimeout(() => handleSearch(), 100);
    }
  }, [searchParams]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, cuisineRes, difficultyRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getCuisineTypes(),
        apiService.getDifficultyLevels()
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (cuisineRes.success) setCuisineTypes(cuisineRes.data);
      if (difficultyRes.success) setDifficultyLevels(difficultyRes.data);

      // Load trending recipes by default
      loadTrendingRecipes();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadTrendingRecipes = async () => {
    try {
      const response = await apiService.getTrendingRecipes();
      if (response.success) {
        setTrendingRecipes(response.data);
      }
    } catch (error) {
      console.error('Error loading trending recipes:', error);
    }
  };

  const loadPopularRecipes = async () => {
    try {
      const response = await apiService.getPopularRecipes();
      if (response.success) {
        setPopularRecipes(response.data);
      }
    } catch (error) {
      console.error('Error loading popular recipes:', error);
    }
  };

  const loadRecentRecipes = async () => {
    try {
      const response = await apiService.getRecentRecipes();
      if (response.success) {
        setRecentRecipes(response.data);
      }
    } catch (error) {
      console.error('Error loading recent recipes:', error);
    }
  };

  const handleSearch = async () => {
    if (!filters.query.trim() && Object.values(filters).every(v => !v || v === 'relevance')) {
      toast.info('Please enter a search term or select filters');
      return;
    }

    setIsLoading(true);
    try {
      const searchFilters: any = { ...filters };
      delete searchFilters.query;
      delete searchFilters.sort_by;

      // Convert string values to appropriate types
      if (searchFilters.category) searchFilters.category = parseInt(searchFilters.category);
      if (searchFilters.min_cooking_time) searchFilters.min_cooking_time = parseInt(searchFilters.min_cooking_time);
      if (searchFilters.max_cooking_time) searchFilters.max_cooking_time = parseInt(searchFilters.max_cooking_time);
      if (searchFilters.servings) searchFilters.servings = parseInt(searchFilters.servings);

      const response = await apiService.searchRecipes(filters.query, searchFilters);
      if (response.success) {
        setRecipes(response.data);
        setActiveTab('search');
      } else {
        toast.error(response.message || 'Search failed');
      }
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      difficulty: '',
      min_cooking_time: '',
      max_cooking_time: '',
      cuisine_type: '',
      servings: '',
      ingredients: '',
      sort_by: 'relevance'
    });
    setRecipes([]);
  };

  const handleTabChange = (tab: 'search' | 'trending' | 'popular' | 'recent') => {
    setActiveTab(tab);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    if (tab === 'search') {
      newSearchParams.delete('tab');
    } else {
      newSearchParams.set('tab', tab);
    }
    setSearchParams(newSearchParams);
    
    if (tab === 'trending' && trendingRecipes.length === 0) {
      loadTrendingRecipes();
    } else if (tab === 'popular' && popularRecipes.length === 0) {
      loadPopularRecipes();
    } else if (tab === 'recent' && recentRecipes.length === 0) {
      loadRecentRecipes();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCookingTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const renderRecipeCard = (recipe: Recipe) => (
    <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {recipe.image_url && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img 
            src={recipe.image_url} 
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Recipe Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatCookingTime(recipe.cooking_time)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {recipe.average_rating > 0 && (
              <span className="flex items-center text-sm text-yellow-600">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {recipe.average_rating.toFixed(1)}
              </span>
            )}
            {recipe.total_likes > 0 && (
              <span className="flex items-center text-sm text-red-500">
                <Heart className="w-4 h-4 mr-1" />
                {recipe.total_likes}
              </span>
            )}
          </div>
        </div>

        {/* Categories */}
        {recipe.categories && recipe.categories.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {recipe.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-[#78C841]/20 text-[#78C841] text-xs rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author */}
        <div className="text-xs text-gray-500 mb-3">
          By {recipe.firstName} {recipe.lastName}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="flex-1"
          >
            View Recipe
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Recipe Search</h1>
          <p className="text-gray-600">Discover amazing recipes with powerful filters and trending content</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes by title, description, or ingredients..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-[#78C841] hover:bg-[#6bb03a] px-6"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                  >
                    <option value="">All Difficulties</option>
                    {difficultyLevels.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                {/* Cuisine Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                  <select
                    value={filters.cuisine_type}
                    onChange={(e) => handleFilterChange('cuisine_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                  >
                    <option value="">All Cuisines</option>
                    {cuisineTypes.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                {/* Cooking Time Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Time</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.min_cooking_time}
                      onChange={(e) => handleFilterChange('min_cooking_time', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.max_cooking_time}
                      onChange={(e) => handleFilterChange('max_cooking_time', e.target.value)}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                    />
                  </div>
                </div>

                {/* Servings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Servings</label>
                  <input
                    type="number"
                    placeholder="Number of servings"
                    value={filters.servings}
                    onChange={(e) => handleFilterChange('servings', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                  />
                </div>

                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
                  <input
                    type="text"
                    placeholder="Search by ingredients"
                    value={filters.ingredients}
                    onChange={(e) => handleFilterChange('ingredients', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841]"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rated</option>
                    <option value="likes">Most Liked</option>
                    <option value="time">Cooking Time</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mr-2"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => handleTabChange('search')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'search'
                    ? 'border-[#78C841] text-[#78C841]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Search Results
              </button>
              <button
                onClick={() => handleTabChange('trending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trending'
                    ? 'border-[#78C841] text-[#78C841]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Trending
              </button>
              <button
                onClick={() => handleTabChange('popular')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'popular'
                    ? 'border-[#78C841] text-[#78C841]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Flame className="w-4 h-4 inline mr-2" />
                Popular
              </button>
              <button
                onClick={() => handleTabChange('recent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recent'
                    ? 'border-[#78C841] text-[#78C841]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock3 className="w-4 h-4 inline mr-2" />
                Recent
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search Results */}
            {activeTab === 'search' && (
              <div>
                {recipes.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Search Results ({recipes.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.map(renderRecipeCard)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recipes found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Trending Recipes */}
            {activeTab === 'trending' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Trending This Week</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingRecipes.map(renderRecipeCard)}
                </div>
              </div>
            )}

            {/* Popular Recipes */}
            {activeTab === 'popular' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Popular Recipes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularRecipes.map(renderRecipeCard)}
                </div>
              </div>
            )}

            {/* Recent Recipes */}
            {activeTab === 'recent' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recently Added</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentRecipes.map(renderRecipeCard)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
