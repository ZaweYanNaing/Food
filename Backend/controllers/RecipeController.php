<?php
require_once '../config/database.php';

class RecipeController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    public function getAllRecipes() {
        try {
            $query = "SELECT * FROM recipes ORDER BY created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function createRecipe($data) {
        try {
            $query = "INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, user_id, created_at) 
                      VALUES (:title, :description, :ingredients, :instructions, :cooking_time, :difficulty, :user_id, NOW())";
            
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':ingredients', $data['ingredients']);
            $stmt->bindParam(':instructions', $data['instructions']);
            $stmt->bindParam(':cooking_time', $data['cooking_time']);
            $stmt->bindParam(':difficulty', $data['difficulty']);
            $stmt->bindParam(':user_id', $data['user_id']);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Recipe created successfully', 'id' => $this->db->lastInsertId()];
            } else {
                return ['success' => false, 'error' => 'Failed to create recipe'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function searchRecipes($query) {
        try {
            $searchQuery = "%" . $query . "%";
            $query = "SELECT * FROM recipes WHERE title LIKE :search OR description LIKE :search OR ingredients LIKE :search ORDER BY created_at DESC";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':search', $searchQuery);
            $stmt->execute();
            
            $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return ['success' => true, 'data' => $recipes];
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>
