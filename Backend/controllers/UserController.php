<?php
require_once '../config/database.php';

class UserController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    public function getProfile($token) {
        try {
            // In a real application, you would validate the token here
            // For now, we'll just return a mock profile
            // You should implement proper JWT token validation
            
            if (empty($token)) {
                return ['success' => false, 'error' => 'Authorization token required'];
            }
            
            // Mock user profile - in production, decode JWT and get user ID
            $query = "SELECT id, username, email, created_at FROM users WHERE id = 1 LIMIT 1";
            $stmt = $this->db->prepare($query);
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
            $query = "UPDATE users SET username = :username, email = :email WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':username', $data['username']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':id', $userId);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Profile updated successfully'];
            } else {
                return ['success' => false, 'error' => 'Failed to update profile'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>
