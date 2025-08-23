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
                $result = $controller->getAllRecipes();
                echo json_encode($result);
            } elseif ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $result = $controller->createRecipe($data);
                echo json_encode($result);
            }
            break;
            
        case '/recipes/search':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $query = $_GET['q'] ?? '';
                $result = $controller->searchRecipes($query);
                echo json_encode($result);
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
