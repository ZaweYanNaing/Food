<?php
require_once '../config/database.php';

class CookingTipController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    // Get all cooking tips with optional filters
    public function getAllTips($filters = []) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            // Apply filters
            if (!empty($filters['user_id'])) {
                $whereClause .= " AND ct.user_id = :user_id";
                $params[':user_id'] = $filters['user_id'];
            }
            
            if (!empty($filters['search'])) {
                $whereClause .= " AND (ct.title LIKE :search OR ct.content LIKE :search)";
                $params[':search'] = "%{$filters['search']}%";
            }
            
            $query = "SELECT ct.*, u.firstName, u.lastName, u.profile_image,
                             COALESCE(tl.user_liked, 0) as is_liked,
                             COALESCE(like_counts.like_count, 0) as like_count
                      FROM cooking_tips ct 
                      LEFT JOIN users u ON ct.user_id = u.id
                      LEFT JOIN (
                          SELECT tip_id, 1 as user_liked 
                          FROM tip_likes 
                          WHERE user_id = :current_user_id
                      ) tl ON ct.id = tl.tip_id
                      LEFT JOIN (
                          SELECT tip_id, COUNT(*) as like_count
                          FROM tip_likes
                          GROUP BY tip_id
                      ) like_counts ON ct.id = like_counts.tip_id
                      $whereClause
                      ORDER BY ct.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            
            // Bind current user ID for like status
            $currentUserId = $filters['current_user_id'] ?? null;
            $stmt->bindValue(':current_user_id', $currentUserId);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $tips];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get a single cooking tip by ID
    public function getTipById($id, $userId = null) {
        try {
            $query = "SELECT ct.*, u.firstName, u.lastName, u.profile_image,
                             COALESCE(tl.user_liked, 0) as is_liked,
                             COALESCE(like_counts.like_count, 0) as like_count
                      FROM cooking_tips ct 
                      LEFT JOIN users u ON ct.user_id = u.id
                      LEFT JOIN (
                          SELECT tip_id, 1 as user_liked 
                          FROM tip_likes 
                          WHERE user_id = :user_id
                      ) tl ON ct.id = tl.tip_id
                      LEFT JOIN (
                          SELECT tip_id, COUNT(*) as like_count
                          FROM tip_likes
                          GROUP BY tip_id
                      ) like_counts ON ct.id = like_counts.tip_id
                      WHERE ct.id = :tip_id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tip_id', $id);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $tip = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($tip) {
                return ['success' => true, 'data' => $tip];
            } else {
                return ['success' => false, 'error' => 'Cooking tip not found'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Create a new cooking tip
    public function createTip($data) {
        try {
            // Validate required fields
            if (empty($data['title']) || empty($data['content'])) {
                return ['success' => false, 'error' => 'Title and content are required'];
            }
            
            if (empty($data['user_id']) || $data['user_id'] <= 0) {
                return ['success' => false, 'error' => 'User must be logged in to create cooking tips'];
            }
            
            $query = "INSERT INTO cooking_tips (title, content, user_id, prep_time) 
                      VALUES (:title, :content, :user_id, :prep_time)";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':content', $data['content']);
            $stmt->bindValue(':user_id', $data['user_id']);
            $stmt->bindValue(':prep_time', $data['prep_time'] ?? null);
            
            if ($stmt->execute()) {
                $tipId = $this->db->lastInsertId();
                
                // Log user activity
                $this->logUserActivity($data['user_id'], 'tip_created', $tipId, 'tip', 'Created cooking tip: ' . $data['title']);
                
                return [
                    'success' => true, 
                    'message' => 'Cooking tip created successfully', 
                    'id' => $tipId
                ];
            } else {
                return ['success' => false, 'error' => 'Failed to create cooking tip'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Update an existing cooking tip
    public function updateTip($id, $data) {
        try {
            // Check if tip exists and user owns it
            $checkQuery = "SELECT user_id FROM cooking_tips WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            $tip = $checkStmt->fetch(PDO::FETCH_ASSOC);
            if (!$tip) {
                return ['success' => false, 'error' => 'Cooking tip not found'];
            }
            
            if ($tip['user_id'] != $data['user_id']) {
                return ['success' => false, 'error' => 'You can only edit your own cooking tips'];
            }
            
            $query = "UPDATE cooking_tips SET 
                      title = :title, 
                      content = :content, 
                      prep_time = :prep_time,
                      updated_at = NOW()
                      WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':content', $data['content']);
            $stmt->bindValue(':prep_time', $data['prep_time'] ?? null);
            $stmt->bindValue(':id', $id);
            
            if ($stmt->execute()) {
                // Log user activity
                $this->logUserActivity($data['user_id'], 'tip_updated', $id, 'tip', 'Updated cooking tip: ' . $data['title']);
                
                return ['success' => true, 'message' => 'Cooking tip updated successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to update cooking tip'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Delete a cooking tip
    public function deleteTip($id, $userId) {
        try {
            // Check if tip exists and user owns it
            $checkQuery = "SELECT user_id FROM cooking_tips WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            $tip = $checkStmt->fetch(PDO::FETCH_ASSOC);
            if (!$tip) {
                return ['success' => false, 'error' => 'Cooking tip not found'];
            }
            
            if ($tip['user_id'] != $userId) {
                return ['success' => false, 'error' => 'You can only delete your own cooking tips'];
            }
            
            $query = "DELETE FROM cooking_tips WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                // Log user activity
                $this->logUserActivity($userId, 'tip_deleted', $id, 'tip', 'Deleted cooking tip');
                
                return ['success' => true, 'message' => 'Cooking tip deleted successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to delete cooking tip'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Toggle like on a cooking tip
    public function toggleLike($userId, $tipId) {
        try {
            // Validate that user ID is provided (no anonymous likes allowed)
            if (!$userId || $userId <= 0) {
                return ['success' => false, 'error' => 'User must be logged in to like cooking tips'];
            }
            
            // Check if already liked
            $checkQuery = "SELECT id FROM tip_likes WHERE user_id = :user_id AND tip_id = :tip_id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':user_id', $userId);
            $checkStmt->bindParam(':tip_id', $tipId);
            $checkStmt->execute();
            
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existing) {
                // Remove like
                $query = "DELETE FROM tip_likes WHERE user_id = :user_id AND tip_id = :tip_id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':tip_id', $tipId);
                
                if ($stmt->execute()) {
                    // Get updated like count
                    $countQuery = "SELECT COUNT(*) as like_count FROM tip_likes WHERE tip_id = :tip_id";
                    $countStmt = $this->db->prepare($countQuery);
                    $countStmt->bindParam(':tip_id', $tipId);
                    $countStmt->execute();
                    $likeCount = $countStmt->fetch(PDO::FETCH_ASSOC)['like_count'];
                    
                    $this->logUserActivity($userId, 'tip_unliked', $tipId, 'tip', 'Unliked cooking tip');
                    return ['success' => true, 'message' => 'Cooking tip unliked', 'isLiked' => false, 'like_count' => $likeCount];
                }
            } else {
                // Add like
                $query = "INSERT INTO tip_likes (user_id, tip_id) VALUES (:user_id, :tip_id)";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':tip_id', $tipId);
                
                if ($stmt->execute()) {
                    // Get updated like count
                    $countQuery = "SELECT COUNT(*) as like_count FROM tip_likes WHERE tip_id = :tip_id";
                    $countStmt = $this->db->prepare($countQuery);
                    $countStmt->bindParam(':tip_id', $tipId);
                    $countStmt->execute();
                    $likeCount = $countStmt->fetch(PDO::FETCH_ASSOC)['like_count'];
                    
                    $this->logUserActivity($userId, 'tip_liked', $tipId, 'tip', 'Liked cooking tip');
                    return ['success' => true, 'message' => 'Cooking tip liked', 'isLiked' => true, 'like_count' => $likeCount];
                }
            }
            
            return ['success' => false, 'error' => 'Failed to update like'];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get users who liked a specific tip
    public function getTipLikes($tipId, $limit = 10) {
        try {
            $query = "SELECT u.id, u.firstName, u.lastName, u.profile_image, tl.created_at
                      FROM tip_likes tl
                      JOIN users u ON tl.user_id = u.id
                      WHERE tl.tip_id = :tip_id
                      ORDER BY tl.created_at DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':tip_id', $tipId);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $likes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $likes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    

    
    // Get most liked tips (analytics)
    public function getMostLikedTips($limit = 10, $period = 'all') {
        try {
            $whereClause = "";
            if ($period === 'week') {
                $whereClause = "AND ct.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
            } elseif ($period === 'month') {
                $whereClause = "AND ct.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            }
            
            $query = "SELECT ct.*, u.firstName, u.lastName, u.profile_image,
                             COALESCE(like_counts.like_count, 0) as like_count
                      FROM cooking_tips ct 
                      LEFT JOIN users u ON ct.user_id = u.id
                      LEFT JOIN (
                          SELECT tip_id, COUNT(*) as like_count
                          FROM tip_likes
                          GROUP BY tip_id
                      ) like_counts ON ct.id = like_counts.tip_id
                      WHERE 1=1 $whereClause
                      ORDER BY like_count DESC, ct.created_at DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $tips];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get trending tips (most liked in recent period)
    public function getTrendingTips($limit = 10) {
        try {
            $query = "SELECT ct.*, u.firstName, u.lastName, u.profile_image,
                             COALESCE(like_counts.like_count, 0) as like_count,
                             COALESCE(recent_likes.recent_like_count, 0) as recent_like_count
                      FROM cooking_tips ct 
                      LEFT JOIN users u ON ct.user_id = u.id
                      LEFT JOIN (
                          SELECT tip_id, COUNT(*) as like_count
                          FROM tip_likes
                          GROUP BY tip_id
                      ) like_counts ON ct.id = like_counts.tip_id
                      LEFT JOIN (
                          SELECT tip_id, COUNT(*) as recent_like_count
                          FROM tip_likes
                          WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                          GROUP BY tip_id
                      ) recent_likes ON ct.id = recent_likes.tip_id
                      WHERE ct.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                      ORDER BY recent_like_count DESC, like_count DESC, ct.created_at DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $tips];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get user's cooking tips
    public function getUserTips($userId) {
        try {
            $query = "SELECT ct.*, u.firstName, u.lastName
                      FROM cooking_tips ct 
                      LEFT JOIN users u ON ct.user_id = u.id
                      WHERE ct.user_id = :user_id
                      ORDER BY ct.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $tips];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Get recent cooking tips
    public function getRecentTips($limit = 10) {
        try {
            $query = "SELECT ct.*, u.firstName, u.lastName, u.profile_image
                      FROM cooking_tips ct 
                      LEFT JOIN users u ON ct.user_id = u.id
                      ORDER BY ct.created_at DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $tips];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    // Search cooking tips
    public function searchTips($query, $filters = []) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            // Search in title and content
            if (!empty($query)) {
                $whereClause .= " AND (ct.title LIKE :search_query OR ct.content LIKE :search_query)";
                $params[':search_query'] = "%$query%";
            }
            
            $sql = "SELECT ct.*, u.firstName, u.lastName, u.profile_image
                    FROM cooking_tips ct 
                    LEFT JOIN users u ON ct.user_id = u.id
                    $whereClause
                    ORDER BY ct.created_at DESC";
            
            $stmt = $this->db->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $tips = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $tips];
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