<?php
// Test script to verify activity types work correctly
require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Testing activity types...\n";
    
    // Test 1: Check current ENUM values
    $query = "SELECT COLUMN_TYPE 
              FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'user_activity' 
              AND COLUMN_NAME = 'activity_type'";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "Current activity_type ENUM values:\n";
    echo $result['COLUMN_TYPE'] . "\n\n";
    
    // Test 2: Try to insert different activity types
    $testActivities = [
        'recipe_created',
        'recipe_favorited', 
        'recipe_unfavorited',
        'recipe_shared'
    ];
    
    foreach ($testActivities as $activityType) {
        try {
            $insertQuery = "INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) 
                           VALUES (1, :activity_type, 1, 'recipe', 'Test activity')";
            $stmt = $db->prepare($insertQuery);
            $stmt->bindParam(':activity_type', $activityType);
            
            if ($stmt->execute()) {
                echo "✓ Successfully inserted: $activityType\n";
            } else {
                echo "✗ Failed to insert: $activityType\n";
            }
        } catch (Exception $e) {
            echo "✗ Error inserting $activity_type: " . $e->getMessage() . "\n";
        }
    }
    
    // Clean up test data
    $cleanupQuery = "DELETE FROM user_activity WHERE description = 'Test activity'";
    $stmt = $db->prepare($cleanupQuery);
    $stmt->execute();
    echo "\nCleaned up test data.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
