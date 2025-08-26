import { useState } from 'react';
import { Download, Play, FileText, Video, Image, File, Clock, Users, Star, Search, Filter } from 'lucide-react';
import {Button} from '../components/ui/button';

interface CulinaryResource {
  id: number;
  title: string;
  description: string;
  type: 'recipe_card' | 'tutorial' | 'video' | 'infographic' | 'pdf';
  category: string;
  imageUrl: string;
  fileUrl: string;
  fileSize: number;
  downloadCount: number;
  duration?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
}

export default function CulinaryResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Sample data - replace with API calls
  const resources: CulinaryResource[] = [
    {
      id: 1,
      title: "Complete Knife Skills Guide",
      description: "Master essential knife techniques including chopping, dicing, julienning, and more. Perfect for beginners and intermediate cooks.",
      type: "pdf",
      category: "Cooking Techniques",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/knife-skills-guide.pdf",
      fileSize: 2048000,
      downloadCount: 1247,
      difficulty: "beginner",
      rating: 4.8,
      reviewCount: 89,
      isFeatured: true
    },
    {
      id: 2,
      title: "Bread Making Masterclass",
      description: "Step-by-step video tutorial covering everything from basic bread to sourdough. Learn the science behind bread making.",
      type: "video",
      category: "Baking",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/bread-making-masterclass.mp4",
      fileSize: 157286400,
      downloadCount: 892,
      duration: "45:30",
      difficulty: "intermediate",
      rating: 4.9,
      reviewCount: 156,
      isFeatured: true
    },
    {
      id: 3,
      title: "Quick Weeknight Dinner Recipes",
      description: "Collection of 20 recipes that can be prepared in 30 minutes or less. Perfect for busy families.",
      type: "recipe_card",
      category: "Meal Planning",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/quick-dinner-recipes.pdf",
      fileSize: 512000,
      downloadCount: 2156,
      difficulty: "beginner",
      rating: 4.6,
      reviewCount: 234,
      isFeatured: false
    },
    {
      id: 4,
      title: "Kitchen Safety Infographic",
      description: "Essential safety tips and best practices for the kitchen. A must-have for every home cook.",
      type: "infographic",
      category: "Food Safety",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/kitchen-safety.png",
      fileSize: 256000,
      downloadCount: 3421,
      difficulty: "beginner",
      rating: 4.7,
      reviewCount: 178,
      isFeatured: false
    },
    {
      id: 5,
      title: "Advanced Pasta Making",
      description: "Learn to make fresh pasta from scratch, including different shapes and fillings. For experienced cooks.",
      type: "tutorial",
      category: "Cooking Techniques",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/pasta-making-tutorial.pdf",
      fileSize: 1024000,
      downloadCount: 567,
      difficulty: "advanced",
      rating: 4.9,
      reviewCount: 67,
      isFeatured: false
    },
    {
      id: 6,
      title: "Seasonal Ingredient Guide",
      description: "Monthly guide to seasonal produce with storage tips and recipe suggestions.",
      type: "pdf",
      category: "Ingredient Guides",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/seasonal-ingredients.pdf",
      fileSize: 768000,
      downloadCount: 1893,
      difficulty: "beginner",
      rating: 4.5,
      reviewCount: 145,
      isFeatured: false
    }
  ];

  const categories = ['all', 'Cooking Techniques', 'Baking', 'Meal Planning', 'Food Safety', 'Ingredient Guides'];
  const types = ['all', 'recipe_card', 'tutorial', 'video', 'infographic', 'pdf'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'infographic': return Image;
      case 'recipe_card': return FileText;
      case 'tutorial': return FileText;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'pdf': return 'bg-blue-100 text-blue-800';
              case 'infographic': return 'bg-blue-100 text-blue-800';
      case 'recipe_card': return 'bg-purple-100 text-purple-800';
      case 'tutorial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
              case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (resource: CulinaryResource) => {
    // Handle download - could be direct download or redirect to download page
    console.log('Downloading:', resource.title);
    // For demo purposes, show an alert
    alert(`Downloading ${resource.title}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-100 to-Teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Culinary Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access downloadable recipe cards, cooking tutorials, and instructional videos 
            on various cooking techniques and kitchen hacks. Enhance your culinary skills 
            with our comprehensive resource library.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for resources, techniques, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {filteredResources.filter(r => r.isFeatured).length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.filter(r => r.isFeatured).map((resource) => (
                <article key={resource.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-lg overflow-hidden border-2 border-orange-200">
                  <div className="relative">
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-orange-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{resource.rating} ({resource.reviewCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{resource.downloadCount} downloads</span>
                      </div>
                      <span>{formatFileSize(resource.fileSize)}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleDownload(resource)}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Now
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Resources</h2>
            <p className="text-gray-600">
              Showing {filteredResources.length} of {resources.length} resources
            </p>
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <article key={resource.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    {resource.duration && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-1 bg-black bg-opacity-75 text-white text-xs font-medium rounded-full">
                          {resource.duration}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{resource.downloadCount}</span>
                      </div>
                      <span>{formatFileSize(resource.fileSize)}</span>
                    </div>
                    
                    <Button 
                      onClick={() => handleDownload(resource)}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Let us know what resources would be most helpful for your culinary journey. 
            We're constantly adding new content based on community requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Request a Resource
            </Button>
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Browse All Resources
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
