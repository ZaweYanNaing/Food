import { useState, useEffect } from 'react';
import { BookOpen, Clock, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import RecipeForm from './RecipeForm';

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

interface UserRecipesProps {
  userId: number;
}

export default function UserRecipes({ userId }: UserRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserRecipes();
  }, [userId]);

  const loadUserRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUserRecipes(userId);
      
      if (response.success && response.data) {
        console.log('UserRecipes: Received data:', response.data);
        console.log('UserRecipes: Data type:', typeof response.data);
        console.log('UserRecipes: Is array:', Array.isArray(response.data));
        
        // Ensure we have an array of recipes
        const recipesData = Array.isArray(response.data) ? response.data : [];
        console.log('UserRecipes: Total recipes:', recipesData.length);
        
        setRecipes(recipesData);
      } else {
        setError('Failed to load recipes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    console.log('UserRecipes: Edit button clicked for recipe:', recipe);
    console.log('UserRecipes: Recipe user_id:', recipe.user_id);
    console.log('UserRecipes: Recipe categories:', recipe.categories);
    setEditingRecipe(recipe);
    setShowRecipeForm(true);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await apiService.deleteRecipe(recipeId, userId);
        if (response.success) {
          // Reload recipes after deletion
          loadUserRecipes();
        } else {
          setError('Failed to delete recipe');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#78C841]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadUserRecipes} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recipes Yet</h3>
        <p className="text-gray-600 mb-4">Start building your recipe collection by sharing your first recipe!</p>
        <Button onClick={() => navigate('/recipe-management/create')} className="bg-[#78C841] hover:bg-[#78C841]/90">
          <Plus className="w-4 h-4 mr-2" />
          Share Your First Recipe
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Recipe Collection</h2>
          <p className="text-gray-600 mt-1">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => navigate('/recipe-management/create')} className="bg-[#78C841] hover:bg-[#78C841]/90">
          <Plus className="w-4 h-4 mr-2" />
          Share New Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            
              <div className="w-full h-48 bg-gray-200 overflow-hidden items-center justify-center flex">
               {recipe.image_url ? (
                    <img
                      src={`http://localhost:8080${recipe.image_url}`}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-4xl">🍽️</div>
                  )}
              </div>
            
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{recipe.title}</h3>
              
              {recipe.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.cooking_time} min
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
              
                                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewRecipe(recipe)}
                        className="h-8 px-3"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRecipe(recipe)}
                        className="h-8 px-3"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="h-8 px-3 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Form Modal */}
      <RecipeForm
        isOpen={showRecipeForm}
        onClose={() => setShowRecipeForm(false)}
        recipe={editingRecipe}
        onSuccess={() => {
          loadUserRecipes();
          setShowRecipeForm(false);
        }}
      />
    </div>
  );
}
