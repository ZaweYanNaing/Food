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

  async getProfile(): Promise<ApiResponse> {
    return this.request('/users/profile');
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

  async getUserRecipes(userId: number): Promise<ApiResponse> {
    return this.request(`/recipes/user?user_id=${userId}`);
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
}

export const apiService = new ApiService();
export default apiService;
