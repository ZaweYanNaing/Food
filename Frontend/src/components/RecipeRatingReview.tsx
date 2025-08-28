import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import { toast } from 'react-toastify';

interface RecipeRatingReviewProps {
  recipeId: number;
  recipeTitle: string;
  onUpdate?: () => void;
}

interface Review {
  review_id: number;
  review_text: string;
  review_date: string;
  rating: number;
  rating_date: string;
  firstName: string;
  lastName: string;
  profile_image?: string;
}

interface RatingStats {
  average_rating: number;
  total_ratings: number;
}

export default function RecipeRatingReview({ recipeId, onUpdate }: RecipeRatingReviewProps) {
  const { user } = useAuth();
  
  const [userRating, setUserRating] = useState<number | null>(null);
  const [userReview, setUserReview] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats>({ average_rating: 0, total_ratings: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadRecipeData();
    }
  }, [user, recipeId]);

  const loadRecipeData = async () => {
    try {
      setIsLoading(true);
      
      // Load ratings and reviews
      const reviewsResponse = await apiService.getRecipeRatingsReviews(recipeId);
      if (reviewsResponse.success) {
        setReviews(reviewsResponse.data.reviews);
        setRatingStats({
          average_rating: reviewsResponse.data.average_rating,
          total_ratings: reviewsResponse.data.total_ratings
        });
      }

      // Load user's status for this recipe
      const statusResponse = await apiService.getUserRecipeStatus(user!.id, recipeId);
      if (statusResponse.success) {
        
        setUserRating(statusResponse.data.userRating);
        setUserReview(statusResponse.data.userReview || '');
      }
    } catch (error) {
      console.error('Error loading recipe data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleRatingChange = async (rating: number) => {
    if (!user) {
      toast.error('You must be logged in to rate recipes');
      return;
    }

    // Store the rating but don't submit yet - wait for review
    setUserRating(rating);
    setShowReviewForm(true); // Automatically show review form when rating is selected
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to review recipes');
      return;
    }

    if (!userReview.trim()) {
      toast.error('Please enter a review');
      return;
    }

    if (!userRating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiService.addRecipeRatingReview(user.id, recipeId, userRating, userReview);
      
      if (response.success) {
        toast.success(response.message);
        setShowReviewForm(false);
        setUserReview('');
        loadRecipeData(); // Reload to get updated reviews
        onUpdate?.();
      } else {
        toast.error(response.message || 'Failed to add rating and review');
      }
    } catch (error) {
      toast.error('Error adding rating and review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : 'button'}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
            disabled={!interactive || isSubmitting}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            } ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : ''}`} />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#78C841]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recipe Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-6">
          
         

          {/* Rating Display */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Rating:</span>
            {renderStars(ratingStats.average_rating)}
            <span className="text-sm text-gray-500">
              ({ratingStats.total_ratings} {ratingStats.total_ratings === 1 ? 'rating' : 'ratings'})
            </span>
          </div>
        </div>

        {/* Add Review Button */}
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{userReview ? 'Edit Review' : 'Add Review'}</span>
          </Button>
        )}
      </div>

      {/* User Rating Section */}
      {user && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rating</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Rate this recipe:</span>
            {renderStars(userRating || 0, true, handleRatingChange)}
            {userRating && (
              <span className="text-sm text-gray-500">
                You rated this {userRating} star{userRating !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
          />
          <div className="flex items-center justify-end space-x-3 mt-3">
            <Button
              variant="outline"
              onClick={() => setShowReviewForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={isSubmitting}
              className="bg-[#78C841] hover:bg-[#6bb03a]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.review_id} className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {review.profile_image ? (
                      <img
                        src={`http://localhost:8080${review.profile_image}`}
                        alt={`${review.firstName} ${review.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {review.firstName.charAt(0)}{review.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.firstName} {review.lastName}
                      </p>
                      {review.rating && (
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.review_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Reviews Message */}
      {reviews.length === 0 && !showReviewForm && (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No reviews yet. Be the first to review this recipe!</p>
        </div>
      )}
    </div>
  );
}
