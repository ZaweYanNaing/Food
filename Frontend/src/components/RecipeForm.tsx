import { useState, useEffect, useRef } from 'react';
import { X, Upload, } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-toastify';

interface RecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe | null;
  onSuccess: () => void;
}

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
  categories: string[] | number[];
  cuisine_type?: string;
  servings?: number;
  image_url?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Ingredient {
  id: number;
  name: string;
  description: string;
}

interface CuisineType {
  id: number;
  name: string;
  description: string;
}

export default function RecipeForm({ isOpen, onClose, recipe, onSuccess }: RecipeFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setIngredients] = useState<Ingredient[]>([]);
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [] as Array<{
      name: string;
      quantity: string;
      unit: string;
    }>,
    instructions: '',
    cooking_time: '',
    difficulty: 'Medium',
    categories: [] as number[],
    cuisine_type: '',
    servings: '',
    image_url: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      loadIngredients();
      loadCuisineTypes();
    }
  }, [isOpen]); // Only run when isOpen changes

  useEffect(() => {
    if (isOpen && recipe) {
      // Convert category names to IDs if they're strings
      let categoryIds: number[] = [];
      if (recipe.categories && recipe.categories.length > 0) {
        if (typeof recipe.categories[0] === 'string') {
          // Categories are strings (names), find their IDs
          categoryIds = (recipe.categories as string[]).map(catName => {
            const category = categories.find(c => c.name === catName);
            return category ? category.id : 0;
          }).filter(id => id !== 0);
        } else {
          // Categories are already IDs
          categoryIds = recipe.categories as number[];
        }
      }
      
      // Handle ingredients - convert from string to array if needed
      let ingredientsArray: Array<{name: string; quantity: string; unit: string}> = [];
      if (Array.isArray(recipe.ingredients)) {
        ingredientsArray = recipe.ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit || ''
        }));
      } else if (typeof recipe.ingredients === 'string') {
        // Convert old string format to array format
        ingredientsArray = [{ name: recipe.ingredients, quantity: '', unit: '' }];
      }
      
      setFormData({
        title: recipe.title,
        description: recipe.description,
        ingredients: ingredientsArray,
        instructions: recipe.instructions,
        cooking_time: recipe.cooking_time.toString(),
        difficulty: recipe.difficulty,
        categories: categoryIds,
        cuisine_type: recipe.cuisine_type || '',
        servings: recipe.servings?.toString() || '',
        image_url: recipe.image_url || '',
      });
      
      // Set image preview if recipe has an image
      if (recipe.image_url) {
        // Ensure we have the full URL for the image preview
        const fullImageUrl = recipe.image_url.startsWith('http') 
          ? recipe.image_url 
          : `http://localhost:8080${recipe.image_url}`;
        setImagePreview(fullImageUrl);
        setImageFile(null); // No file selected when editing
      } else {
        setImagePreview('');
        setImageFile(null);
      }
    } else if (isOpen && !recipe) {
      resetForm();
    }
  }, [isOpen, recipe, categories]); // Run when these change

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

  const loadIngredients = async () => {
    try {
      const response = await apiService.getIngredients();
      if (response.success) {
        setIngredients(response.data);
      }
    } catch (error) {
      console.error('Error loading ingredients:', error);
    }
  };

  const loadCuisineTypes = async () => {
    try {
      const response = await apiService.getCuisineTypes();
      if (response.success) {
        setCuisineTypes(response.data);
      }
    } catch (error) {
      console.error('Error loading cuisine types:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      ingredients: [],
      instructions: '',
      cooking_time: '',
      difficulty: 'Medium',
      categories: [],
      cuisine_type: '',
      servings: '',
      image_url: '',
    });
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Use functional state update to ensure we get the latest state
    setFormData(prevFormData => {
      const newFormData = {
        ...prevFormData,
        [name]: value
      };
      return newFormData;
    });
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create recipes');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error('Recipe title is required');
      return;
    }
    if (!formData.ingredients.length) {
      toast.error('At least one ingredient is required');
      return;
    }
    if (!formData.instructions.trim()) {
      toast.error('Instructions are required');
      return;
    }

    setIsLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      // Upload image first if a new image was selected
      if (imageFile) {
        try {
          console.log('Starting image upload for file:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
          const uploadResponse = await apiService.uploadImage(imageFile, user.id);
          console.log('Upload response:', uploadResponse);
          
          if (uploadResponse.success) {
            finalImageUrl = uploadResponse.data.image_url;
            console.log('Image uploaded successfully:', finalImageUrl);
          } else {
            throw new Error(uploadResponse.message || 'Image upload failed');
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error('Failed to upload image. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      const recipeData = {
        ...formData,
        cooking_time: formData.cooking_time ? parseInt(formData.cooking_time) : undefined,
        servings: formData.servings ? parseInt(formData.servings) : undefined,
        user_id: user.id,
        image_url: finalImageUrl,
      };

      console.log('Sending recipe data:', recipeData);
      console.log('Recipe object:', recipe);
      console.log('User ID from user:', user.id);
      console.log('User ID type:', typeof user.id);

      let response;
      if (recipe) {
        // Update existing recipe
        console.log('Updating recipe with ID:', recipe.id);
        response = await apiService.updateRecipe(recipe.id, recipeData);
        console.log('Update response:', response);
      } else {
        // Create new recipe
        response = await apiService.createRecipe(recipeData);
      }

      if (response.success) {
        toast.success(recipe ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        onSuccess();
        onClose();
        resetForm();
      } else {
        toast.error(response.message || 'Failed to save recipe');
      }
    } catch (error) {
      toast.error('Error saving recipe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title and Description */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter recipe title"
                required
                // disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe your recipe (optional)"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Cooking Time and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cooking_time" className="block text-sm font-medium text-gray-700 mb-2">
                Cooking Time (minutes)
              </label>
              <input
                type="number"
                id="cooking_time"
                name="cooking_time"
                value={formData.cooking_time}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 45"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    disabled={isLoading}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cuisine Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type
            </label>
            <select
              id="cuisine_type"
              name="cuisine_type"
              value={formData.cuisine_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="">Select Cuisine Type</option>
              {cuisineTypes.map(cuisineType => (
                <option key={cuisineType.id} value={cuisineType.name}>{cuisineType.name}</option>
              ))}
            </select>
          </div>

          {/* Servings */}
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 4"
              disabled={isLoading}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image
            </label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mb-4">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            {/* Upload controls */}
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {imageFile ? 'Change Image' : 'Select Image'}
              </Button>
            </div>
            
            {/* Help text */}
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF. Max size: 5MB. Image will be uploaded when you save the recipe.
            </p>
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    name={`ingredient_${index}_name`}
                    value={ingredient.name}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index] = { ...newIngredients[index], name: e.target.value };
                      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ingredient name"
                    required
                    disabled={isLoading}
                  />
                  <input
                    type="number"
                    name={`ingredient_${index}_quantity`}
                    value={ingredient.quantity}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index] = { ...newIngredients[index], quantity: e.target.value };
                      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Quantity"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    name={`ingredient_${index}_unit`}
                    value={ingredient.unit}
                    onChange={(e) => {
                      const newIngredients = [...formData.ingredients];
                      newIngredients[index] = { ...newIngredients[index], unit: e.target.value };
                      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Unit"
                    disabled={isLoading}
                  />

                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }] }))}
              disabled={isLoading}
              className="mt-4"
            >
              Add Ingredient
            </Button>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Step-by-step cooking instructions"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Write clear, step-by-step instructions for cooking
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {recipe ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {recipe ? 'Update Recipe' : 'Create Recipe'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
