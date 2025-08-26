<?php
// Test script to check user recipes
require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    $userId = 1; // Test with user ID 1
    
    echo "Testing getUserRecipes for user ID: $userId\n\n";
    
    // Test 1: Check raw recipes table
    $query = "SELECT id, title, description, user_id, created_at FROM recipes WHERE user_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $rawRecipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Raw recipes found: " . count($rawRecipes) . "\n";
    foreach ($rawRecipes as $recipe) {
        echo "- Recipe ID: {$recipe['id']}, Title: {$recipe['title']}\n";
    }
    
    echo "\n";
    
    // Test 2: Check recipe categories
    $query = "SELECT rc.recipe_id, c.name as category_name 
              FROM recipe_categories rc 
              JOIN categories c ON rc.category_id = c.id 
              WHERE rc.recipe_id IN (SELECT id FROM recipes WHERE user_id = :user_id)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $recipeCategories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Recipe categories found: " . count($recipeCategories) . "\n";
    foreach ($recipeCategories as $rc) {
        echo "- Recipe ID: {$rc['recipe_id']}, Category: {$rc['category_name']}\n";
    }
    
    echo "\n";
    
    // Test 3: Simulate the getUserRecipes logic
    $query = "SELECT DISTINCT r.id, r.title, r.description, r.ingredients, r.instructions, 
                     r.cooking_time, r.difficulty, r.image_url, r.user_id, r.created_at
              FROM recipes r 
              WHERE r.user_id = :user_id 
              ORDER BY r.created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();
    
    $recipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Recipes after DISTINCT query: " . count($recipes) . "\n";
    
    // Now get categories for each recipe
    foreach ($recipes as &$recipe) {
        $categoryQuery = "SELECT c.name 
                         FROM recipe_categories rc 
                         JOIN categories c ON rc.category_id = c.id 
                         WHERE rc.recipe_id = :recipe_id";
        $categoryStmt = $db->prepare($categoryQuery);
        $categoryStmt->bindParam(':recipe_id', $recipe['id']);
        $categoryStmt->execute();
        
        $categories = $categoryStmt->fetchAll(PDO::FETCH_ASSOC);
        $recipe['categories'] = array_column($categories, 'name');
        $recipe['category_name'] = !empty($categories) ? $categories[0]['name'] : null;
        
        echo "- Recipe: {$recipe['title']}, Categories: " . implode(', ', $recipe['categories']) . "\n";
    }
    
    // Group by category
    $groupedRecipes = [];
    foreach ($recipes as $recipe) {
        $category = $recipe['category_name'] ?? 'Uncategorized';
        if (!isset($groupedRecipes[$category])) {
            $groupedRecipes[$category] = [];
        }
        $groupedRecipes[$category][] = $recipe;
    }
    
    echo "\nFinal grouped result:\n";
    foreach ($groupedRecipes as $category => $categoryRecipes) {
        echo "Category '$category': " . count($categoryRecipes) . " recipes\n";
        foreach ($categoryRecipes as $recipe) {
            echo "  - {$recipe['title']}\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
