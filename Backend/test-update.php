<?php
require_once 'config/database.php';
require_once 'controllers/UserController.php';

// Test the updateProfile method directly
$controller = new UserController();

echo "Testing updateProfile method...\n\n";

// Test case 1: Update profile image
$data1 = ['profile_image' => '/uploads/profile_1_1756205817.jpeg'];
echo "Test 1: Updating profile image\n";
echo "Data: " . json_encode($data1) . "\n";
$result1 = $controller->updateProfile(4, $data1);
echo "Result: " . json_encode($result1, JSON_PRETTY_PRINT) . "\n\n";

// Test case 2: Update multiple fields
$data2 = [
    'firstName' => 'Alice',
    'lastName' => 'Smith',
    'bio' => 'Test bio',
    'location' => 'Test City',
    'website' => 'https://test.com',
    'profile_image' => '/uploads/profile_1_1756205817.jpeg'
];
echo "Test 2: Updating multiple fields\n";
echo "Data: " . json_encode($data2) . "\n";
$result2 = $controller->updateProfile(4, $data2);
echo "Result: " . json_encode($result2, JSON_PRETTY_PRINT) . "\n\n";

echo "Testing complete.\n";
?>
