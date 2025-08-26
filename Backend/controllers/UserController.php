<?php
require_once __DIR__ . '/../config/database.php';

class UserController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    public function getUserIdFromToken($token) {
        try {
            // For development, we'll use a simple token format: "user_id:random_string"
            // In production, this should be a proper JWT token
            if (empty($token)) {
                error_log("Token is empty");
                return null;
            }
            
            // Remove "Bearer " prefix if present
            $token = str_replace('Bearer ', '', $token);
            error_log("Token after removing Bearer: " . $token);
            
            // For now, let's check if the token contains a user ID
            // In a real app, you'd decode a JWT token here
            if (strpos($token, ':') !== false) {
                $parts = explode(':', $token);
                error_log("Token parts: " . print_r($parts, true));
                $userId = intval($parts[0]);
                error_log("Extracted user ID: " . $userId);
                if ($userId > 0) {
                    return $userId;
                }
            }
            
            // Try to extract user ID from JWT-style token (for development)
            // This is a simple approach - in production, use proper JWT decoding
            if (strlen($token) > 20) { // Likely a JWT token
                // For development, try to extract user ID from the token
                // In production, this should be proper JWT decoding
                error_log("Token appears to be JWT-style, attempting to extract user ID");
                
                // Simple fallback: check if we can find a user ID in the token
                // This is NOT secure and should only be used for development
                if (preg_match('/(\d+)/', $token, $matches)) {
                    $userId = intval($matches[1]);
                    error_log("Extracted user ID from JWT-style token: " . $userId);
                    if ($userId > 0) {
                        return $userId;
                    }
                }
            }
            
            // Fallback: check if token exists in a simple tokens table or use a default
            // For development, we'll use a simple approach
            error_log("No valid user ID found in token");
            return null;
        } catch (Exception $e) {
            error_log("Error decoding token: " . $e->getMessage());
            return null;
        }
    }
    
    public function getProfile($token, $fallbackUserId = null) {
        try {
            // Get user ID from token
            $userId = $this->getUserIdFromToken($token);
            
            if (!$userId && $fallbackUserId) {
                // If no valid token but fallback user ID is provided, use it
                $userId = $fallbackUserId;
            } elseif (!$userId) {
                // For development, if no valid token and no fallback, return user ID 1 as fallback
                // In production, this should return an error
                $userId = 1;
            }
            
            $query = "SELECT id, firstName, lastName, email, bio, location, website, profile_image, created_at FROM users WHERE id = :id LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $userId);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                return ['success' => true, 'data' => $user];
            } else {
                return ['success' => false, 'error' => 'User not found'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function updateProfile($userId, $data) {
        try {
            error_log("=== updateProfile method called ===");
            error_log("User ID: " . $userId);
            error_log("Data: " . print_r($data, true));
            
            // Build dynamic query based on what fields are provided
            $updateFields = [];
            $params = [':id' => $userId];
            
            // Only update fields that are provided and not empty
            if (isset($data['firstName']) && !empty($data['firstName'])) {
                $updateFields[] = "firstName = :firstName";
                $params[':firstName'] = $data['firstName'];
            }
            
            if (isset($data['lastName']) && !empty($data['lastName'])) {
                $updateFields[] = "lastName = :lastName";
                $params[':lastName'] = $data['lastName'];
            }
            
            // Note: Email updates should be handled separately to avoid unique constraint issues
            // For now, we'll skip email updates in profile updates
            
            if (isset($data['bio'])) {
                $updateFields[] = "bio = :bio";
                $params[':bio'] = $data['bio'];
            }
            
            if (isset($data['location'])) {
                $updateFields[] = "location = :location";
                $params[':location'] = $data['location'];
            }
            
            if (isset($data['website'])) {
                $updateFields[] = "website = :website";
                $params[':website'] = $data['website'];
            }
            
            // Add profile_image update if provided
            if (isset($data['profile_image']) && !empty($data['profile_image'])) {
                $updateFields[] = "profile_image = :profile_image";
                $params[':profile_image'] = $data['profile_image'];
            }
            
            // If no fields to update, return success
            if (empty($updateFields)) {
                error_log("No fields to update");
                return ['success' => true, 'message' => 'No fields to update'];
            }
            
            $query = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = :id";
            
            // Debug logging
            error_log("Update query: " . $query);
            error_log("Update params: " . print_r($params, true));
            
            $stmt = $this->db->prepare($query);
            if (!$stmt) {
                error_log("Failed to prepare statement: " . print_r($this->db->errorInfo(), true));
                return ['success' => false, 'error' => 'Failed to prepare database statement'];
            }
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            if ($stmt->execute()) {
                error_log("Statement executed successfully");
                // Log the profile update activity
                $this->logUserActivity($userId, 'profile_updated', $userId, 'profile', 'Updated profile information');
                return ['success' => true, 'message' => 'Profile updated successfully'];
            } else {
                error_log("Failed to execute statement: " . print_r($stmt->errorInfo(), true));
                return ['success' => false, 'error' => 'Failed to update profile'];
            }
        } catch (Exception $e) {
            error_log("Exception in updateProfile: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function uploadProfileImage($userId, $imageFile) {
        try {
            error_log("=== uploadProfileImage method called ===");
            error_log("User ID: " . $userId);
            error_log("Image file: " . print_r($imageFile, true));
            
            // Validate file
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!in_array($imageFile['type'], $allowedTypes)) {
                error_log("Invalid file type: " . $imageFile['type']);
                return ['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, and GIF are allowed'];
            }
            
            if ($imageFile['size'] > 20 * 1024 * 1024) { // 20MB limit
                error_log("File size too large: " . $imageFile['size']);
                return ['success' => false, 'error' => 'File size too large. Maximum 20MB allowed'];
            }
            
            // Create uploads directory if it doesn't exist
            $uploadDir = '../uploads/';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0755, true)) {
                    error_log("Failed to create uploads directory");
                    return ['success' => false, 'error' => 'Failed to create uploads directory'];
                }
            }
            
            // Check if directory is writable
            if (!is_writable($uploadDir)) {
                error_log("Uploads directory is not writable");
                return ['success' => false, 'error' => 'Uploads directory is not writable'];
            }
            
            // Generate unique filename for profile image
            $extension = pathinfo($imageFile['name'], PATHINFO_EXTENSION);
            $filename = 'profile_' . $userId . '_' . time() . '.' . $extension;
            $filepath = $uploadDir . $filename;
            
            error_log("Attempting to move uploaded file to: " . $filepath);
            
            if (move_uploaded_file($imageFile['tmp_name'], $filepath)) {
                error_log("File moved successfully");
                $imageUrl = '/uploads/' . $filename;
                
                // Update the user's profile_image in the database
                $query = "UPDATE users SET profile_image = :profile_image WHERE id = :id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':profile_image', $imageUrl);
                $stmt->bindParam(':id', $userId);
                
                if ($stmt->execute()) {
                    error_log("Database updated successfully");
                    // Log the profile image update activity
                    $this->logUserActivity($userId, 'profile_updated', $userId, 'profile', 'Updated profile image');
                    return [
                        'success' => true, 
                        'message' => 'Profile image uploaded successfully',
                        'data' => [
                            'profile_image' => $imageUrl
                        ]
                    ];
                } else {
                    error_log("Database update failed: " . print_r($stmt->errorInfo(), true));
                    // If database update fails, delete the uploaded file
                    unlink($filepath);
                    return ['success' => false, 'error' => 'Failed to update profile image in database'];
                }
            } else {
                error_log("Failed to move uploaded file");
                error_log("Upload error: " . print_r(error_get_last(), true));
                return ['success' => false, 'error' => 'Failed to save image file'];
            }
        } catch (Exception $e) {
            error_log("Exception in uploadProfileImage: " . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getUserStats($userId) {
        try {
            $stats = [];
            
            // Get recipes shared count
            $query = "SELECT COUNT(*) as count FROM recipes WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $stats['recipesShared'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Get recipes liked count
            $query = "SELECT COUNT(*) as count FROM recipe_likes WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $stats['recipesLiked'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Get recipes saved count
            $query = "SELECT COUNT(*) as count FROM user_favorites WHERE user_id = :user_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $stats['recipesSaved'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Get resources downloaded count
            $query = "SELECT COUNT(*) as count FROM user_activity WHERE user_id = :user_id AND activity_type = 'resource_downloaded'";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            $stats['resourcesDownloaded'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Calculate community points (simple algorithm)
            $stats['communityPoints'] = ($stats['recipesShared'] * 100) + ($stats['recipesLiked'] * 10) + ($stats['recipesSaved'] * 25);
            
            return ['success' => true, 'data' => $stats];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getUserRecipes($userId) {
        try {
            $query = "SELECT r.*, c.name as category_name 
                      FROM recipes r 
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id 
                      LEFT JOIN categories c ON rc.category_id = c.id 
                      WHERE r.user_id = :user_id 
                      ORDER BY r.created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Group recipes by category
            $groupedRecipes = [];
            foreach ($recipes as $recipe) {
                $category = $recipe['category_name'] ?? 'Uncategorized';
                if (!isset($groupedRecipes[$category])) {
                    $groupedRecipes[$category] = [];
                }
                $groupedRecipes[$category][] = $recipe;
            }
            
            return ['success' => true, 'data' => $groupedRecipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getUserFavorites($userId) {
        try {
            $query = "SELECT r.*, u.firstName, u.lastName, c.name as category_name 
                      FROM user_favorites uf 
                      JOIN recipes r ON uf.recipe_id = r.id 
                      JOIN users u ON r.user_id = u.id 
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id 
                      LEFT JOIN categories c ON rc.category_id = c.id 
                      WHERE uf.user_id = :user_id 
                      ORDER BY uf.created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $favorites];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getUserActivity($userId, $limit = 20) {
        try {
            $query = "SELECT ua.*, 
                             CASE 
                                 WHEN ua.target_type = 'recipe' THEN r.title 
                                 ELSE ua.description 
                             END as target_title,
                             CASE 
                                 WHEN ua.target_type = 'recipe' THEN r.image_url 
                                 ELSE NULL 
                             END as target_image
                      FROM user_activity ua 
                      LEFT JOIN recipes r ON ua.target_id = r.id AND ua.target_type = 'recipe'
                      WHERE ua.user_id = :user_id 
                      ORDER BY ua.created_at DESC 
                      LIMIT :limit";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $activities];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function toggleFavorite($userId, $recipeId) {
        try {
            // Check if already favorited
            $query = "SELECT id FROM user_favorites WHERE user_id = :user_id AND recipe_id = :recipe_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':recipe_id', $recipeId);
            $stmt->execute();
            
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($existing) {
                // Remove from favorites
                $query = "DELETE FROM user_favorites WHERE user_id = :user_id AND recipe_id = :recipe_id";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':recipe_id', $recipeId);
                
                if ($stmt->execute()) {
                    $this->logUserActivity($userId, 'recipe_favorited', $recipeId, 'recipe', 'Removed recipe from favorites');
                    return ['success' => true, 'message' => 'Recipe removed from favorites', 'isFavorited' => false];
                }
            } else {
                // Add to favorites
                $query = "INSERT INTO user_favorites (user_id, recipe_id) VALUES (:user_id, :recipe_id)";
                $stmt = $this->db->prepare($query);
                $stmt->bindParam(':user_id', $userId);
                $stmt->bindParam(':recipe_id', $recipeId);
                
                if ($stmt->execute()) {
                    $this->logUserActivity($userId, 'recipe_favorited', $recipeId, 'recipe', 'Added recipe to favorites');
                    return ['success' => true, 'message' => 'Recipe added to favorites', 'isFavorited' => true];
                }
            }
            
            return ['success' => false, 'error' => 'Failed to update favorites'];
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
