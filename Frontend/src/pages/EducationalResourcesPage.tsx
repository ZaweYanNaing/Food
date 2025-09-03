import { useState, useEffect } from 'react';
import { 
  Download, 
  Play, 
  FileText, 
  Image, 
  Video, 
  Presentation, 
  BookOpen,
  Search,
  Filter,
  Upload,
  Plus,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface EducationalResource {
  id: number;
  title: string;
  description: string;
  type: 'document' | 'infographic' | 'video' | 'presentation' | 'guide';
  file_path?: string;
  download_count: number;
  created_at: string;
}

interface Statistics {
  total_resources: number;
  documents: number;
  infographics: number;
  videos: number;
  presentations: number;
  guides: number;
  total_downloads: number;
  avg_downloads: number;
}

export default function EducationalResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<EducationalResource[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    sort: 'newest'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Upload form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'document',
    file: null as File | null
  });

  const typeIcons = {
    document: FileText,
    infographic: Image,
    video: Video,
    presentation: Presentation,
    guide: BookOpen
  };



  useEffect(() => {
    loadResources();
    loadStatistics();
  }, [filters, currentPage]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await apiService.getEducationalResources({
        ...filters,
        limit: itemsPerPage,
        offset
      });
      
      if (response.success) {
        setResources(response.data || []);
        const total = (response as any).total || 0;
        setTotalPages(Math.ceil(total / itemsPerPage));
      } else {
        setError(response.error || 'Failed to load resources');
      }
    } catch (error) {
      console.error('Error loading resources:', error);
      setError('Failed to load educational resources');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadForm(prev => ({ ...prev, file }));
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to upload resources');
      return;
    }

    if (!uploadForm.file) {
      alert('Please select a file to upload');
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('type', uploadForm.type);
      formData.append('created_by', user.id.toString());

      // Use direct fetch instead of API service
      const response = await fetch('/api/educational-resources', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Resource uploaded successfully!');
        setUploadForm({ title: '', description: '', type: 'document', file: null });
        setShowUploadForm(false);
        loadResources();
        loadStatistics();
      } else {
        alert(result.error || 'Failed to upload resource');
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        alert('Server returned an error. Please check the file type and size, and try again.');
      } else {
        alert('Failed to upload resource: ');
      }
    } finally {
      setUploadLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiService.getEducationalResourceStatistics();
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      search: '',
      sort: 'newest'
    });
    setCurrentPage(1);
  };





  const handleDownload = async (resource: EducationalResource) => {
    try {
      await apiService.downloadEducationalResource(resource.id);
    } catch (error) {
      console.error('Error downloading resource:', error);
      alert('Failed to download resource. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-100 to-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Educational Resources
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Discover comprehensive educational materials on renewable energy topics. 
            Download documents, infographics, videos, and guides to expand your knowledge.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{statistics.total_resources}</div>
              <div className="text-sm text-gray-600">Total Resources</div>
              </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">{statistics.documents}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{statistics.infographics}</div>
              <div className="text-sm text-gray-600">Infographics</div>
              </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-red-600">{statistics.videos}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{statistics.presentations}</div>
              <div className="text-sm text-gray-600">Presentations</div>
              </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-indigo-600">{statistics.guides}</div>
              <div className="text-sm text-gray-600">Guides</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search educational resources..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={() => setShowUploadForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload Resource
            </Button>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

                    {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Types</option>
                    <option value="document">Documents</option>
                    <option value="infographic">Infographics</option>
                    <option value="video">Videos</option>
                    <option value="presentation">Presentations</option>
                    <option value="guide">Guides</option>
              </select>
            </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="title">Title A-Z</option>
              </select>
                    </div>
                  </div>
                  
              {/* Clear Filters */}
              <div className="mt-4">
                <Button onClick={clearFilters} variant="outline" size="sm">
                  Clear All Filters
                </Button>
                      </div>
                    </div>
          )}
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Educational Resource</h3>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter resource title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter resource description"
                  />
                    </div>
                    
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="document">Document</option>
                    <option value="infographic">Infographic</option>
                    <option value="video">Video</option>
                    <option value="presentation">Presentation</option>
                    <option value="guide">Guide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Allowed types: PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, PNG, GIF, MP4, AVI, MOV (Max 50MB)
                  </p>
                    </div>
                    
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={uploadLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {uploadLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
                    </div>
        )}
                    
        {/* Resources Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
              ))}
            </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <Button onClick={loadResources}>Try Again</Button>
          </div>
        ) : resources.length === 0 ? (
            <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No educational resources found</div>
            <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resources.map((resource) => {
                const IconComponent = typeIcons[resource.type];
                return (
                  <div key={resource.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                        {/* Thumbnail */}
                    <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-green-600" />
                    </div>

                                        {/* Content */}
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <IconComponent className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-500 capitalize">{resource.type}</span>
                  </div>
                  
                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {resource.description}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Download className="w-4 h-4" />
                          <span>{resource.download_count} downloads</span>
                    </div>
                    </div>
                    
                      {/* Action Button */}
                    <Button 
                      onClick={() => handleDownload(resource)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {resource.type === 'video' ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Watch
                          </>
                        ) : (
                          <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                          </>
                        )}
                    </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Previous
            </Button>
                  
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
            </Button>
          </div>
        </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}