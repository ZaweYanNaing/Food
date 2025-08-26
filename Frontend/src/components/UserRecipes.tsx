import { useState, useEffect } from 'react';
import { BookOpen, Clock, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  difficulty: string;
  image_url?: string;
  created_at: string;
}

interface UserRecipesProps {
  userId: number;
}

export default function UserRecipes({ userId }: UserRecipesProps) {
  const [recipes, setRecipes] = useState<Record<string, Recipe[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setRecipes(response.data);
      } else {
        setError('Failed to load recipes');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRecipe = (recipeId: number) => {
                    navigate(`/recipe-management/edit/${recipeId}`);
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

  const totalRecipes = Object.values(recipes).reduce((acc, categoryRecipes) => acc + categoryRecipes.length, 0);

  if (totalRecipes === 0) {
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
        <h2 className="text-2xl font-bold text-gray-900">My Recipe Collection</h2>
        <Button onClick={() => navigate('/recipe-management/create')} className="bg-[#78C841] hover:bg-[#78C841]/90">
          <Plus className="w-4 h-4 mr-2" />
          Share New Recipe
        </Button>
      </div>

      {Object.entries(recipes).map(([category, categoryRecipes]) => (
        <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#78C841] to-[#B4E50D] px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {category}
              <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
                {categoryRecipes.length} recipe{categoryRecipes.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {recipe.image_url && (
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src={recipe.image_url} 
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h4>
                  
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
                        onClick={() => handleEditRecipe(recipe.id)}
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
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
