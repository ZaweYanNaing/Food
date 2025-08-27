const API_BASE_URL = 'http://localhost:8080/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  token?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (options.body instanceof FormData) {
      const headers = { ...defaultOptions.headers };
      delete (headers as any)['Content-Type'];
      defaultOptions.headers = headers;
    }

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const response = await fetch(url, defaultOptions);
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to backend server. Please ensure the backend is running on ${this.baseUrl}`);
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown network error occurred');
      }
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
  }

  async getProfile(userId?: number): Promise<ApiResponse> {
    if (userId) {
      // If user ID is provided, we can use it for debugging
      // In a real app, this would be passed as a query parameter or in the request body
      return this.request(`/users/profile?user_id=${userId}`);
    }
    return this.request('/users/profile');
  }

  async updateProfile(profileData: {
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    location?: string;
    website?: string;
    profile_image?: string;
    user_id?: number;
  }): Promise<ApiResponse> {
    // Add user_id to the request if not already present
    const requestData = {
      ...profileData,
      user_id: profileData.user_id || 1 // Default to user ID 1 if not provided
    };
    
    console.log('=== API Service: Updating profile ===');
    console.log('Request data:', requestData);
    
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async getUserStats(userId: number): Promise<ApiResponse> {
    return this.request(`/users/stats?user_id=${userId}`);
  }

  async getUserRecipes(userId: number): Promise<ApiResponse> {
    return this.request(`/users/recipes?user_id=${userId}`);
  }

  async getUserFavorites(userId: number): Promise<ApiResponse> {
    return this.request(`/users/favorites?user_id=${userId}`);
  }

  async getUserActivity(userId: number, limit?: number): Promise<ApiResponse> {
    const queryParams = new URLSearchParams({ user_id: userId.toString() });
    if (limit) queryParams.append('limit', limit.toString());
    return this.request(`/users/activity?${queryParams.toString()}`);
  }

  async toggleFavorite(userId: number, recipeId: number): Promise<ApiResponse> {
    return this.request('/users/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
    });
  }

  async cleanupDuplicateFavorites(userId: number): Promise<ApiResponse> {
    return this.request('/users/favorites/cleanup', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Recipe endpoints
  async getRecipes(filters?: {
    category?: number;
    difficulty?: string;
    max_cooking_time?: number;
    user_id?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.category) queryParams.append('category', filters.category.toString());
    if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters?.max_cooking_time) queryParams.append('max_cooking_time', filters.max_cooking_time.toString());
    if (filters?.user_id) queryParams.append('user_id', filters.user_id.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/recipes?${queryString}` : '/recipes';
    return this.request(endpoint);
  }

  async getRecipeById(id: number): Promise<ApiResponse> {
    return this.request(`/recipes/${id}`);
  }

  async createRecipe(recipeData: {
    title: string;
    description?: string;
    ingredients: string;
    instructions: string;
    cooking_time?: number;
    difficulty?: string;
    categories?: number[];
    image_url?: string;
  }): Promise<ApiResponse> {
    return this.request('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  }

  async updateRecipe(id: number, recipeData: {
    title: string;
    description?: string;
    ingredients: string;
    instructions: string;
    cooking_time?: number;
    difficulty?: string;
    categories?: number[];
    image_url?: string;
  }): Promise<ApiResponse> {
    return this.request(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recipeData),
    });
  }

  async deleteRecipe(id: number, userId: number): Promise<ApiResponse> {
    return this.request(`/recipes/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async searchRecipes(query: string, filters?: {
    category?: number;
    difficulty?: string;
    max_cooking_time?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams({ q: query });
    if (filters?.category) queryParams.append('category', filters.category.toString());
    if (filters?.difficulty) queryParams.append('difficulty', filters.difficulty);
    if (filters?.max_cooking_time) queryParams.append('max_cooking_time', filters.max_cooking_time.toString());
    
    return this.request(`/recipes/search?${queryParams.toString()}`);
  }

  async getCategories(): Promise<ApiResponse> {
    return this.request('/recipes/categories');
  }

  async uploadImage(imageFile: File, userId: number): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', userId.toString());
    
    return this.request('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }

  async uploadProfileImage(imageFile: File, userId: number): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', userId.toString());
    
    console.log('=== API Service: Uploading profile image ===');
    console.log('User ID:', userId);
    console.log('File:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    console.log('Current token:', localStorage.getItem('token'));
    
    try {
      const response = await this.request('/users/profile/image', {
        method: 'POST',
        body: formData,
        headers: {}, // Don't set Content-Type for FormData
      });
      
      console.log('Profile image upload response:', response);
      return response;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  }

  // Recipe like functionality
  async toggleRecipeLike(userId: number, recipeId: number): Promise<ApiResponse> {
    return this.request('/recipes/like', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId }),
    });
  }

  // Recipe rating functionality
  async addRecipeRating(userId: number, recipeId: number, rating: number): Promise<ApiResponse> {
    return this.request('/recipes/rate', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId, rating }),
    });
  }

  // Recipe review functionality
  async addRecipeReview(userId: number, recipeId: number, reviewText: string, ratingId?: number): Promise<ApiResponse> {
    return this.request('/recipes/review', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId, review_text: reviewText, rating_id: ratingId }),
    });
  }

  // Get recipe ratings and reviews
  async getRecipeRatingsReviews(recipeId: number): Promise<ApiResponse> {
    return this.request(`/recipes/${recipeId}/ratings-reviews`);
  }

  // Get user's ratings and reviews
  async getUserRatingsReviews(userId: number): Promise<ApiResponse> {
    return this.request(`/users/${userId}/ratings-reviews`);
  }

  // Get user's status for a specific recipe (like, rating, review)
  async getUserRecipeStatus(userId: number, recipeId: number): Promise<ApiResponse> {
    return this.request(`/recipes/${recipeId}/user-status?user_id=${userId}`);
  }

  // Advanced Search & Discovery Methods
  async getTrendingRecipes(limit: number = 10, period: string = 'week'): Promise<ApiResponse> {
    try {
      const response = await this.request(`/recipes/trending?limit=${limit}&period=${period}`);
      return response;
    } catch (error) {
      console.error('Error getting trending recipes:', error);
      return { success: false, message: 'Failed to get trending recipes' };
    }
  }

  async getPopularRecipes(limit: number = 10): Promise<ApiResponse> {
    try {
      const response = await this.request(`/recipes/popular?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error getting popular recipes:', error);
      return { success: false, message: 'Failed to get popular recipes' };
    }
  }

  async getRecentRecipes(limit: number = 10): Promise<ApiResponse> {
    try {
      const response = await this.request(`/recipes/recent?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error getting recent recipes:', error);
      return { success: false, message: 'Failed to get recent recipes' };
    }
  }

  async getCuisineTypes(): Promise<ApiResponse> {
    try {
      const response = await this.request('/recipes/cuisine-types');
      return response;
    } catch (error) {
      console.error('Error getting cuisine types:', error);
      return { success: false, message: 'Failed to get cuisine types' };
    }
  }

  async getDifficultyLevels(): Promise<ApiResponse> {
    try {
      const response = await this.request('/recipes/difficulty-levels');
      return response;
    } catch (error) {
      console.error('Error getting difficulty levels:', error);
      return { success: false, message: 'Failed to get difficulty levels' };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
