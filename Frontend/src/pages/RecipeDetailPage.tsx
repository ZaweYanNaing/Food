import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Star, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import RecipeRatingReview from '../components/RecipeRatingReview';


interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit?: string;
  }> | string;
  instructions: string;
  cooking_time: number;
  difficulty: string;
  image_url?: string;
  categories: string[];
  cuisine_type?: string;
  servings?: number;
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
  const viewTracked = useRef(false);

  useEffect(() => {
    if (id) {
      loadRecipe();
      // Track the view when the page loads (only once per recipe)
      if (!viewTracked.current) {
        trackView();
        viewTracked.current = true;
      }
    }
  }, [id]);

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

  const trackView = async () => {
    try {
      const recipeId = parseInt(id!);
      const viewKey = `recipe_view_${recipeId}_${user?.id || 'anonymous'}`;
      
      // Check if we've already tracked this view in this session
      const lastViewTime = localStorage.getItem(viewKey);
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (lastViewTime && (now - parseInt(lastViewTime)) < fiveMinutes) {
        console.log('View already tracked recently, skipping');
        return;
      }
      
      // For anonymous users, also check sessionStorage for extra protection
      if (!user) {
        const sessionKey = `session_view_${recipeId}`;
        if (sessionStorage.getItem(sessionKey)) {
          console.log('Anonymous view already tracked in this session, skipping');
          return;
        }
        sessionStorage.setItem(sessionKey, '1');
      }
      
      // Track the view
      await apiService.trackRecipeView(recipeId, user?.id);
      
      // Store the timestamp to prevent duplicate tracking
      localStorage.setItem(viewKey, now.toString());
      
    } catch (error) {
      // Silently fail - view tracking shouldn't break the user experience
      console.warn('Failed to track recipe view:', error);
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                {recipe.servings && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {recipe.servings}
                    </div>
                    <div className="text-sm text-gray-600">Servings</div>
                  </div>
                )}
                {recipe.cuisine_type && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {recipe.cuisine_type}
                    </div>
                    <div className="text-sm text-gray-600">Cuisine</div>
                  </div>
                )}
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
                  src={recipe.image_url.startsWith('http') 
                    ? recipe.image_url 
                    : `http://localhost:8080${recipe.image_url}`}
                  alt={recipe.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                {Array.isArray(recipe.ingredients) ? (
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="text-gray-700 font-medium">
                          {ingredient.name}
                        </span>
                        <span className="text-gray-600">
                          {ingredient.quantity}
                          {ingredient.unit && ` ${ingredient.unit}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                    {recipe.ingredients}
                  </pre>
                )}
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
