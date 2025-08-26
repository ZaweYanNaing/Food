import { useState } from 'react';
import { Download, Play, FileText, Video, Image, File, Clock, Users, Star, Search, Filter, BookOpen, Lightbulb, Leaf, Zap } from 'lucide-react';
import {Button} from '../components/ui/button';

interface EducationalResource {
  id: number;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'infographic' | 'presentation' | 'worksheet';
  category: string;
  imageUrl: string;
  fileUrl: string;
  fileSize: number;
  downloadCount: number;
  duration?: string;
  gradeLevel: 'elementary' | 'middle' | 'high' | 'adult';
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  tags: string[];
}

export default function EducationalResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('all');

  // Sample data - replace with API calls
  const resources: EducationalResource[] = [
    {
      id: 1,
      title: "Introduction to Solar Energy",
      description: "Comprehensive guide explaining how solar panels work, their benefits, and their role in renewable energy systems.",
      type: "pdf",
      category: "Solar Energy",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/solar-energy-intro.pdf",
      fileSize: 3072000,
      downloadCount: 2156,
      gradeLevel: "middle",
      rating: 4.8,
      reviewCount: 134,
      isFeatured: true,
      tags: ["solar", "renewable energy", "clean energy", "photovoltaics"]
    },
    {
      id: 2,
      title: "Wind Power Basics Video",
      description: "Animated video explaining wind turbine technology, wind farm operations, and environmental benefits.",
      type: "video",
      category: "Wind Energy",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/wind-power-basics.mp4",
      fileSize: 52428800,
      downloadCount: 1892,
      duration: "12:45",
      gradeLevel: "elementary",
      rating: 4.7,
      reviewCount: 89,
      isFeatured: true,
      tags: ["wind energy", "turbines", "renewable", "clean energy"]
    },
    {
      id: 3,
      title: "Renewable Energy Infographic",
      description: "Visual representation of different renewable energy sources, their capacity, and environmental impact.",
      type: "infographic",
      category: "General Renewable Energy",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/renewable-energy-infographic.png",
      fileSize: 1024000,
      downloadCount: 3421,
      gradeLevel: "high",
      rating: 4.9,
      reviewCount: 267,
      isFeatured: false,
      tags: ["renewable energy", "infographic", "clean energy", "sustainability"]
    },
    {
      id: 4,
      title: "Hydropower Explained",
      description: "Detailed presentation covering hydroelectric power generation, dam types, and environmental considerations.",
      type: "presentation",
      category: "Hydropower",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/hydropower-explained.pptx",
      fileSize: 8192000,
      downloadCount: 756,
      gradeLevel: "high",
      rating: 4.6,
      reviewCount: 45,
      isFeatured: false,
      tags: ["hydropower", "water energy", "dams", "renewable"]
    },
    {
      id: 5,
      title: "Energy Conservation Worksheet",
      description: "Interactive worksheet for students to learn about energy conservation practices and calculate energy savings.",
      type: "worksheet",
      category: "Energy Conservation",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/energy-conservation-worksheet.pdf",
      fileSize: 512000,
      downloadCount: 2891,
      gradeLevel: "elementary",
      rating: 4.5,
      reviewCount: 178,
      isFeatured: false,
      tags: ["energy conservation", "worksheet", "elementary", "sustainability"]
    },
    {
      id: 6,
      title: "Geothermal Energy Guide",
      description: "Comprehensive guide to geothermal energy, including how it works, where it's used, and future potential.",
      type: "pdf",
      category: "Geothermal Energy",
      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      fileUrl: "/resources/geothermal-energy-guide.pdf",
      fileSize: 4096000,
      downloadCount: 634,
      gradeLevel: "adult",
      rating: 4.8,
      reviewCount: 92,
      isFeatured: false,
      tags: ["geothermal", "renewable energy", "clean energy", "underground energy"]
    }
  ];

  const categories = ['all', 'Solar Energy', 'Wind Energy', 'Hydropower', 'Geothermal Energy', 'Energy Conservation', 'General Renewable Energy'];
  const types = ['all', 'pdf', 'video', 'infographic', 'presentation', 'worksheet'];
  const gradeLevels = ['all', 'elementary', 'middle', 'high', 'adult'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesGradeLevel = selectedGradeLevel === 'all' || resource.gradeLevel === selectedGradeLevel;
    
    return matchesSearch && matchesCategory && matchesType && matchesGradeLevel;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'infographic': return Image;
      case 'presentation': return FileText;
      case 'worksheet': return FileText;
      default: return File;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'pdf': return 'bg-blue-100 text-blue-800';
              case 'infographic': return 'bg-[#78C841]/20 text-[#78C841]';
      case 'presentation': return 'bg-purple-100 text-purple-800';
      case 'worksheet': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeLevelColor = (level: string) => {
    switch (level) {
              case 'elementary': return 'bg-[#B4E50D]/20 text-[#B4E50D]';
      case 'middle': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-purple-100 text-purple-800';
      case 'adult': return 'bg-gray-100 text-gray-800';
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

  const handleDownload = (resource: EducationalResource) => {
    // Handle download - could be direct download or redirect to download page
    console.log('Downloading:', resource.title);
    // For demo purposes, show an alert
    alert(`Downloading ${resource.title}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
              <section className="bg-gradient-to-br from-emerald-100 to-Teal py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Educational Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access downloadable resources, infographics, and videos on renewable energy topics. 
            Perfect for students, educators, and anyone interested in learning about sustainable 
            energy solutions and environmental conservation.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for energy topics, resources, or educational materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Energy Topics Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Explore Renewable Energy Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Solar Energy</h3>
              <p className="text-gray-600 text-sm">
                Learn about photovoltaic technology, solar panels, and harnessing the sun's power
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wind Energy</h3>
              <p className="text-gray-600 text-sm">
                Discover wind turbine technology and wind farm operations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#78C841]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#78C841]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hydropower</h3>
              <p className="text-gray-600 text-sm">
                Explore water-based energy generation and dam systems
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Energy Conservation</h3>
              <p className="text-gray-600 text-sm">
                Learn practical ways to reduce energy consumption
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Level Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedGradeLevel}
                onChange={(e) => setSelectedGradeLevel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {gradeLevels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Grade Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
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
                <article key={resource.id} className="bg-gradient-to-br from-[#78C841]/10 to-[#B4E50D]/10 rounded-lg shadow-lg overflow-hidden border-2 border-[#78C841]/30">
                  <div className="relative">
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-[#78C841] text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(resource.type)}`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeLevelColor(resource.gradeLevel)}`}>
                        {resource.gradeLevel.charAt(0).toUpperCase() + resource.gradeLevel.slice(1)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{resource.rating} ({resource.reviewCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-[#78C841]/20 text-[#78C841] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
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
                      className="w-full bg-[#78C841] hover:bg-[#6bb03a]"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Educational Resources</h2>
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
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeLevelColor(resource.gradeLevel)}`}>
                        {resource.gradeLevel.charAt(0).toUpperCase() + resource.gradeLevel.slice(1)}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{resource.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {resource.tags.slice(0, 2).map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-[#B4E50D]/20 text-[#B4E50D] text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
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
                      className="w-full border-[#78C841]/50 text-[#78C841] hover:bg-[#78C841]/10"
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
      <section className="py-16 bg-[#78C841]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Help Us Educate the Next Generation
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Are you an educator or expert in renewable energy? We're always looking for 
            quality educational content to share with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-[#78C841] hover:bg-gray-100">
              Submit Educational Content
            </Button>
            <Button size="lg" className="bg-white text-[#78C841] hover:bg-gray-100">
              Request Specific Topics
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
