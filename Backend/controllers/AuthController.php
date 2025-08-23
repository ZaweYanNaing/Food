<?php
require_once '../config/database.php';

class AuthController {
    private $db;
    
    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }
    
    public function login($data) {
        try {
            // Validate input
            if (empty($data['email']) || empty($data['password'])) {
                http_response_code(400);
                return [
                    'success' => false,
                    'message' => 'Email and password are required'
                ];
            }

            $query = "SELECT id, firstName, lastName, email, password FROM users WHERE email = :email LIMIT 1";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':email', $data['email']);
            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($data['password'], $user['password'])) {
                // Generate a simple token (in production, use JWT)
                $token = bin2hex(random_bytes(32));
                
                // Store token in database (you might want to add a tokens table)
                return [
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'firstName' => $user['firstName'],
                        'lastName' => $user['lastName'],
                        'email' => $user['email']
                    ],
                    'token' => $token
                ];
            } else {
                http_response_code(401);
                return [
                    'success' => false,
                    'message' => 'Invalid email or password'
                ];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Internal server error'
            ];
        }
    }
    
    public function register($data) {
        try {
            // Validate input
            if (empty($data['firstName']) || empty($data['lastName']) || empty($data['email']) || empty($data['password'])) {
                http_response_code(400);
                return [
                    'success' => false,
                    'message' => 'All fields are required'
                ];
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                return [
                    'success' => false,
                    'message' => 'Invalid email format'
                ];
            }

            // Validate password length
            if (strlen($data['password']) < 6) {
                http_response_code(400);
                return [
                    'success' => false,
                    'message' => 'Password must be at least 6 characters long'
                ];
            }

            // Check if user already exists
            $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 1";
            $checkStmt = $this->db->prepare($checkQuery);
            $checkStmt->bindParam(':email', $data['email']);
            $checkStmt->execute();
            
            if ($checkStmt->fetch()) {
                http_response_code(409);
                return [
                    'success' => false,
                    'message' => 'User already exists with this email'
                ];
            }
            
            // Hash password
            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Insert new user
            $query = "INSERT INTO users (firstName, lastName, email, password, created_at) VALUES (:firstName, :lastName, :email, :password, NOW())";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':firstName', $data['firstName']);
            $stmt->bindParam(':lastName', $data['lastName']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':password', $hashedPassword);
            
            if ($stmt->execute()) {
                $userId = $this->db->lastInsertId();
                
                // Get the created user
                $userQuery = "SELECT id, firstName, lastName, email FROM users WHERE id = :id LIMIT 1";
                $userStmt = $this->db->prepare($userQuery);
                $userStmt->bindParam(':id', $userId);
                $userStmt->execute();
                $newUser = $userStmt->fetch(PDO::FETCH_ASSOC);
                
                // Generate token
                $token = bin2hex(random_bytes(32));
                
                return [
                    'success' => true,
                    'message' => 'User registered successfully',
                    'user' => $newUser,
                    'token' => $token
                ];
            } else {
                http_response_code(500);
                return [
                    'success' => false,
                    'message' => 'Failed to register user'
                ];
            }
        } catch (Exception $e) {
            http_response_code(500);
            return [
                'success' => false,
                'message' => 'Internal server error'
            ];
        }
    }
}
?>
