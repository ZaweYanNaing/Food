<?php
require_once '../config/database.php';

class RecipeController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    public function getAllRecipes($filters = []) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            // Apply filters
            if (!empty($filters['category'])) {
                $whereClause .= " AND r.id IN (SELECT recipe_id FROM recipe_categories WHERE category_id = :category_id)";
                $params[':category_id'] = $filters['category'];
            }
            
            if (!empty($filters['difficulty'])) {
                $whereClause .= " AND r.difficulty = :difficulty";
                $params[':difficulty'] = $filters['difficulty'];
            }
            
            if (!empty($filters['max_cooking_time'])) {
                $whereClause .= " AND r.cooking_time <= :max_cooking_time";
                $params[':max_cooking_time'] = $filters['max_cooking_time'];
            }
            
            if (!empty($filters['user_id'])) {
                $whereClause .= " AND r.user_id = :user_id";
                $params[':user_id'] = $filters['user_id'];
            }
            
                        $query = "SELECT r.*, u.firstName, u.lastName, 
                                  GROUP_CONCAT(DISTINCT c.name) as categories,
                                  ct.name as cuisine_type,
                                  GROUP_CONCAT(DISTINCT CONCAT(i.name, ':', ri.quantity, ' ', ri.unit) SEPARATOR '|') as ingredients
                            FROM recipes r 
                            LEFT JOIN users u ON r.user_id = u.id
                            LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                            LEFT JOIN categories c ON rc.category_id = c.id
                            LEFT JOIN cuisine_types ct ON r.cuisine_type_id = ct.id
                            LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                            LEFT JOIN ingredients i ON ri.ingredient_id = i.id
                            $whereClause
                            GROUP BY r.id
                            ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Process categories, cuisine types, and ingredients strings to arrays
            foreach ($recipes as &$recipe) {
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
                
                if ($recipe['cuisine_type']) {
                    $recipe['cuisine_type'] = $recipe['cuisine_type'];
                } else {
                    $recipe['cuisine_type'] = null;
                }
                
                if ($recipe['ingredients']) {
                    $ingredientsArray = [];
                    $ingredientParts = explode('|', $recipe['ingredients']);
                    foreach ($ingredientParts as $part) {
                        if (strpos($part, ':') !== false) {
                            list($name, $quantity) = explode(':', $part, 2);
                            $ingredientsArray[] = [
                                'name' => $name,
                                'quantity' => $quantity
                            ];
                        }
                    }
                    $recipe['ingredients'] = $ingredientsArray;
                } else {
                    $recipe['ingredients'] = [];
                }
            }
            
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getRecipeById($id) {
        try {
            $query = "SELECT r.*, u.firstName, u.lastName,
                             GROUP_CONCAT(DISTINCT c.name) as categories,
                             ct.name as cuisine_type,
                             GROUP_CONCAT(DISTINCT CONCAT(i.name, ':', ri.quantity, ' ', ri.unit) SEPARATOR '|') as ingredients
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      LEFT JOIN cuisine_types ct ON r.cuisine_type_id = ct.id
                      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
                      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
                      WHERE r.id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($recipe) {
                // Process categories, cuisine types, and ingredients
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
                
                if ($recipe['cuisine_type']) {
                    $recipe['cuisine_type'] = $recipe['cuisine_type'];
                } else {
                    $recipe['cuisine_type'] = null;
                }
                
                if ($recipe['ingredients']) {
                    $ingredientsArray = [];
                    $ingredientParts = explode('|', $recipe['ingredients']);
                    foreach ($ingredientParts as $part) {
                        if (strpos($part, ':') !== false) {
                            list($name, $quantity) = explode(':', $part, 2);
                            $ingredientsArray[] = [
                                'name' => $name,
                                'quantity' => $quantity
                            ];
                        }
                    }
                    $recipe['ingredients'] = $ingredientsArray;
                } else {
                    $recipe['ingredients'] = [];
                }
                
                return ['success' => true, 'data' => $recipe];
            } else {
                return ['success' => false, 'error' => 'Recipe not found'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function createRecipe($data) {
        try {
            // Validate required fields
            if (empty($data['title']) || empty($data['ingredients']) || empty($data['instructions'])) {
                return ['success' => false, 'error' => 'Title, ingredients, and instructions are required'];
            }
            
            // Start transaction
            $this->db->beginTransaction();
            
            // Insert recipe (without ingredients field)
            $query = "INSERT INTO recipes (title, description, instructions, cooking_time, difficulty, user_id, image_url, servings, created_at) 
                      VALUES (:title, :description, :instructions, :cooking_time, :difficulty, :user_id, :image_url, :servings, NOW())";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? '');
            $stmt->bindValue(':instructions', $data['instructions']);
            $stmt->bindValue(':cooking_time', $data['cooking_time'] ?? null);
            $stmt->bindValue(':difficulty', $data['difficulty'] ?? 'Medium');
            $stmt->bindValue(':user_id', $data['user_id']);
            $stmt->bindValue(':image_url', $data['image_url'] ?? null);
            $stmt->bindValue(':servings', $data['servings'] ?? null);
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to create recipe');
            }
            
            $recipeId = $this->db->lastInsertId();
            
            // Handle ingredients
            if (!empty($data['ingredients']) && is_array($data['ingredients'])) {
                foreach ($data['ingredients'] as $ingredient) {
                    // Check if ingredient exists, if not create it
                    $ingredientId = $this->getOrCreateIngredient($ingredient['name']);
                    
                    // Insert recipe-ingredient relationship
                    $ingQuery = "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
                                VALUES (:recipe_id, :ingredient_id, :quantity, :unit)";
                    $ingStmt = $this->db->prepare($ingQuery);
                    $ingStmt->bindValue(':recipe_id', $recipeId);
                    $ingStmt->bindValue(':ingredient_id', $ingredientId);
                    $ingStmt->bindValue(':quantity', $ingredient['quantity']);
                    $ingStmt->bindValue(':unit', $ingredient['unit'] ?? '');
                    $ingStmt->execute();
                }
            }
            
            // Handle cuisine type
            if (!empty($data['cuisine_type'])) {
                // Check if cuisine type exists, if not create it
                $cuisineTypeId = $this->getOrCreateCuisineType($data['cuisine_type']);
                
                // Update recipe with cuisine type
                $cuisineQuery = "UPDATE recipes SET cuisine_type_id = :cuisine_type_id WHERE id = :recipe_id";
                $cuisineStmt = $this->db->prepare($cuisineQuery);
                $cuisineStmt->bindValue(':cuisine_type_id', $cuisineTypeId);
                $cuisineStmt->bindValue(':recipe_id', $recipeId);
                $cuisineStmt->execute();
            }
            
            // Handle categories
            if (!empty($data['categories']) && is_array($data['categories'])) {
                foreach ($data['categories'] as $categoryId) {
                    $catQuery = "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (:recipe_id, :category_id)";
                    $catStmt = $this->db->prepare($catQuery);
                    $catStmt->bindParam(':recipe_id', $recipeId);
                    $catStmt->bindParam(':category_id', $categoryId);
                    $catStmt->execute();
                }
            }
            
            $this->db->commit();
            
            // Log user activity
            $this->logUserActivity($data['user_id'], 'recipe_created', $recipeId, 'recipe', 'Created new recipe: ' . $data['title']);
            
            return [
                'success' => true, 
                'message' => 'Recipe created successfully', 
                'id' => $recipeId
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function updateRecipe($id, $data) {
        try {
            // Check if recipe exists and user owns it
            $checkQuery = "SELECT user_id FROM recipes WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            $recipe = $checkStmt->fetch(PDO::FETCH_ASSOC);
            if (!$recipe) {
                return ['success' => false, 'error' => 'Recipe not found'];
            }
            
            // Debug logging
            error_log("Recipe update debug - Recipe ID: $id");
            error_log("Recipe user_id from DB: " . $recipe['user_id'] . " (type: " . gettype($recipe['user_id']) . ")");
            error_log("Request user_id: " . $data['user_id'] . " (type: " . gettype($data['user_id']) . ")");
            error_log("Comparison result: " . ($recipe['user_id'] == $data['user_id'] ? 'TRUE' : 'FALSE'));
            
            if ($recipe['user_id'] != $data['user_id']) {
                return ['success' => false, 'error' => 'You can only edit your own recipes'];
            }
            
            // Start transaction
            $this->db->beginTransaction();
            
            // Update recipe
            $query = "UPDATE recipes SET 
                      title = :title, 
                      description = :description, 
                      instructions = :instructions, 
                      cooking_time = :cooking_time, 
                      difficulty = :difficulty, 
                      servings = :servings,
                      image_url = :image_url,
                      updated_at = NOW()
                      WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? '');
            $stmt->bindValue(':instructions', $data['instructions']);
            $stmt->bindValue(':cooking_time', $data['cooking_time'] ?? null);
            $stmt->bindValue(':difficulty', $data['difficulty'] ?? 'Medium');
            $stmt->bindValue(':servings', $data['servings'] ?? null);
            $stmt->bindValue(':image_url', $data['image_url'] ?? null);
            $stmt->bindValue(':id', $id);
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to update recipe');
            }
            
            // Update ingredients
            if (isset($data['ingredients'])) {
                // Remove existing ingredients
                $deleteIngQuery = "DELETE FROM recipe_ingredients WHERE recipe_id = :recipe_id";
                $deleteIngStmt = $this->db->prepare($deleteIngQuery);
                $deleteIngStmt->bindParam(':recipe_id', $id);
                $deleteIngStmt->execute();
                
                // Add new ingredients
                if (is_array($data['ingredients'])) {
                    foreach ($data['ingredients'] as $ingredient) {
                        // Check if ingredient exists, if not create it
                        $ingredientId = $this->getOrCreateIngredient($ingredient['name']);
                        
                        // Insert recipe-ingredient relationship
                        $ingQuery = "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) 
                                    VALUES (:recipe_id, :ingredient_id, :quantity, :unit)";
                        $ingStmt = $this->db->prepare($ingQuery);
                        $ingStmt->bindValue(':recipe_id', $id);
                        $ingStmt->bindValue(':ingredient_id', $ingredientId);
                        $ingStmt->bindValue(':quantity', $ingredient['quantity']);
                        $ingStmt->bindValue(':unit', $ingredient['unit'] ?? '');
                        $ingStmt->execute();
                    }
                }
            }
            
            // Update cuisine type
            if (isset($data['cuisine_type'])) {
                if (!empty($data['cuisine_type'])) {
                    // Check if cuisine type exists, if not create it
                    $cuisineTypeId = $this->getOrCreateCuisineType($data['cuisine_type']);
                    
                    // Update recipe with cuisine type
                    $cuisineQuery = "UPDATE recipes SET cuisine_type_id = :cuisine_type_id WHERE id = :recipe_id";
                    $cuisineStmt = $this->db->prepare($cuisineQuery);
                    $cuisineStmt->bindValue(':cuisine_type_id', $cuisineTypeId);
                    $cuisineStmt->bindValue(':recipe_id', $id);
                    $cuisineStmt->execute();
                } else {
                    // Remove cuisine type
                    $cuisineQuery = "UPDATE recipes SET cuisine_type_id = NULL WHERE id = :recipe_id";
                    $cuisineStmt = $this->db->prepare($cuisineQuery);
                    $cuisineStmt->bindValue(':recipe_id', $id);
                    $cuisineStmt->execute();
                }
            }
            
            // Update categories
            if (isset($data['categories'])) {
                // Remove existing categories
                $deleteCatQuery = "DELETE FROM recipe_categories WHERE recipe_id = :recipe_id";
                $deleteCatStmt = $this->db->prepare($deleteCatQuery);
                $deleteCatStmt->bindParam(':recipe_id', $id);
                $deleteCatStmt->execute();
                
                // Add new categories
                if (is_array($data['categories'])) {
                    foreach ($data['categories'] as $categoryId) {
                        $catQuery = "INSERT INTO recipe_categories (recipe_id, category_id) VALUES (:recipe_id, :category_id)";
                        $catStmt = $this->db->prepare($catQuery);
                        $catStmt->bindParam(':recipe_id', $id);
                        $catStmt->bindParam(':category_id', $categoryId);
                        $catStmt->execute();
                    }
                }
            }
            
            $this->db->commit();
            
            // Log user activity
            $this->logUserActivity($data['user_id'], 'recipe_updated', $id, 'recipe', 'Updated recipe: ' . $data['title']);
            
            return ['success' => true, 'message' => 'Recipe updated successfully'];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function deleteRecipe($id, $userId) {
        try {
            // Check if recipe exists and user owns it
            $checkQuery = "SELECT user_id FROM recipes WHERE id = :id";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':id', $id);
            $checkStmt->execute();
            
            $recipe = $checkStmt->fetch(PDO::FETCH_ASSOC);
            if (!$recipe) {
                return ['success' => false, 'error' => 'Recipe not found'];
            }
            
            if ($recipe['user_id'] != $userId) {
                return ['success' => false, 'error' => 'You can only delete your own recipes'];
            }
            
            // Start transaction
            $this->db->beginTransaction();
            
            // Delete recipe categories first
            $deleteCatQuery = "DELETE FROM recipe_categories WHERE recipe_id = :recipe_id";
            $deleteCatStmt = $this->db->prepare($deleteCatQuery);
            $deleteCatStmt->bindParam(':recipe_id', $id);
            $deleteCatStmt->execute();
            
            // Delete recipe
            $deleteQuery = "DELETE FROM recipes WHERE id = :id";
            $deleteStmt = $this->db->prepare($deleteQuery);
            $deleteStmt->bindParam(':id', $id);
            
            if (!$deleteStmt->execute()) {
                throw new Exception('Failed to delete recipe');
            }
            
            $this->db->commit();
            
            // Log user activity
            $this->logUserActivity($userId, 'recipe_deleted', $id, 'recipe', 'Deleted recipe');
            
            return ['success' => true, 'message' => 'Recipe deleted successfully'];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function searchRecipes($query, $filters = []) {
        try {
            $whereClause = "WHERE 1=1";
            $params = [];
            
            // Search in title, description, ingredients
            if (!empty($query)) {
                $whereClause .= " AND (r.title LIKE :search_query OR r.description LIKE :search_query OR r.ingredients LIKE :search_query)";
                $params[':search_query'] = "%$query%";
            }
            
            // Apply filters
            if (!empty($filters['category'])) {
                $whereClause .= " AND r.id IN (SELECT recipe_id FROM recipe_categories WHERE category_id = :category_id)";
                $params[':category_id'] = $filters['category'];
            }
            
            if (!empty($filters['difficulty'])) {
                $whereClause .= " AND r.difficulty = :difficulty";
                $params[':difficulty'] = $filters['difficulty'];
            }
            
            if (!empty($filters['max_cooking_time'])) {
                $whereClause .= " AND r.cooking_time <= :max_cooking_time";
                $params[':max_cooking_time'] = $filters['max_cooking_time'];
            }
            
            if (!empty($filters['min_cooking_time'])) {
                $whereClause .= " AND r.cooking_time >= :min_cooking_time";
                $params[':min_cooking_time'] = $filters['min_cooking_time'];
            }
            
            if (!empty($filters['cuisine_type'])) {
                $whereClause .= " AND r.cuisine_type = :cuisine_type";
                $params[':cuisine_type'] = $filters['cuisine_type'];
            }
            
            if (!empty($filters['servings'])) {
                $whereClause .= " AND r.servings = :servings";
                $params[':servings'] = $filters['servings'];
            }
            
            if (!empty($filters['ingredients'])) {
                $whereClause .= " AND r.ingredients LIKE :ingredients";
                $params[':ingredients'] = "%{$filters['ingredients']}%";
            }
            
            $sql = "SELECT r.*, u.firstName, u.lastName, 
                             GROUP_CONCAT(c.name) as categories,
                             COALESCE(rr.avg_rating, 0) as average_rating,
                             COALESCE(rr.total_ratings, 0) as total_ratings,
                             COALESCE(rl.total_likes, 0) as total_likes
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      LEFT JOIN (
                          SELECT recipe_id, 
                                 AVG(rating) as avg_rating, 
                                 COUNT(*) as total_ratings
                          FROM recipe_ratings 
                          GROUP BY recipe_id
                      ) rr ON r.id = rr.recipe_id
                      LEFT JOIN (
                          SELECT recipe_id, COUNT(*) as total_likes
                          FROM recipe_likes 
                          GROUP BY recipe_id
                      ) rl ON r.id = rl.recipe_id
                      $whereClause
                      GROUP BY r.id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($sql);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Process categories string to array
            foreach ($recipes as &$recipe) {
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
                
                // Convert to numeric types
                $recipe['average_rating'] = (float) $recipe['average_rating'];
                $recipe['total_ratings'] = (int) $recipe['total_ratings'];
                $recipe['total_likes'] = (int) $recipe['total_likes'];
            }
            
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getCategories() {
        try {
            $query = "SELECT * FROM categories ORDER BY name";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $categories];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getTrendingRecipes($limit = 10, $period = 'week') {
        try {
            $dateFilter = '';
            switch ($period) {
                case 'day':
                    $dateFilter = 'AND r.created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)';
                    break;
                case 'week':
                    $dateFilter = 'AND r.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
                    break;
                case 'month':
                    $dateFilter = 'AND r.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
                    break;
                default:
                    $dateFilter = 'AND r.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
            }
            
            $query = "SELECT r.id, r.title, r.description, r.instructions, r.cooking_time, 
                             r.difficulty, r.image_url, r.user_id, r.created_at, r.servings,
                             ct.name as cuisine_type,
                             u.firstName, u.lastName,
                             GROUP_CONCAT(DISTINCT c.name) as categories,
                             COALESCE(rr.avg_rating, 0) as average_rating,
                             COALESCE(rr.total_ratings, 0) as total_ratings,
                             COALESCE(rl.total_likes, 0) as total_likes,
                             COALESCE(rv.total_views, 0) as total_views
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN cuisine_types ct ON r.cuisine_type_id = ct.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      LEFT JOIN (
                          SELECT recipe_id, 
                                 AVG(CAST(rating AS DECIMAL(3,2))) as avg_rating, 
                                 COUNT(*) as total_ratings
                          FROM recipe_reviews 
                          GROUP BY recipe_id
                      ) rr ON r.id = rr.recipe_id
                      LEFT JOIN (
                          SELECT recipe_id, COUNT(*) as total_likes
                          FROM recipe_likes 
                          GROUP BY recipe_id
                      ) rl ON r.id = rl.recipe_id
                      LEFT JOIN (
                          SELECT recipe_id, COUNT(*) as total_views
                          FROM recipe_views 
                          GROUP BY recipe_id
                      ) rv ON r.id = rv.recipe_id
                      WHERE 1=1 $dateFilter
                      GROUP BY r.id, r.title, r.description, r.instructions, r.cooking_time, 
                               r.difficulty, r.image_url, r.user_id, r.created_at, r.servings,
                               ct.name, u.firstName, u.lastName
                      ORDER BY (COALESCE(rr.total_ratings, 0) * 0.3 + 
                               COALESCE(rl.total_likes, 0) * 0.4 + 
                               COALESCE(rv.total_views, 0) * 0.3) DESC,
                               r.created_at DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Process categories string to array
            foreach ($recipes as &$recipe) {
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
                
                // Convert to numeric types
                $recipe['average_rating'] = (float) $recipe['average_rating'];
                $recipe['total_ratings'] = (int) $recipe['total_ratings'];
                $recipe['total_likes'] = (int) $recipe['total_likes'];
                $recipe['total_views'] = (int) $recipe['total_views'];
            }
            
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getPopularRecipes($limit = 10) {
        try {
            $query = "SELECT r.id, r.title, r.description, r.instructions, r.cooking_time, 
                             r.difficulty, r.image_url, r.user_id, r.created_at, r.servings,
                             ct.name as cuisine_type,
                             u.firstName, u.lastName,
                             GROUP_CONCAT(DISTINCT c.name) as categories,
                             COALESCE(rr.avg_rating, 0) as average_rating,
                             COALESCE(rr.total_ratings, 0) as total_ratings,
                             COALESCE(rl.total_likes, 0) as total_likes
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN cuisine_types ct ON r.cuisine_type_id = ct.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      LEFT JOIN (
                          SELECT recipe_id, 
                                 AVG(CAST(rating AS DECIMAL(3,2))) as avg_rating, 
                                 COUNT(*) as total_ratings
                          FROM recipe_reviews 
                          GROUP BY recipe_id
                      ) rr ON r.id = rr.recipe_id
                      LEFT JOIN (
                          SELECT recipe_id, COUNT(*) as total_likes
                          FROM recipe_likes 
                          GROUP BY recipe_id
                      ) rl ON r.id = rl.recipe_id
                      GROUP BY r.id, r.title, r.description, r.instructions, r.cooking_time, 
                               r.difficulty, r.image_url, r.user_id, r.created_at, r.servings,
                               ct.name, u.firstName, u.lastName
                      HAVING total_ratings > 0 OR total_likes > 0
                      ORDER BY (COALESCE(rr.total_ratings, 0) * 0.5 + 
                               COALESCE(rl.total_likes, 0) * 0.5) DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Process categories string to array
            foreach ($recipes as &$recipe) {
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
                
                // Convert to numeric types
                $recipe['average_rating'] = (float) $recipe['average_rating'];
                $recipe['total_ratings'] = (int) $recipe['total_ratings'];
                $recipe['total_likes'] = (int) $recipe['total_likes'];
            }
            
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getRecentRecipes($limit = 10) {
        try {
            $query = "SELECT r.id, r.title, r.description, r.instructions, r.cooking_time, 
                             r.difficulty, r.image_url, r.user_id, r.created_at, r.servings,
                             ct.name as cuisine_type,
                             u.firstName, u.lastName,
                             GROUP_CONCAT(DISTINCT c.name) as categories,
                             COALESCE(rr.avg_rating, 0) as average_rating,
                             COALESCE(rr.total_ratings, 0) as total_ratings,
                             COALESCE(rl.total_likes, 0) as total_likes
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN cuisine_types ct ON r.cuisine_type_id = ct.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      LEFT JOIN (
                          SELECT recipe_id, 
                                 AVG(CAST(rating AS DECIMAL(3,2))) as avg_rating, 
                                 COUNT(*) as total_ratings
                          FROM recipe_reviews 
                          GROUP BY recipe_id
                      ) rr ON r.id = rr.recipe_id
                      LEFT JOIN (
                          SELECT recipe_id, COUNT(*) as total_likes
                          FROM recipe_likes 
                          GROUP BY recipe_id
                      ) rl ON r.id = rl.recipe_id
                      GROUP BY r.id, r.title, r.description, r.instructions, r.cooking_time, 
                               r.difficulty, r.image_url, r.user_id, r.created_at, r.servings,
                               ct.name, u.firstName, u.lastName
                      ORDER BY r.created_at DESC
                      LIMIT :limit";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Process categories string to array
            foreach ($recipes as &$recipe) {
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
                
                // Convert to numeric types
                $recipe['average_rating'] = (float) $recipe['average_rating'];
                $recipe['total_ratings'] = (int) $recipe['total_ratings'];
                $recipe['total_likes'] = (int) $recipe['total_likes'];
            }
            
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getCuisineTypes() {
        try {
            $query = "SELECT id, name, description FROM cuisine_types ORDER BY name ASC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $cuisineTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $cuisineTypes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getDifficultyLevels() {
        return ['success' => true, 'data' => ['Easy', 'Medium', 'Hard']];
    }
    
    public function getIngredients() {
        try {
            $query = "SELECT id, name FROM ingredients ORDER BY name ASC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $ingredients = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return ['success' => true, 'data' => $ingredients];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getUserRecipes($userId) {
        try {
            $query = "SELECT r.*, u.firstName, u.lastName, GROUP_CONCAT(c.name) as categories
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      WHERE r.user_id = :user_id
                      GROUP BY r.id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Process categories
            foreach ($recipes as &$recipe) {
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
                }
            }
            
            return ['success' => true, 'data' => $recipes];
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
    
    /**
     * Get or create an ingredient
     */
    private function getOrCreateIngredient($name) {
        try {
            // First try to find existing ingredient
            $query = "SELECT id FROM ingredients WHERE name = :name";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            
            $ingredient = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($ingredient) {
                return $ingredient['id'];
            }
            
            // Create new ingredient if it doesn't exist
            $insertQuery = "INSERT INTO ingredients (name) VALUES (:name)";
            $insertStmt = $this->db->prepare($insertQuery);
            $insertStmt->bindParam(':name', $name);
            $insertStmt->execute();
            
            return $this->db->lastInsertId();
        } catch (Exception $e) {
            error_log("Error in getOrCreateIngredient: " . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * Get or create a cuisine type
     */
    private function getOrCreateCuisineType($name) {
        try {
            // First try to find existing cuisine type
            $query = "SELECT id FROM cuisine_types WHERE name = :name";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->execute();
            
            $cuisineType = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($cuisineType) {
                return $cuisineType['id'];
            }
            
            // Create new cuisine type if it doesn't exist
            $insertQuery = "INSERT INTO cuisine_types (name) VALUES (:name)";
            $insertStmt = $this->db->prepare($insertQuery);
            $insertStmt->bindParam(':name', $name);
            $insertStmt->execute();
            
            return $this->db->lastInsertId();
        } catch (Exception $e) {
            error_log("Error in getOrCreateCuisineType: " . $e->getMessage());
            throw $e;
        }
    }
}
?>
