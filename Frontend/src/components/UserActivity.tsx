import { useState, useEffect } from 'react';
import { BookOpen, Heart, Download, User, Share2, Edit, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface UserActivity {
  id: number;
  activity_type: string;
  target_id: number;
  target_type: string;
  description: string;
  target_title?: string;
  target_image?: string;
  created_at: string;
}

interface UserActivityProps {
  userId: number;
  limit?: number;
}

export default function UserActivity({ userId, limit = 20 }: UserActivityProps) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserActivity();
  }, [userId, limit]);

  const loadUserActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUserActivity(userId, showAll ? 50 : limit);
      
      if (response.success && response.data) {
        setActivities(response.data);
      } else {
        setError('Failed to load activity');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'recipe_created':
        return <BookOpen className="w-5 h-5 text-[#78C841]" />;
      case 'recipe_liked':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'recipe_favorited':
        return <Heart className="w-5 h-5 text-pink-500" />;
      case 'recipe_shared':
        return <Share2 className="w-5 h-5 text-blue-500" />;
      case 'resource_downloaded':
        return <Download className="w-5 h-5 text-[#B4E50D]" />;
      case 'profile_updated':
        return <Edit className="w-5 h-5 text-gray-500" />;
      default:
        return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'recipe_created':
        return 'bg-[#78C841]/20';
      case 'recipe_liked':
        return 'bg-red-100';
      case 'recipe_favorited':
        return 'bg-pink-100';
      case 'recipe_shared':
        return 'bg-blue-100';
      case 'resource_downloaded':
        return 'bg-[#B4E50D]/20';
      case 'profile_updated':
        return 'bg-gray-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getActivityDescription = (activity: UserActivity) => {
    switch (activity.activity_type) {
      case 'recipe_created':
        return `Created recipe "${activity.target_title || 'Untitled'}"`;
      case 'recipe_liked':
        return `Liked recipe "${activity.target_title || 'Untitled'}"`;
      case 'recipe_favorited':
        return `Added "${activity.target_title || 'Untitled'}" to favorites`;
      case 'recipe_shared':
        return `Shared recipe "${activity.target_title || 'Untitled'}"`;
      case 'resource_downloaded':
        return activity.description;
      case 'profile_updated':
        return 'Updated profile information';
      default:
        return activity.description;
    }
  };

  const handleViewRecipe = (recipeId: number) => {
    navigate(`/recipes/${recipeId}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#78C841]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadUserActivity} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
        <p className="text-gray-600 mb-4">Start using FoodFusion to see your activity history here!</p>
        <Button onClick={() => navigate('/recipes')} className="bg-[#78C841] hover:bg-[#78C841]/90">
          Browse Recipes
        </Button>
      </div>
    );
  }

  const displayedActivities = showAll ? activities : activities.slice(0, limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        <div className="text-sm text-gray-500">
          {activities.length} activity{activities.length !== 1 ? 'ies' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.activity_type)}`}>
                {getActivityIcon(activity.activity_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {getActivityDescription(activity)}
                </p>
                
                {activity.target_type === 'recipe' && activity.target_title && (
                  <div className="flex items-center space-x-3 mb-2">
                    {activity.target_image && (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={activity.target_image} 
                          alt={activity.target_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{activity.target_title}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewRecipe(activity.target_id)}
                        className="mt-1 h-6 px-2 text-xs"
                      >
                        View Recipe
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                  
                  {activity.activity_type === 'recipe_created' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/recipes/edit/${activity.target_id}`)}
                      className="h-6 px-2 text-xs"
                    >
                      Edit Recipe
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > limit && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="bg-white hover:bg-gray-50"
          >
            {showAll ? 'Show Less' : `Show All ${activities.length} Activities`}
          </Button>
        </div>
      )}
    </div>
  );
}
