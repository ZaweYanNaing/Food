-- FoodFusion Database Schema

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_name (firstName, lastName)
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    cooking_time INT,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    user_id INT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipe_categories table for many-to-many relationship
CREATE TABLE IF NOT EXISTS recipe_categories (
    recipe_id INT,
    category_id INT,
    PRIMARY KEY (recipe_id, category_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create user_favorites table for favorite recipes
CREATE TABLE IF NOT EXISTS user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe (user_id, recipe_id),
    INDEX idx_user_favorites (user_id, recipe_id)
);

-- Create user_activity table for tracking user actions
CREATE TABLE IF NOT EXISTS user_activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM('recipe_created', 'recipe_liked', 'recipe_favorited', 'recipe_unfavorited', 'recipe_shared', 'resource_downloaded', 'profile_updated') NOT NULL,
    target_id INT,
    target_type ENUM('recipe', 'resource', 'profile') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id, activity_type, created_at)
);

-- Create recipe_likes table for recipe likes
CREATE TABLE IF NOT EXISTS recipe_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe_like (user_id, recipe_id),
    INDEX idx_recipe_likes (recipe_id, user_id)
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Breakfast', 'Morning meals and brunch recipes'),
('Lunch', 'Midday meal recipes'),
('Dinner', 'Evening meal recipes'),
('Dessert', 'Sweet treats and desserts'),
('Snacks', 'Quick bites and appetizers'),
('Vegetarian', 'Plant-based recipes'),
('Vegan', 'Plant-based recipes without animal products'),
('Gluten-Free', 'Recipes without gluten'),
('Quick & Easy', 'Fast and simple recipes'),
('Healthy', 'Nutritious and balanced meals');

-- Insert sample user (password: password123)
INSERT INTO users (firstName, lastName, email, password, bio, location) VALUES
('Admin', 'User', 'admin@foodfusion.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Passionate home cook who loves experimenting with new recipes and techniques.', 'New York, NY');

-- Insert sample recipes
INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, difficulty, user_id) VALUES
('Classic Pancakes', 'Fluffy and delicious breakfast pancakes', '2 cups all-purpose flour, 2 tablespoons sugar, 2 teaspoons baking powder, 1/2 teaspoon salt, 2 eggs, 1 3/4 cups milk, 1/4 cup melted butter', '1. Mix dry ingredients\n2. Beat eggs and milk\n3. Combine wet and dry ingredients\n4. Cook on griddle until golden', 20, 'Easy', 1),
('Chicken Stir Fry', 'Quick and healthy chicken stir fry with vegetables', '1 lb chicken breast, 2 cups mixed vegetables, 3 tablespoons soy sauce, 2 cloves garlic, 1 tablespoon ginger, 2 tablespoons oil', '1. Cut chicken into pieces\n2. Stir fry chicken until golden\n3. Add vegetables and sauce\n4. Cook until vegetables are tender', 25, 'Medium', 1);

-- Insert sample user activity
INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES
(1, 'recipe_created', 1, 'recipe', 'Created Classic Pancakes recipe'),
(1, 'recipe_created', 2, 'recipe', 'Created Chicken Stir Fry recipe'),
(1, 'profile_updated', 1, 'profile', 'Updated profile information');

ALTER TABLE user_activity 
MODIFY COLUMN activity_type ENUM(
    'recipe_created', 
    'recipe_updated',
    'recipe_deleted',
    'recipe_liked', 
    'recipe_unliked',
    'recipe_favorited', 
    'recipe_unfavorited',
    'recipe_shared', 
    'resource_downloaded', 
    'profile_updated'
) NOT NULL;



-- Add recipe ratings and reviews tables
-- This script should be run to add rating and review functionality

-- Create recipe_reviews table for user reviews with ratings
CREATE TABLE IF NOT EXISTS recipe_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    review_text TEXT NOT NULL,
    rating ENUM('1', '2', '3', '4', '5') NOT NULL DEFAULT '5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe_review (user_id, recipe_id),
    INDEX idx_recipe_reviews (recipe_id, user_id),
    INDEX idx_user_reviews (user_id),
    INDEX idx_recipe_rating (recipe_id, rating)
);

-- Add recipe_rated and recipe_reviewed to user_activity types
ALTER TABLE user_activity 
MODIFY COLUMN activity_type ENUM(
    'recipe_created', 
    'recipe_updated',
    'recipe_deleted',
    'recipe_liked', 
    'recipe_unliked',
    'recipe_favorited', 
    'recipe_unfavorited',
    'recipe_rated',
    'recipe_reviewed',
    'recipe_shared', 
    'resource_downloaded', 
    'profile_updated'
) NOT NULL;

-- Insert sample data for testing
INSERT INTO recipe_reviews (user_id, recipe_id, review_text, rating) VALUES
(1, 1, 'These pancakes are absolutely delicious! Perfect texture and flavor.', '5'),
(1, 2, 'Great stir fry recipe, very flavorful and easy to make.', '4');

-- Insert sample activity for ratings and reviews
INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES
(1, 'recipe_rated', 1, 'recipe', 'Rated Classic Pancakes 5 stars'),
(1, 'recipe_reviewed', 1, 'recipe', 'Reviewed Classic Pancakes'),
(1, 'recipe_rated', 2, 'recipe', 'Rated Chicken Stir Fry 4 stars'),
(1, 'recipe_reviewed', 2, 'recipe', 'Reviewed Chicken Stir Fry');



CREATE TABLE IF NOT 
EXISTS recipe_views 
(id INT AUTO_INCREMENT PRIMARY KEY, 
user_id INT, recipe_id INT NOT NULL, 
ip_address VARCHAR(45), 
user_agent TEXT, 
viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL, 
FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE, INDEX idx_recipe_views (recipe_id, viewed_at), 
INDEX idx_user_views (user_id, viewed_at), INDEX idx_ip_views (ip_address, viewed_at));



INSERT INTO recipe_views 
(recipe_id, ip_address, viewed_at) 
VALUES (1, '192.168.1.1', DATE_SUB(NOW(), INTERVAL 2 DAY)), 
(1, '192.168.1.2', DATE_SUB(NOW(), INTERVAL 1 DAY)), 
(1, '192.168.1.3', NOW()), 
(2, '192.168.1.1', DATE_SUB(NOW(), INTERVAL 3 DAY)), 
(2, '192.168.1.2', DATE_SUB(NOW(), INTERVAL 2 DAY)), 
(2, '192.168.1.3', DATE_SUB(NOW(), INTERVAL 1 DAY)), 
(2, '192.168.1.4', NOW());

ALTER TABLE recipes ADD COLUMN cuisine_type VARCHAR(100) DEFAULT NULL;
ALTER TABLE recipes ADD COLUMN servings INT DEFAULT NULL;

UPDATE recipes SET cuisine_type = 'American', servings = 4 WHERE id = 1; UPDATE recipes SET cuisine_type = 'Asian', servings = 2 WHERE id = 2;
