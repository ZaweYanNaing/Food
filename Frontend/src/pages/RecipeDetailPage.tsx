import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Heart, Star, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import RecipeRatingReview from '../components/RecipeRatingReview';
import { toast } from 'react-toastify';

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  cooking_time: number;
  difficulty: string;
  image_url?: string;
  categories: string[];
  user_id: number;
  firstName: string;
  lastName: string;
  created_at: string;
}

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipe();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  const loadRecipe = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getRecipeById(parseInt(id!));
      
      if (response.success) {
        setRecipe(response.data);
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await apiService.getUserFavorites(user!.id);
      if (response.success && response.data) {
        const isFav = response.data.some((fav: any) => fav.id === parseInt(id!));
        setIsFavorited(isFav);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return;
    }

    try {
      const response = await apiService.toggleFavorite(user.id, parseInt(id!));
      if (response.success) {
        setIsFavorited(response.data.isFavorited);
        toast.success(response.message);
      } else {
        toast.error(response.message || 'Failed to update favorites');
      }
    } catch (error) {
      toast.error('Error updating favorites');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C841] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The recipe you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/recipe-management')}>
            Browse Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              {user && (
                <Button
                  variant="ghost"
                  onClick={handleToggleFavorite}
                  className={`flex items-center space-x-2 ${
                    isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
              
              {recipe.description && (
                <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>
              )}

              {/* Recipe Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#78C841]">
                    {formatCookingTime(recipe.cooking_time)}
                  </div>
                  <div className="text-sm text-gray-600">Cooking Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold px-4 py-2 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {recipe.categories?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>

              {/* Categories */}
              {recipe.categories && recipe.categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#78C841]/20 text-[#78C841] text-sm rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recipe Image */}
            {recipe.image_url && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                  {recipe.ingredients}
                </pre>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                  {recipe.instructions}
                </pre>
              </div>
            </div>

            {/* Ratings and Reviews - Featured Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
              <RecipeRatingReview
                recipeId={recipe.id}
                recipeTitle={recipe.title}
                onUpdate={() => {
                  // Refresh recipe data if needed
                  loadRecipe();
                }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipe Author</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#78C841]/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#78C841]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {recipe.firstName} {recipe.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created on {new Date(recipe.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3 w-full">
                {user && recipe.user_id === user.id && (
                  <Button
                    variant="outline"
                    className="w-full justify-start cursor-pointer"
                    onClick={() => navigate(`/`)}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start cursor-pointer"
                  onClick={() => navigate('/recipe-management')}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Browse More Recipes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
