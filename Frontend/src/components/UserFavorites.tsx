import { useState, useEffect } from 'react';
import { Heart, Clock, User, Trash2, RefreshCw } from 'lucide-react';
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

  const handleViewRecipe = (recipeId: number) => {
                  navigate(`/recipe-management/${recipeId}`);
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
                  onClick={() => handleViewRecipe(recipe.id)}
                  className="bg-[#78C841] hover:bg-[#78C841]/90"
                >
                  View Recipe
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
