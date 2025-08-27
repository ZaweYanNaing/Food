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
                             GROUP_CONCAT(c.name) as categories
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      $whereClause
                      GROUP BY r.id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($query);
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
            }
            
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function getRecipeById($id) {
        try {
            $query = "SELECT r.*, u.firstName, u.lastName,
                             GROUP_CONCAT(c.name) as categories
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      WHERE r.id = :id
                      GROUP BY r.id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $recipe = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($recipe) {
                // Process categories
                if ($recipe['categories']) {
                    $recipe['categories'] = explode(',', $recipe['categories']);
                } else {
                    $recipe['categories'] = [];
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
            
            // Insert recipe
            $query = "INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, user_id, image_url, created_at) 
                      VALUES (:title, :description, :ingredients, :instructions, :cooking_time, :difficulty, :user_id, :image_url, NOW())";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? '');
            $stmt->bindValue(':ingredients', $data['ingredients']);
            $stmt->bindValue(':instructions', $data['instructions']);
            $stmt->bindValue(':cooking_time', $data['cooking_time'] ?? null);
            $stmt->bindValue(':difficulty', $data['difficulty'] ?? 'Medium');
            $stmt->bindValue(':user_id', $data['user_id']);
            $stmt->bindValue(':image_url', $data['image_url'] ?? null);
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to create recipe');
            }
            
            $recipeId = $this->db->lastInsertId();
            
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
                      ingredients = :ingredients, 
                      instructions = :instructions, 
                      cooking_time = :cooking_time, 
                      difficulty = :difficulty, 
                      image_url = :image_url,
                      updated_at = NOW()
                      WHERE id = :id";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindValue(':title', $data['title']);
            $stmt->bindValue(':description', $data['description'] ?? '');
            $stmt->bindValue(':ingredients', $data['ingredients']);
            $stmt->bindValue(':instructions', $data['instructions']);
            $stmt->bindValue(':cooking_time', $data['cooking_time'] ?? null);
            $stmt->bindValue(':difficulty', $data['difficulty'] ?? 'Medium');
            $stmt->bindValue(':image_url', $data['image_url'] ?? null);
            $stmt->bindValue(':id', $id);
            
            if (!$stmt->execute()) {
                throw new Exception('Failed to update recipe');
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
            
            return ['success' => true, 'message' => 'Recipe deleted successfully'];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function searchRecipes($query, $filters = []) {
        try {
            $whereClause = "WHERE (r.title LIKE :search OR r.description LIKE :search OR r.ingredients LIKE :search)";
            $params = [':search' => "%$query%"];
            
            // Apply additional filters
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
            
            $query = "SELECT r.*, u.firstName, u.lastName,
                             GROUP_CONCAT(c.name) as categories
                      FROM recipes r 
                      LEFT JOIN users u ON r.user_id = u.id
                      LEFT JOIN recipe_categories rc ON r.id = rc.recipe_id
                      LEFT JOIN categories c ON rc.category_id = c.id
                      $whereClause
                      GROUP BY r.id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
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
}
?>
