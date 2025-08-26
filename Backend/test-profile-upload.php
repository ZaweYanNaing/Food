<?php
// Test script for profile image upload
require_once 'controllers/UserController.php';

echo "=== Testing Profile Image Upload ===\n";

// Test with a mock file
$mockFile = [
    'name' => 'test_profile.jpg',
    'type' => 'image/jpeg',
    'tmp_name' => '/tmp/test_file',
    'error' => 0,
    'size' => 1024
];

$controller = new UserController();
$userId = 1; // Test with user ID 1

echo "Testing upload with user ID: $userId\n";
echo "Mock file: " . print_r($mockFile, true) . "\n";

// Test the upload method
$result = $controller->uploadProfileImage($userId, $mockFile);

echo "Upload result: " . print_r($result, true) . "\n";

// Test profile retrieval
echo "\n=== Testing Profile Retrieval ===\n";
$profile = $controller->getProfile('', $userId);
echo "Profile result: " . print_r($profile, true) . "\n";

echo "\n=== Test Complete ===\n";
?>
