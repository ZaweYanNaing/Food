import { useState, useEffect } from 'react';
import { Heart, Clock, User, Trash2, RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-toastify';

interface FavoriteRecipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  difficulty: string;
  image_url?: string;
  firstName: string;
  lastName: string;
  category_name?: string;
  created_at: string;
}

interface UserFavoritesProps {
  userId: number;
}

export default function UserFavorites({ userId }: UserFavoritesProps) {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<FavoriteRecipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserFavorites();
  }, [userId]);

  // Refresh favorites when user returns to the page
  useEffect(() => {
    const handleFocus = () => {
      loadUserFavorites();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadUserFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUserFavorites(userId);
      
      if (response.success && response.data) {
        // Remove duplicates by recipe ID to prevent showing the same recipe multiple times
        const uniqueFavorites = response.data.filter((recipe: any, index: number, self: any[]) => 
          index === self.findIndex((r: any) => r.id === recipe.id)
        );
        
        // Log for debugging
        if (uniqueFavorites.length !== response.data.length) {
          console.warn(`Removed ${response.data.length - uniqueFavorites.length} duplicate favorites`);
          console.warn('Duplicate recipe IDs:', response.data.filter((recipe: any, index: number, self: any[]) => 
            index !== self.findIndex((r: any) => r.id === recipe.id)
          ).map((r: any) => r.id));
        }
        
        setFavorites(uniqueFavorites);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId: number) => {
    try {
      const response = await apiService.toggleFavorite(userId, recipeId);
      if (response.success) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== recipeId));
      } else {
        setError('Failed to remove from favorites');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      const response = await apiService.cleanupDuplicateFavorites(userId);
      if (response.success) {
        toast.success(response.message || 'Duplicates cleaned up successfully');
        // Reload favorites to show the cleaned up list
        await loadUserFavorites();
      } else {
        toast.error(response.message || 'Failed to clean up duplicates');
      }
    } catch (err) {
      toast.error('Failed to clean up duplicates');
    }
  };

  const handleViewRecipe = (recipe: FavoriteRecipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
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
        <Button onClick={loadUserFavorites} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorite Recipes Yet</h3>
        <p className="text-gray-600 mb-4">Start exploring recipes and add your favorites to this collection!</p>
                        <Button onClick={() => navigate('/recipe-management')} className="bg-[#78C841] hover:bg-[#78C841]/90">
                  Browse Recipes
                </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Favorite Recipes</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadUserFavorites}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCleanupDuplicates}
            className="flex items-center space-x-2 text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            <Trash2 className="w-4 h-4" />
            Clean Duplicates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((recipe) => (
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
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{recipe.title}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {recipe.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
              )}
              
              <div className="flex items-center space-x-2 mb-3 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {recipe.firstName} {recipe.lastName}
                </div>
              </div>
              
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
              
              {recipe.category_name && (
                <div className="mb-3">
                  <span className="inline-block bg-[#78C841]/10 text-[#78C841] text-xs px-2 py-1 rounded-full">
                    {recipe.category_name}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Added {new Date(recipe.created_at).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleViewRecipe(recipe)}
                  className="bg-[#78C841] hover:bg-[#78C841]/90"
                >
                  View Recipe
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe View Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                <button
                  onClick={() => setShowRecipeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recipe Image */}
              {selectedRecipe.image_url && (
                <div className="mb-6">
                  <img
                    src={selectedRecipe.image_url}
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Recipe Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#78C841]">
                    {selectedRecipe.cooking_time} min
                  </div>
                  <div className="text-sm text-gray-600">Cooking Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold px-4 py-2 rounded-full ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                    {selectedRecipe.difficulty}
                  </div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedRecipe.category_name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600">Category</div>
                </div>
              </div>

              {/* Description */}
              {selectedRecipe.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedRecipe.description}</p>
                </div>
              )}

              {/* Author Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Author</h3>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{selectedRecipe.firstName} {selectedRecipe.lastName}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Added to favorites on {new Date(selectedRecipe.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRemoveFavorite(selectedRecipe.id);
                      setShowRecipeModal(false);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from Favorites
                  </Button>
                  <Button onClick={() => setShowRecipeModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
