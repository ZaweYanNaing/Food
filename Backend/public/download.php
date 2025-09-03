<?php
// Download endpoint for educational resources
require_once '../config/database.php';
require_once '../controllers/EducationalResourcesController.php';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Get the resource ID from URL
$path = $_SERVER['REQUEST_URI'];
$matches = [];
if (preg_match('/\/download\.php\/(\d+)/', $path, $matches)) {
    $resourceId = $matches[1];
    
    $controller = new EducationalResourcesController();
    $result = $controller->downloadResource($resourceId);
    
    if ($result['success']) {
        // Clear any existing headers
        header_remove();
        
        // Set headers for file download
        header('Content-Type: ' . $result['mime_type']);
        header('Content-Disposition: attachment; filename="' . $result['file_name'] . '"');
        header('Content-Length: ' . filesize($result['file_path']));
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Access-Control-Allow-Origin: *');
        
        // Output the file
        if (readfile($result['file_path']) === false) {
            // If readfile fails, return error
            header_remove();
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to read file']);
            exit();
        }
        exit();
    } else {
        // For errors, return JSON
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode($result);
    }
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Invalid resource ID']);
}
?>
