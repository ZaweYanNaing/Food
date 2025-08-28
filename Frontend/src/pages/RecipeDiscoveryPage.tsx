import { useState, useEffect } from 'react';
import { Star, Heart, Clock, TrendingUp, Flame, Clock3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '../services/api';

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

export default function RecipeDiscoveryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<'trending' | 'popular' | 'recent'>('trending');

  useEffect(() => {
    loadInitialData();
    
    // Check URL parameters for initial tab
    const tab = searchParams.get('tab') as 'trending' | 'popular' | 'recent';
    
    if (tab && ['trending', 'popular', 'recent'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const loadInitialData = async () => {
    try {
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

  const handleTabChange = (tab: 'trending' | 'popular' | 'recent') => {
    setActiveTab(tab);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Discovery</h1>
          <p className="text-gray-600">Explore trending, popular, and recently added recipes</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
