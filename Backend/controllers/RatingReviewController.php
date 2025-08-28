<?php
require_once '../config/database.php';

class RatingReviewController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    // Toggle recipe like/unlike
    public function toggleLike($userId, $recipeId) {
        try {
            // Check if already liked
            $checkQuery = "SELECT id FROM recipe_likes WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':user_id', $userId);
            $checkStmt->bindParam(':recipe_id', $recipeId);
            $checkStmt->execute();
            
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existing) {
                // Remove like
                $query = "DELETE FROM recipe_likes WHERE user_id = :user_id AND recipe_id = :recipe_id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':recipe_id', $recipeId);
                
                if ($stmt->execute()) {
                    $this->logUserActivity($userId, 'recipe_unliked', $recipeId, 'recipe', 'Unliked recipe');
                    return ['success' => true, 'message' => 'Recipe unliked', 'isLiked' => false];
                }
            } else {
                // Add like
                $query = "INSERT INTO recipe_likes (user_id, recipe_id) VALUES (:user_id, :recipe_id)";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':recipe_id', $recipeId);
                
                if ($stmt->execute()) {
                    $this->logUserActivity($userId, 'recipe_liked', $recipeId, 'recipe', 'Liked recipe');
                    return ['success' => true, 'message' => 'Recipe liked', 'isLiked' => true];
                }
            }
            
            return ['success' => false, 'error' => 'Failed to update like'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Add or update recipe rating and review
    public function addRatingReview($userId, $recipeId, $rating, $reviewText) {
        try {
            // Validate rating
            if ($rating < 1 || $rating > 5) {
                return ['success' => false, 'error' => 'Rating must be between 1 and 5'];
            }
            
            // Validate review text
            if (empty(trim($reviewText))) {
                return ['success' => false, 'error' => 'Review text is required'];
            }
            
            // Check if recipe exists
            $checkQuery = "SELECT id FROM recipes WHERE id = :recipe_id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':recipe_id', $recipeId);
            $checkStmt->execute();
            
            if (!$checkStmt->fetch()) {
                return ['success' => false, 'error' => 'Recipe not found'];
            }
            
            // Start transaction
            $this->db->beginTransaction();
            
            // Check if user already reviewed this recipe
            $existingQuery = "SELECT id FROM recipe_reviews WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $existingStmt = $this->db->prepare($existingQuery);
            $existingStmt->bindParam(':user_id', $userId);
            $existingStmt->bindParam(':recipe_id', $recipeId);
            $existingStmt->execute();
            
            $existing = $existingStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existing) {
                // Update existing review and rating
                $query = "UPDATE recipe_reviews SET review_text = :review_text, rating = :rating, updated_at = NOW() WHERE id = :id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':review_text', $reviewText);
                $stmt->bindParam(':rating', $rating);
                $stmt->bindParam(':id', $existing['id']);
                
                if (!$stmt->execute()) {
                    throw new Exception('Failed to update review');
                }
                
                $action = 'updated';
            } else {
                // Insert new review with rating
                $query = "INSERT INTO recipe_reviews (user_id, recipe_id, review_text, rating) VALUES (:user_id, :recipe_id, :review_text, :rating)";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':recipe_id', $recipeId);
                $stmt->bindParam(':review_text', $reviewText);
                $stmt->bindParam(':rating', $rating);
                
                if (!$stmt->execute()) {
                    throw new Exception('Failed to insert review');
                }
                
                $action = 'added';
            }
            
            $this->db->commit();
            
            // Log user activity for both rating and review
            $this->logUserActivity($userId, 'recipe_rated', $recipeId, 'recipe', "Rated recipe $rating stars");
            $this->logUserActivity($userId, 'recipe_reviewed', $recipeId, 'recipe', 'Reviewed recipe');
            
            return [
                'success' => true, 
                'message' => "Rating and review $action successfully",
                'rating' => $rating
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get recipe ratings and reviews
    public function getRecipeRatingsReviews($recipeId) {
        try {
            $query = "SELECT 
                        r.id as review_id,
                        r.review_text,
                        r.rating,
                        r.created_at as review_date,
                        u.firstName,
                        u.lastName,
                        u.profile_image
                      FROM recipe_reviews r
                      LEFT JOIN users u ON r.user_id = u.id
                      WHERE r.recipe_id = :recipe_id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':recipe_id', $recipeId);
            $stmt->execute();
            
            $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get average rating
            $avgQuery = "SELECT AVG(CAST(rating AS DECIMAL(3,2))) as average_rating, COUNT(*) as total_ratings 
                        FROM recipe_reviews 
                        WHERE recipe_id = :recipe_id";
            $avgStmt = $this->db->prepare($avgQuery);
            $avgStmt->bindParam(':recipe_id', $recipeId);
            $avgStmt->execute();
            
            $ratingStats = $avgStmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'data' => [
                    'reviews' => $reviews,
                    'average_rating' => round($ratingStats['average_rating'], 1),
                    'total_ratings' => $ratingStats['total_ratings']
                ]
            ];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get user's ratings and reviews
    public function getUserRatingsReviews($userId) {
        try {
            $query = "SELECT 
                        r.id as review_id,
                        r.review_text,
                        r.rating,
                        r.created_at as review_date,
                        rec.title as recipe_title,
                        rec.image_url as recipe_image
                      FROM recipe_reviews r
                      LEFT JOIN recipes rec ON r.recipe_id = rec.id
                      WHERE r.user_id = :user_id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $userReviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'data' => $userReviews
            ];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Check if user has liked/rated/reviewed a recipe
    public function getUserRecipeStatus($userId, $recipeId) {
        try {
            // Check like status
            $likeQuery = "SELECT id FROM recipe_likes WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $likeStmt = $this->db->prepare($likeQuery);
            $likeStmt->bindParam(':user_id', $userId);
            $likeStmt->bindParam(':recipe_id', $recipeId);
            $likeStmt->execute();
            $isLiked = $likeStmt->fetch() ? true : false;
            
            // Check rating and review
            $reviewQuery = "SELECT rating, review_text FROM recipe_reviews WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $reviewStmt = $this->db->prepare($reviewQuery);
            $reviewStmt->bindParam(':user_id', $userId);
            $reviewStmt->bindParam(':recipe_id', $recipeId);
            $reviewStmt->execute();
            $userReview = $reviewStmt->fetch(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'data' => [
                    'isLiked' => $isLiked,
                    'userRating' => $userReview ? $userReview['rating'] : null,
                    'userReview' => $userReview ? $userReview['review_text'] : null
                ]
            ];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function logUserActivity($userId, $activityType, $targetId, $targetType, $description) {
        try {
            $query = "INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES (:user_id, :activity_type, :target_id, :target_type, :description)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':activity_type', $activityType);
            $stmt->bindParam(':target_id', $targetId);
            $stmt->bindParam(':target_type', $targetType);
            $stmt->bindParam(':description', $description);
            $stmt->execute();
        } catch (Exception $e) {
            // Log error but don't fail the main operation
            error_log("Failed to log user activity: " . $e->getMessage());
        }
    }
}
?>
