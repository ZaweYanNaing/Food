<?php
// Set content type only - CORS headers are handled by Apache .htaccess
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../controllers/RecipeController.php';
require_once '../controllers/UserController.php';
require_once '../controllers/AuthController.php';

// Get the request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);

// Simple routing
try {
    switch ($uri) {
        case '/recipes':
            $controller = new RecipeController();
            if ($method === 'GET') {
                $filters = [];
                if (isset($_GET['category'])) $filters['category'] = $_GET['category'];
                if (isset($_GET['difficulty'])) $filters['difficulty'] = $_GET['difficulty'];
                if (isset($_GET['max_cooking_time'])) $filters['max_cooking_time'] = $_GET['max_cooking_time'];
                if (isset($_GET['user_id'])) $filters['user_id'] = $_GET['user_id'];
                
                $result = $controller->getAllRecipes($filters);
                echo json_encode($result);
            } elseif ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->createRecipe($data);
                echo json_encode($result);
            }
            break;
            
        case (preg_match('/^\/recipes\/(\d+)$/', $uri, $matches) ? true : false):
            $recipeId = $matches[1];
            $controller = new RecipeController();
            
            if ($method === 'GET') {
                $result = $controller->getRecipeById($recipeId);
                echo json_encode($result);
            } elseif ($method === 'PUT') {
                $data = json_decode(file_get_contents('php://input'), true);
                $data['id'] = $recipeId;
                $result = $controller->updateRecipe($recipeId, $data);
                echo json_encode($result);
            } elseif ($method === 'DELETE') {
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? null;
                if (!$userId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'User ID required for deletion']);
                    break;
                }
                $result = $controller->deleteRecipe($recipeId, $userId);
                echo json_encode($result);
            }
            break;
            
        case '/recipes/search':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $query = $_GET['q'] ?? '';
                $filters = [];
                if (isset($_GET['category'])) $filters['category'] = $_GET['category'];
                if (isset($_GET['difficulty'])) $filters['difficulty'] = $_GET['difficulty'];
                if (isset($_GET['max_cooking_time'])) $filters['max_cooking_time'] = $_GET['max_cooking_time'];
                
                $result = $controller->searchRecipes($query, $filters);
                echo json_encode($result);
            }
            break;
            
        case '/recipes/categories':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $result = $controller->getCategories();
                echo json_encode($result);
            }
            break;
            
        case '/recipes/user':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $userId = $_GET['user_id'] ?? null;
                if (!$userId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'User ID required']);
                    break;
                }
                $result = $controller->getUserRecipes($userId);
                echo json_encode($result);
            }
            break;
            
        case '/upload/image':
            if ($method === 'POST') {
                // Handle image upload
                if (!isset($_FILES['image'])) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'No image file provided']);
                    break;
                }
                
                $file = $_FILES['image'];
                $userId = $_POST['user_id'] ?? null;
                
                if (!$userId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'User ID required']);
                    break;
                }
                
                // Validate file
                $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (!in_array($file['type'], $allowedTypes)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, and GIF are allowed']);
                    break;
                }
                
                if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'File size too large. Maximum 5MB allowed']);
                    break;
                }
                
                // Create uploads directory if it doesn't exist
                $uploadDir = '../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                // Generate unique filename
                $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
                $filename = 'recipe_' . $userId . '_' . time() . '.' . $extension;
                $filepath = $uploadDir . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    $imageUrl = '/uploads/' . $filename;
                    echo json_encode([
                        'success' => true, 
                        'message' => 'Image uploaded successfully',
                        'image_url' => $imageUrl
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'error' => 'Failed to save image']);
                }
            }
            break;
            
        case '/auth/login':
            if ($method === 'POST') {
                $controller = new AuthController();
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->login($data);
                
                // Set HTTP status code based on result
                if (isset($result['success']) && $result['success']) {
                    http_response_code(200);
                }
                // Status code is already set in the controller
                
                echo json_encode($result);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case '/auth/register':
            if ($method === 'POST') {
                $controller = new AuthController();
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->register($data);
                
                // Set HTTP status code based on result
                if (isset($result['success']) && $result['success']) {
                    http_response_code(201);
                }
                // Status code is already set in the controller
                
                echo json_encode($result);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case '/users/profile':
            if ($method === 'GET') {
                $controller = new UserController();
                $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $result = $controller->getProfile($token);
                echo json_encode($result);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
