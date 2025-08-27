import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, Eye, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-toastify';
import RecipeForm from '../components/RecipeForm';
import RecipeRatingReview from '../components/RecipeRatingReview';
 
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function RecipeManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    max_cooking_time: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadRecipes();
    loadCategories();
    if (user) {
      loadUserFavorites();
    }
  }, [user]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getRecipes();
      if (response.success) {
        console.log('Loaded recipes:', response.data);
        // Debug: Check user_id types
        response.data.forEach((recipe: Recipe, index: number) => {
          console.log(`Recipe ${index}: ID=${recipe.id}, user_id=${recipe.user_id}, user_id type=${typeof recipe.user_id}`);
        });
        setRecipes(response.data);
      } else {
        toast.error('Failed to load recipes');
      }
    } catch (error) {
      toast.error('Error loading recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadUserFavorites = async () => {
    if (!user) return;
    
    try {
      const response = await apiService.getUserFavorites(user.id);
      if (response.success && response.data) {
        const favoriteIds = new Set<number>(response.data.map((fav: any) => Number(fav.id)));
        setFavoriteRecipes(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading user favorites:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRecipes();
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.searchRecipes(searchQuery, {
        category: filters.category ? parseInt(filters.category) : undefined,
        difficulty: filters.difficulty || undefined,
        max_cooking_time: filters.max_cooking_time ? parseInt(filters.max_cooking_time) : undefined,
      });
      
      if (response.success) {
        setRecipes(response.data);
      } else {
        toast.error('Search failed');
      }
    } catch (error) {
      toast.error('Search error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const response = await apiService.deleteRecipe(recipeId, user.id);
      if (response.success) {
        toast.success('Recipe deleted successfully');
        loadRecipes();
      } else {
        toast.error(response.message || 'Failed to delete recipe');
      }
    } catch (error) {
      toast.error('Error deleting recipe');
    }
  };

  const handleToggleFavorite = async (recipeId: number) => {
    if (!user) {
      toast.error('You must be logged in to add favorites');
      return;
    }
    
    try {
      const response = await apiService.toggleFavorite(user.id, recipeId);
      if (response.success) {
        setFavoriteRecipes(prev => {
          const newSet = new Set(prev);
          if (newSet.has(recipeId)) {
            newSet.delete(recipeId);
            toast.success('Removed from favorites');
          } else {
            newSet.add(recipeId);
            toast.success('Added to favorites');
          }
          return newSet;
        });
      } else {
        toast.error(response.message || 'Failed to update favorite');
      }
    } catch (error) {
      toast.error('Error updating favorite');
    }
  };

 

  const handleEditRecipe = (recipe: Recipe) => {
    console.log('Edit button clicked for recipe:', recipe);
    console.log('Recipe user_id:', recipe.user_id, 'type:', typeof recipe.user_id);
    console.log('Current user ID:', user?.id, 'type:', typeof user?.id);
    console.log('User ID comparison:', recipe.user_id === user?.id);
    setEditingRecipe(recipe);
    setShowRecipeForm(true);
  };

  const handleCreateRecipe = () => {
    setEditingRecipe(null);
    setShowRecipeForm(true);
  };

  const handleRecipeFormSuccess = () => {
    loadRecipes();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      max_cooking_time: '',
    });
    loadRecipes();
  };

  const formatCookingTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
              case 'Easy': return 'bg-[#78C841]/20 text-[#78C841]';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && recipes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#78C841] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
              <p className="mt-2 text-gray-600">Create, edit, and manage your recipes</p>
            </div>
            <Button 
              className="bg-[#78C841] hover:bg-[#6bb03a]"
              onClick={handleCreateRecipe}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Recipe
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            {/* Search Button */}
            <Button onClick={handleSearch} className="bg-[#78C841] hover:bg-[#6bb03a]">
              Search
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                {/* Cooking Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Cooking Time (min)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 60"
                    value={filters.max_cooking_time}
                    onChange={(e) => setFilters({ ...filters, max_cooking_time: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
            <p className="text-gray-600">Get started by creating your first recipe!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Recipe Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
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

                {/* Recipe Content */}
                <div className="p-6">
                  {/* Title and Author */}
                  <div className="mb-3  flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        by {recipe.firstName} {recipe.lastName}
                      </p>
                    </div>

                    {/* Favorite Button */}
                    {user && (
                      <Tooltip>
                        <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => handleToggleFavorite(recipe.id)}
                          className={`h-10 w-10 p-0 cursor-pointer ${
                            favoriteRecipes.has(recipe.id)
                              ? 'text-red-500 hover:text-red-700'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favoriteRecipes.has(recipe.id) ? 'fill-current' : ''
                            }`}
                          />
                        </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {favoriteRecipes.has(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                        </TooltipContent>
                      </Tooltip>
                      )}
                  </div>

                  {/* Description */}
                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  {/* Recipe Details */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        ⏱️ {formatCookingTime(recipe.cooking_time)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Categories */}
                  {recipe.categories && recipe.categories.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {recipe.categories.slice(0, 3).map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#78C841]/20 text-[#78C841] text-xs rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                        {recipe.categories.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{recipe.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/recipe/${recipe.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      
                     
                      
                      {user && recipe.user_id === user.id && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditRecipe(recipe)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    
                    <span className="text-xs text-gray-400">
                      {new Date(recipe.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Form Modal */}
      <RecipeForm
        isOpen={showRecipeForm}
        onClose={() => setShowRecipeForm(false)}
        recipe={editingRecipe}
        onSuccess={handleRecipeFormSuccess}
      />

      {/* Recipe View Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                <div className="flex items-center space-x-2">
                  {/* Favorite Button in Modal */}
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(selectedRecipe.id)}
                      className={`h-10 w-10 p-0 ${
                        favoriteRecipes.has(selectedRecipe.id)
                          ? 'text-red-500 hover:text-red-700'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${
                          favoriteRecipes.has(selectedRecipe.id) ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                  )}
                  <button
                    onClick={() => setShowRecipeModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
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
                    {formatCookingTime(selectedRecipe.cooking_time)}
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
                    {selectedRecipe.categories?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>

              {/* Description */}
              {selectedRecipe.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedRecipe.description}</p>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">{selectedRecipe.ingredients}</pre>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">{selectedRecipe.instructions}</pre>
                </div>
              </div>

              {/* Ratings and Reviews */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ratings & Reviews</h3>
                <RecipeRatingReview
                  recipeId={selectedRecipe.id}
                  recipeTitle={selectedRecipe.title}
                  onUpdate={() => {
                    // Refresh favorites if needed
                    if (user) {
                      loadUserFavorites();
                    }
                  }}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Created by {selectedRecipe.firstName} {selectedRecipe.lastName} on{' '}
                  {new Date(selectedRecipe.created_at).toLocaleDateString()}
                </div>
                <Button onClick={() => setShowRecipeModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
