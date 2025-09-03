const API_BASE_URL = '/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
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
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
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
    ingredients: Array<{
      name: string;
      quantity: string;
      unit?: string;
    }>;
    instructions: string;
    cooking_time?: number;
    difficulty?: string;
    categories?: number[];
    cuisine_type?: string;
    servings?: number;
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
    ingredients: Array<{
      name: string;
      quantity: string;
      unit?: string;
    }>;
    instructions: string;
    cooking_time?: number;
    difficulty?: string;
    categories?: number[];
    cuisine_type?: string;
    servings?: number;
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

  // Recipe rating and review functionality (combined)
  async addRecipeRatingReview(userId: number, recipeId: number, rating: number, reviewText: string): Promise<ApiResponse> {
    return this.request('/recipes/rate-review', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, recipe_id: recipeId, rating, review_text: reviewText }),
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

  async getIngredients(): Promise<ApiResponse> {
    try {
      const response = await this.request('/recipes/ingredients');
      return response;
    } catch (error) {
      console.error('Error getting ingredients:', error);
      return { success: false, message: 'Failed to get ingredients' };
    }
  }

  // Recipe view tracking
  async trackRecipeView(recipeId: number, userId?: number): Promise<ApiResponse> {
    try {
      const response = await this.request(`/recipes/${recipeId}/view`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId }),
      });
      return response;
    } catch (error) {
      console.error('Error tracking recipe view:', error);
      return { success: false, message: 'Failed to track recipe view' };
    }
  }

  // Cooking Tips endpoints
  async getCookingTips(filters?: {
    user_id?: number;
    search?: string;
    current_user_id?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.user_id) queryParams.append('user_id', filters.user_id.toString());
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.current_user_id) queryParams.append('current_user_id', filters.current_user_id.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cooking-tips?${queryString}` : '/cooking-tips';
    return this.request(endpoint);
  }

  async getCookingTipById(id: number, userId?: number): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (userId) queryParams.append('user_id', userId.toString());
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cooking-tips/${id}?${queryString}` : `/cooking-tips/${id}`;
    return this.request(endpoint);
  }

  async createCookingTip(tipData: {
    title: string;
    content: string;
    user_id: number;
    prep_time?: number;
  }): Promise<ApiResponse> {
    return this.request('/cooking-tips', {
      method: 'POST',
      body: JSON.stringify(tipData),
    });
  }

  async updateCookingTip(id: number, tipData: {
    title: string;
    content: string;
    user_id: number;
    prep_time?: number;
  }): Promise<ApiResponse> {
    return this.request(`/cooking-tips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tipData),
    });
  }

  async deleteCookingTip(id: number, userId: number): Promise<ApiResponse> {
    return this.request(`/cooking-tips/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async searchCookingTips(query: string): Promise<ApiResponse> {
    const queryParams = new URLSearchParams({ q: query });
    return this.request(`/cooking-tips/search?${queryParams.toString()}`);
  }

  async getRecentCookingTips(limit: number = 10): Promise<ApiResponse> {
    return this.request(`/cooking-tips/recent?limit=${limit}`);
  }

  async toggleCookingTipLike(userId: number, tipId: number): Promise<ApiResponse> {
    return this.request('/cooking-tips/like', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, tip_id: tipId }),
    });
  }

  async getUserCookingTips(userId: number): Promise<ApiResponse> {
    return this.request(`/cooking-tips/user?user_id=${userId}`);
  }

  async getCookingTipLikes(tipId: number, limit?: number): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cooking-tips/${tipId}/likes?${queryString}` : `/cooking-tips/${tipId}/likes`;
    return this.request(endpoint);
  }



  // Analytics endpoints
  async getMostLikedCookingTips(limit?: number, period?: string): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (period) queryParams.append('period', period);
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cooking-tips/most-liked?${queryString}` : '/cooking-tips/most-liked';
    return this.request(endpoint);
  }

  async getTrendingCookingTips(limit?: number): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cooking-tips/trending?${queryString}` : '/cooking-tips/trending';
    return this.request(endpoint);
  }

  // Contact endpoints
  async submitContactMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getContactMessages(filters?: {
    status?: string;
    search?: string;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.search) queryParams.append('search', filters.search);
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/contact?${queryString}` : '/contact';
    return this.request(endpoint);
  }

  async getContactMessageById(id: number): Promise<ApiResponse> {
    return this.request(`/contact/${id}`);
  }

  async updateContactMessageStatus(id: number, status: string): Promise<ApiResponse> {
    return this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getContactMessageStats(): Promise<ApiResponse> {
    return this.request('/contact/stats');
  }

  // Educational Resources endpoints
  async getEducationalResources(filters?: {
    type?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.search) queryParams.append('search', filters.search);
    if (filters?.sort) queryParams.append('sort', filters.sort);
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());
    if (filters?.offset) queryParams.append('offset', filters.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/educational-resources?${queryString}` : '/educational-resources';
    return this.request(endpoint);
  }

  async getEducationalResourceById(id: number): Promise<ApiResponse> {
    return this.request(`/educational-resources/${id}`);
  }

  async createEducationalResource(resourceData: {
    title: string;
    description: string;
    type: string;
    file_path?: string;
    created_by?: number;
  }): Promise<ApiResponse> {
    return this.request('/educational-resources', {
      method: 'POST',
      body: JSON.stringify(resourceData),
    });
  }

  async uploadEducationalResource(formData: FormData): Promise<ApiResponse> {
    return this.request('/educational-resources', {
      method: 'POST',
      body: formData,
    });
  }

  async updateEducationalResource(id: number, resourceData: any): Promise<ApiResponse> {
    return this.request(`/educational-resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData),
    });
  }

  async deleteEducationalResource(id: number): Promise<ApiResponse> {
    return this.request(`/educational-resources/${id}`, {
      method: 'DELETE',
    });
  }



  async getEducationalResourceStatistics(): Promise<ApiResponse> {
    return this.request('/educational-resources/statistics');
  }

  async downloadEducationalResource(id: number): Promise<void> {
    try {
      // Create a hidden link and trigger download
      // Use direct backend URL since download.php is not in the API directory
      const downloadUrl = `http://localhost:8080/download.php/${id}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.style.display = 'none';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
