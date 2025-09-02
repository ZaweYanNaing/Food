import { useState, useEffect } from 'react';
import { Plus, Clock, Search, ThumbsUp } from 'lucide-react';
import {Button} from '../components/ui/button';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';



interface CookingTip {
  id: number;
  title: string;
  content: string;
  user_id: number;
  firstName: string;
  lastName: string;
  profile_image?: string;
  prep_time?: number;
  like_count: number;
  is_liked: boolean;
  created_at: string;
}

interface TipLike {
  id: number;
  firstName: string;
  lastName: string;
  profile_image?: string;
  created_at: string;
}

export default function CommunityCookbookPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [cookingTips, setCookingTips] = useState<CookingTip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipLikes, setTipLikes] = useState<{[tipId: number]: TipLike[]}>({});
  const [loadingLikes, setLoadingLikes] = useState<{[tipId: number]: boolean}>({});

  // Load cooking tips from API
  useEffect(() => {
    loadCookingTips();
  }, [searchQuery, user]);

  const loadCookingTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = {
        current_user_id: user?.id || null // Use actual logged-in user ID
      };
      
      if (searchQuery) {
        filters.search = searchQuery;
      }

      const response = await apiService.getCookingTips(filters);
      
      if (response.success && response.data) {
        setCookingTips(response.data);
      } else {
        setError(response.message || 'Failed to load cooking tips');
      }
    } catch (err) {
      setError('Failed to load cooking tips');
      console.error('Error loading cooking tips:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTipLikes = async (tipId: number) => {
    if (loadingLikes[tipId] || tipLikes[tipId]) return; // Already loading or loaded
    
    setLoadingLikes(prev => ({ ...prev, [tipId]: true }));
    try {
      const response = await apiService.getCookingTipLikes(tipId, 5);
      if (response.success && response.data) {
        setTipLikes(prev => ({ ...prev, [tipId]: response.data }));
      }
    } catch (error) {
      console.error('Error loading tip likes:', error);
    } finally {
      setLoadingLikes(prev => ({ ...prev, [tipId]: false }));
    }
  };

  const toggleLike = async (id: number) => {
    // Check if user is logged in
    if (!user) {
      // Show a more user-friendly message
      const shouldLogin = confirm('You need to be logged in to like cooking tips. Would you like to go to the login page?');
      if (shouldLogin) {
        // Redirect to login page (you can customize this based on your routing)
        window.location.href = '/login';
      }
      return;
    }

    try {
      // Find the tip to get current state
      const currentTip = cookingTips.find(tip => tip.id === id);
      if (!currentTip) return;

      const wasLiked = currentTip.is_liked;
      const newLikeCount = wasLiked ? currentTip.like_count - 1 : currentTip.like_count + 1;

      // Optimistic update - immediately update UI with smooth animation
      setCookingTips(prevTips => 
        prevTips.map(tip => 
          tip.id === id 
            ? { 
                ...tip, 
                is_liked: !wasLiked, 
                like_count: newLikeCount
              }
            : tip
        )
      );

      // Add visual feedback with a brief animation
      const button = document.querySelector(`[data-tip-id="${id}"]`);
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => button.classList.remove('animate-pulse'), 300);
      }

      const response = await apiService.toggleCookingTipLike(user?.id || 1, id); // Use actual logged-in user ID
      
      if (response.success) {
        // Update with server response to ensure accuracy
        setCookingTips(prevTips => 
          prevTips.map(tip => 
            tip.id === id 
              ? { 
                  ...tip, 
                  is_liked: response.data?.isLiked ?? !wasLiked, 
                  like_count: response.data?.like_count ?? newLikeCount
                }
              : tip
          )
        );
        
        // Show success feedback
        console.log(wasLiked ? 'Tip unliked successfully' : 'Tip liked successfully');
      } else {
        // Revert optimistic update on error
        setCookingTips(prevTips => 
          prevTips.map(tip => 
            tip.id === id 
              ? { 
                  ...tip, 
                  is_liked: wasLiked, 
                  like_count: currentTip.like_count
                }
              : tip
          )
        );
        
        // Show error feedback
        console.error('Failed to update like:', response.message);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      
      // Revert optimistic update on error
      const currentTip = cookingTips.find(tip => tip.id === id);
      if (currentTip) {
        setCookingTips(prevTips => 
          prevTips.map(tip => 
            tip.id === id 
              ? { 
                  ...tip, 
                  is_liked: currentTip.is_liked, 
                  like_count: currentTip.like_count
                }
              : tip
          )
        );
      }
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
            Share your cooking tips and culinary experiences with the 
            FoodFusion community. Learn from fellow food enthusiasts and discover new techniques.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Plus className="w-5 h-5 mr-2" />
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
                  placeholder="Search cooking tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>


          </div>
        </div>
      </section>



      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading cooking tips...</h3>
                  <p className="text-gray-600">Please wait while we fetch the latest tips from our community.</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">❌</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading tips</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button onClick={loadCookingTips}>Try Again</Button>
                </div>
              ) : cookingTips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No cooking tips found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or be the first to share a tip!</p>
                  <Button>Share Your First Tip</Button>
                </div>
              ) : (
                cookingTips.map((tip) => (
                  <article key={tip.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                      <p className="text-gray-600 mb-4">{tip.content}</p>
                    </div>

                    {/* Tip Details */}
                    <div className="mb-4">
                      {tip.prep_time && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{tip.prep_time} min</span>
                        </div>
                      )}
                    </div>

                    {/* Author and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {tip.profile_image && <img 
                          src={`http://localhost:8080${tip.profile_image}`} 
                          alt={`${tip.firstName} ${tip.lastName}`}
                          className="w-10 h-10 rounded-full"
                        />}
                        {
                          !tip.profile_image && <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="w-10 h-10 rounded-full" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        }
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{tip.firstName} {tip.lastName}</span>
                          </div>
                          <p className="text-sm text-gray-500">{new Date(tip.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Facebook-like Like Button */}
                        <div className="flex items-center">
                          <button
                            data-tip-id={tip.id}
                            onClick={() => toggleLike(tip.id)}
                            disabled={!user}
                            title={!user ? 'Please log in to like cooking tips' : ''}
                            className={`group flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-200 ${
                              !user 
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-60' 
                                : tip.is_liked 
                                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600'
                            }`}
                          >
                            <div className="relative">
                              <ThumbsUp className={`w-4 h-4 transition-transform duration-200 ${
                                tip.is_liked ? 'fill-current scale-110' : 'group-hover:scale-110'
                              }`} />
                              {tip.is_liked && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <span className={`text-sm font-medium transition-colors ${
                              tip.is_liked ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
                            }`}>
                              {tip.like_count > 0 ? tip.like_count : 'Like'}
                            </span>
                          </button>
                          
                          {/* Like count display with hover effect */}
                          {tip.like_count > 0 && (
                            <div className="ml-2 group relative">
                              <div 
                                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                                onMouseEnter={() => loadTipLikes(tip.id)}
                              >
                                <span className="font-medium">{tip.like_count}</span>
                                <span>{tip.like_count === 1 ? 'like' : 'likes'}</span>
                              </div>
                              {/* Tooltip for showing who liked */}
                              <div className="absolute z-20 invisible group-hover:visible bg-gray-800 text-white text-xs rounded-lg py-2 px-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-48 max-w-64">
                                {loadingLikes[tip.id] ? (
                                  <div className="text-center">Loading...</div>
                                ) : tipLikes[tip.id] ? (
                                  <div>
                                    <div className="font-semibold mb-2 text-white">
                                      {tip.like_count} {tip.like_count === 1 ? 'person likes' : 'people like'} this tip
                                    </div>
                                    <div className="space-y-1">
                                      {tipLikes[tip.id].slice(0, 3).map((like) => (
                                        <div key={like.id} className="flex items-center space-x-2">
                                        { !!like.profile_image && <img 
                                            src={`http://localhost:8080${like.profile_image}`} 
                                            alt={`${like.firstName} ${like.lastName}`}
                                            className="w-5 h-5 rounded-full"
                                          />}
                                          {
                                            !like.profile_image && <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="w-5 h-5 rounded-full" />
                                            <AvatarFallback>CN</AvatarFallback>
                                          </Avatar>
                                          }
                                          <span className="text-white">{like.firstName} {like.lastName}</span>
                                        </div>
                                      ))}
                                      {tip.like_count > 3 && (
                                        <div className="text-gray-300 text-xs">
                                          and {tip.like_count - 3} others
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    {tip.like_count} {tip.like_count === 1 ? 'person likes' : 'people like'} this tip
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Share Your Culinary Knowledge
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Whether it's a cooking technique you've mastered or a kitchen hack 
            you've discovered, your knowledge can help others in their culinary journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Share a Tip
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
