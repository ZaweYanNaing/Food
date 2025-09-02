<?php
// Set content type only - CORS headers are handled by Apache .htaccess
header('Content-Type: application/json');

require_once '../config/database.php';
require_once '../controllers/RecipeController.php';
require_once '../controllers/UserController.php';
require_once '../controllers/AuthController.php';
require_once '../controllers/RatingReviewController.php';

// Get the request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);

// Handle OPTIONS requests for CORS preflight
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
            
        case (preg_match('/^\/recipes\/(\d+)\/view$/', $uri, $matches) ? true : false):
            $recipeId = $matches[1];
            $controller = new RecipeController();
            
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? null;
                $result = $controller->trackRecipeView($recipeId, $userId);
                echo json_encode($result);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
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
            
        case '/recipes/cuisine-types':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $result = $controller->getCuisineTypes();
                echo json_encode($result);
            }
            break;
            
        case '/recipes/ingredients':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $result = $controller->getIngredients();
                echo json_encode($result);
            }
            break;
            
        case '/recipes/difficulty-levels':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $result = $controller->getDifficultyLevels();
                echo json_encode($result);
            }
            break;
            
        case '/recipes/trending':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $limit = $_GET['limit'] ?? 10;
                $period = $_GET['period'] ?? 'week';
                $result = $controller->getTrendingRecipes($limit, $period);
                echo json_encode($result);
            }
            break;
            
        case '/recipes/popular':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $limit = $_GET['limit'] ?? 10;
                $result = $controller->getPopularRecipes($limit);
                echo json_encode($result);
            }
            break;
            
        case '/recipes/recent':
            if ($method === 'GET') {
                $controller = new RecipeController();
                $limit = $_GET['limit'] ?? 10;
                $result = $controller->getRecentRecipes($limit);
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
                
                if ($file['size'] > 20 * 1024 * 1024) { // 20MB limit
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'File size too large. Maximum 20MB allowed']);
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
                        'data' => [
                            'image_url' => $imageUrl
                        ]
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
                $fallbackUserId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
                
                $result = $controller->getProfile($token, $fallbackUserId);
                echo json_encode($result);
            } elseif ($method === 'PUT') {
                error_log("=== PUT request received ===");
                $controller = new UserController();
                $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $data = json_decode(file_get_contents('php://input'), true);
                
                // Debug logging
                error_log("Profile update request - Token: " . $token);
                error_log("Profile update data: " . print_r($data, true));
                
                $userId = $controller->getUserIdFromToken($token);
                
                // Fallback to user_id from request body if token extraction fails
                if (!$userId && isset($data['user_id'])) {
                    $userId = intval($data['user_id']);
                    error_log("Using fallback user ID from request body: " . $userId);
                }
                
                // Final fallback for development
                if (!$userId) {
                    $userId = 1;
                    error_log("Using default user ID: " . $userId);
                }
                
                error_log("Final user ID for profile update: " . $userId);
                
                $result = $controller->updateProfile($userId, $data);
                error_log("Update result: " . print_r($result, true));
                echo json_encode($result);
            }
            break;
            
        case '/users/profile/image':
            if ($method === 'POST') {
                $controller = new UserController();
                
                if (!isset($_FILES['image'])) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'No image file provided']);
                    break;
                }
                
                $file = $_FILES['image'];
                $token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                
                // Debug logging
                error_log("=== Profile image upload request ===");
                error_log("Token: " . $token);
                error_log("Files: " . print_r($_FILES, true));
                error_log("POST data: " . print_r($_POST, true));
                
                $userId = $controller->getUserIdFromToken($token);
                
                // Fallback to user_id from POST data if token extraction fails
                if (!$userId && isset($_POST['user_id'])) {
                    $userId = intval($_POST['user_id']);
                    error_log("Using fallback user ID from POST: " . $userId);
                }
                
                // Final fallback for development
                if (!$userId) {
                    $userId = 1;
                    error_log("Using default user ID: " . $userId);
                }
                
                error_log("Final user ID for upload: " . $userId);
                
                $result = $controller->uploadProfileImage($userId, $file);
                
                if (isset($result['success']) && $result['success']) {
                    http_response_code(200);
                } else {
                    http_response_code(400);
                }
                
                echo json_encode($result);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);
            }
            break;
            
        case '/users/stats':
            if ($method === 'GET') {
                $controller = new UserController();
                $userId = $_GET['user_id'] ?? 1; // Mock user ID for now
                $result = $controller->getUserStats($userId);
                echo json_encode($result);
            }
            break;
            
        case '/users/recipes':
            if ($method === 'GET') {
                $controller = new UserController();
                $userId = $_GET['user_id'] ?? 1; // Mock user ID for now
                $result = $controller->getUserRecipes($userId);
                echo json_encode($result);
            }
            break;
            
        case '/users/favorites':
            if ($method === 'GET') {
                $controller = new UserController();
                $userId = $_GET['user_id'] ?? 1; // Mock user ID for now
                $result = $controller->getUserFavorites($userId);
                echo json_encode($result);
            }
            break;
            
        case '/users/activity':
            if ($method === 'GET') {
                $controller = new UserController();
                $userId = $_GET['user_id'] ?? 1; // Mock user ID for now
                $limit = $_GET['limit'] ?? 20;
                $result = $controller->getUserActivity($userId, $limit);
                echo json_encode($result);
            }
            break;
            
        case '/users/favorites/toggle':
            if ($method === 'POST') {
                $controller = new UserController();
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? 1; // Mock user ID for now
                $recipeId = $data['recipe_id'] ?? null;
                
                if (!$recipeId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Recipe ID required']);
                    break;
                }
                
                $result = $controller->toggleFavorite($userId, $recipeId);
                echo json_encode($result);
            }
            break;
            
        case '/users/favorites/cleanup':
            if ($method === 'POST') {
                $controller = new UserController();
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? 1; // Mock user ID for now
                
                $result = $controller->cleanupDuplicateFavorites($userId);
                echo json_encode($result);
            }
            break;
            
        // Recipe Ratings and Reviews endpoints
        case '/recipes/like':
            if ($method === 'POST') {
                $controller = new RatingReviewController();
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? 1;
                $recipeId = $data['recipe_id'] ?? null;
                
                if (!$recipeId) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Recipe ID required']);
                    break;
                }
                
                $result = $controller->toggleLike($userId, $recipeId);
                echo json_encode($result);
            }
            break;
            
        case '/recipes/rate-review':
            if ($method === 'POST') {
                $controller = new RatingReviewController();
                $data = json_decode(file_get_contents('php://input'), true);
                $userId = $data['user_id'] ?? 1;
                $recipeId = $data['recipe_id'] ?? null;
                $rating = $data['rating'] ?? null;
                $reviewText = $data['review_text'] ?? null;
                
                if (!$recipeId || !$rating || !$reviewText) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Recipe ID, rating, and review text required']);
                    break;
                }
                
                $result = $controller->addRatingReview($userId, $recipeId, $rating, $reviewText);
                echo json_encode($result);
            }
            break;
            
        case (preg_match('/^\/recipes\/(\d+)\/ratings-reviews$/', $uri, $matches) ? true : false):
            $recipeId = $matches[1];
            $controller = new RatingReviewController();
            
            if ($method === 'GET') {
                $result = $controller->getRecipeRatingsReviews($recipeId);
                echo json_encode($result);
            }
            break;
            
        case (preg_match('/^\/users\/(\d+)\/ratings-reviews$/', $uri, $matches) ? true : false):
            $userId = $matches[1];
            $controller = new RatingReviewController();
            
            if ($method === 'GET') {
                $result = $controller->getUserRatingsReviews($userId);
                echo json_encode($result);
            }
            break;
            
        case (preg_match('/^\/recipes\/(\d+)\/user-status$/', $uri, $matches) ? true : false):
            $recipeId = $matches[1];
            $controller = new RatingReviewController();
            
            if ($method === 'GET') {
                $userId = $_GET['user_id'] ?? 1;
                $result = $controller->getUserRecipeStatus($userId, $recipeId);
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
