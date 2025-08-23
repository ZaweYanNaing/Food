<?php
// Simple test script to verify API endpoints
echo "Testing FoodFusion API...\n\n";

$base_url = 'http://localhost:8080';

// Test 1: Get all recipes
echo "1. Testing GET /recipes\n";
$response = file_get_contents($base_url . '/recipes');
echo "Response: " . $response . "\n\n";

// Test 2: Search recipes
echo "2. Testing GET /recipes/search?q=pancake\n";
$response = file_get_contents($base_url . '/recipes/search?q=pancake');
echo "Response: " . $response . "\n\n";

// Test 3: Test CORS preflight
echo "3. Testing CORS preflight\n";
$context = stream_context_create([
    'http' => [
        'method' => 'OPTIONS',
        'header' => 'Origin: http://localhost:3000'
    ]
]);
$response = file_get_contents($base_url . '/recipes', false, $context);
echo "CORS Response Headers:\n";
foreach ($http_response_header as $header) {
    if (strpos($header, 'Access-Control') !== false) {
        echo $header . "\n";
    }
}
echo "\n";

echo "API test completed!\n";
?>
