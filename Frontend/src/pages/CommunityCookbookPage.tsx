import { useState } from 'react';
import { Plus, Heart, MessageCircle, Share2, Clock, Users, Star, Filter, Search } from 'lucide-react';
import {Button} from '../components/ui/button';

interface CommunityRecipe {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  cuisineType: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  likes: number;
  comments: number;
  shares: number;
  rating: number;
  reviewCount: number;
  isLiked: boolean;
  tags: string[];
  createdAt: string;
}

interface CookingTip {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  category: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
}

export default function CommunityCookbookPage() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'tips'>('recipes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Sample data - replace with API calls
  const communityRecipes: CommunityRecipe[] = [
    {
      id: 1,
      title: "Grandma's Secret Apple Pie",
      description: "This recipe has been passed down through three generations. The secret is in the crust and the perfect balance of sweet and tart apples.",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      cuisineType: "American",
      difficultyLevel: "medium",
      prepTime: 45,
      cookTime: 60,
      servings: 8,
      likes: 156,
      comments: 23,
      shares: 12,
      rating: 4.9,
      reviewCount: 45,
      isLiked: true,
      tags: ["dessert", "baking", "family recipe", "fall"],
      createdAt: "2025-01-15"
    },
    {
      id: 2,
      title: "Quick Weeknight Stir-Fry",
      description: "A 20-minute stir-fry that's perfect for busy weeknights. Customize with whatever vegetables you have on hand!",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      author: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: false
      },
      cuisineType: "Asian",
      difficultyLevel: "easy",
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      likes: 89,
      comments: 15,
      shares: 8,
      rating: 4.6,
      reviewCount: 28,
      isLiked: false,
      tags: ["quick", "healthy", "vegetarian", "weeknight"],
      createdAt: "2025-01-14"
    },
    {
      id: 3,
      title: "Authentic Paella Valenciana",
      description: "Traditional Spanish paella made with saffron, chicken, rabbit, and fresh seafood. This is the real deal from Valencia!",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      author: {
        name: "Carmen Rodriguez",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      cuisineType: "Spanish",
      difficultyLevel: "hard",
      prepTime: 60,
      cookTime: 45,
      servings: 6,
      likes: 234,
      comments: 31,
      shares: 19,
      rating: 4.8,
      reviewCount: 67,
      isLiked: false,
      tags: ["Spanish", "seafood", "traditional", "special occasion"],
      createdAt: "2025-01-13"
    }
  ];

  const cookingTips: CookingTip[] = [
    {
      id: 1,
      title: "How to Perfectly Cook Rice Every Time",
      content: "The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results.",
      author: {
        name: "Chef Maria",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      category: "Cooking Techniques",
      likes: 89,
      comments: 12,
      isLiked: false,
      createdAt: "2025-01-15"
    },
    {
      id: 2,
      title: "Quick Knife Sharpening Hack",
      content: "Use the bottom of a ceramic mug to quickly sharpen your knives. The unglazed ring at the bottom works like a honing steel in a pinch!",
      author: {
        name: "Kitchen Pro Tom",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        isVerified: false
      },
      category: "Kitchen Hacks",
      likes: 156,
      comments: 23,
      isLiked: true,
      createdAt: "2025-01-14"
    },
    {
      id: 3,
      title: "Substitute Buttermilk with Milk + Vinegar",
      content: "Don't have buttermilk? Mix 1 cup milk with 1 tablespoon white vinegar or lemon juice. Let it sit for 5 minutes and you'll have perfect buttermilk for your recipes.",
      author: {
        name: "Baking Expert Lisa",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        isVerified: true
      },
      category: "Ingredient Substitutions",
      likes: 203,
      comments: 18,
      isLiked: false,
      createdAt: "2025-01-13"
    }
  ];

  const categories = ['all', 'Cooking Techniques', 'Kitchen Hacks', 'Ingredient Substitutions', 'Meal Planning', 'Food Safety'];

  const filteredRecipes = communityRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || recipe.cuisineType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredTips = cookingTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const sortedTips = [...filteredTips].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popular':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const toggleLike = (type: 'recipe' | 'tip', id: number) => {
    // Handle like toggle - update state or make API call
    console.log('Toggle like for', type, id);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
              case 'easy': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-100 to-Teal-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Community Cookbook
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Share your favorite recipes, cooking tips, and culinary experiences with the 
            FoodFusion community. Learn from fellow food enthusiasts and discover new techniques.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Plus className="w-5 h-5 mr-2" />
              Share Your Recipe
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Share a Cooking Tip
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes, tips, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                {activeTab === 'recipes' && <option value="rating">Highest Rated</option>}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'recipes'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Community Recipes ({filteredRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'tips'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Cooking Tips ({filteredTips.length})
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'recipes' ? (
            <div className="space-y-8">
              {sortedRecipes.map((recipe) => (
                <article key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                          <p className="text-gray-600 mb-4">{recipe.description}</p>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(recipe.difficultyLevel)}`}>
                            {recipe.difficultyLevel.charAt(0).toUpperCase() + recipe.difficultyLevel.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Recipe Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{recipe.prepTime + recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{recipe.servings} servings</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                          <span>{recipe.rating} ({recipe.reviewCount})</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{recipe.cuisineType}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recipe.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Author and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={recipe.author.avatar} 
                            alt={recipe.author.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{recipe.author.name}</span>
                              {recipe.author.isVerified && (
                                <span className="text-blue-600 text-sm">✓ Verified</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{recipe.createdAt}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleLike('recipe', recipe.id)}
                            className={`flex items-center space-x-1 text-sm transition-colors ${
                              recipe.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${recipe.isLiked ? 'fill-current' : ''}`} />
                            <span>{recipe.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                            <MessageCircle className="w-4 h-4" />
                            <span>{recipe.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                            <Share2 className="w-4 h-4" />
                            <span>{recipe.shares}</span>
                          </button>
                          <Button size="sm">View Recipe</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedTips.map((tip) => (
                <article key={tip.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 mb-4">{tip.content}</p>
                    </div>
                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {tip.category}
                    </span>
                  </div>

                  {/* Author and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={tip.author.avatar} 
                        alt={tip.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{tip.author.name}</span>
                          {tip.author.isVerified && (
                            <span className="text-blue-600 text-sm">✓ Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{tip.createdAt}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleLike('tip', tip.id)}
                        className={`flex items-center space-x-1 text-sm transition-colors ${
                          tip.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${tip.isLiked ? 'fill-current' : ''}`} />
                        <span>{tip.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
                        <MessageCircle className="w-4 h-4" />
                        <span>{tip.comments}</span>
                      </button>
                      <Button variant="outline" size="sm">Save Tip</Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {((activeTab === 'recipes' && sortedRecipes.length === 0) || 
            (activeTab === 'tips' && sortedTips.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <Button>Be the first to share!</Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Share Your Culinary Knowledge
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Whether it's a family recipe passed down through generations or a cooking tip 
            you've discovered, your knowledge can help others in their culinary journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Share a Recipe
            </Button>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Share a Tip
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
