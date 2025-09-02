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
CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    cooking_time INT,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    user_id INT NOT NULL,
    image_url VARCHAR(500),
    servings INT,
    cuisine_type_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cuisine_type_id) REFERENCES cuisine_types(id) ON DELETE SET NULL
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

-- Create cuisine_types table
CREATE TABLE IF NOT EXISTS cuisine_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipe_ingredients junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity VARCHAR(50),
    unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    UNIQUE KEY unique_recipe_ingredient (recipe_id, ingredient_id),
    INDEX idx_recipe_ingredients (recipe_id),
    INDEX idx_ingredient_recipes (ingredient_id)
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
    activity_type ENUM('recipe_created', 'recipe_updated', 'recipe_deleted', 'recipe_liked', 'recipe_unliked', 'recipe_favorited', 'recipe_unfavorited', 'recipe_rated', 'recipe_reviewed', 'recipe_shared', 'resource_downloaded', 'profile_updated') NOT NULL,
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

-- Create recipe_views table for tracking recipe views
CREATE TABLE IF NOT EXISTS recipe_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    recipe_id INT NOT NULL,
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    INDEX idx_recipe_views (recipe_id, viewed_at),
    INDEX idx_user_views (user_id, viewed_at),
    INDEX idx_ip_views (ip_address, viewed_at)
);

-- Insert sample data
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

-- Insert sample cuisine types
INSERT INTO cuisine_types (name, description) VALUES
('American', 'Traditional American cuisine'),
('Italian', 'Italian Mediterranean cuisine'),
('Asian', 'Various Asian cuisines'),
('Mexican', 'Mexican and Latin American cuisine'),
('Mediterranean', 'Mediterranean and Middle Eastern cuisine'),
('Indian', 'Indian subcontinent cuisine'),
('French', 'French haute cuisine'),
('Japanese', 'Japanese cuisine'),
('Thai', 'Thai cuisine'),
('Greek', 'Greek Mediterranean cuisine');

-- Insert sample ingredients
INSERT INTO ingredients (name) VALUES
('All-purpose flour'),
('Eggs'),
('Milk'),
('Butter'),
('Sugar'),
('Salt'),
('Chicken breast'),
('Soy sauce'),
('Garlic'),
('Ginger'),
('Vegetable oil'),
('Mixed vegetables');

-- Insert sample user (password: password123)
INSERT INTO users (firstName, lastName, email, password, bio, location) VALUES
('Admin', 'User', 'admin@foodfusion.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Passionate home cook who loves experimenting with new recipes and techniques.', 'New York, NY');

-- Insert sample recipes
INSERT INTO recipes (title, description, instructions, cooking_time, difficulty, user_id, servings, cuisine_type_id) VALUES
('Classic Pancakes', 'Fluffy and delicious breakfast pancakes', '1. Mix dry ingredients\n2. Beat eggs and milk\n3. Combine wet and dry ingredients\n4. Cook on griddle until golden', 20, 'Easy', 1, 4, 1),
('Chicken Stir Fry', 'Quick and healthy chicken stir fry with vegetables', '1. Cut chicken into pieces\n2. Stir fry chicken until golden\n3. Add vegetables and sauce\n4. Cook until vegetables are tender', 25, 'Medium', 1, 2, 3);

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
(1, 1, '2', 'cups'),      -- All-purpose flour
(1, 2, '2', 'pieces'),    -- Eggs
(1, 3, '1 3/4', 'cups'), -- Milk
(1, 4, '1/4', 'cup'),     -- Butter
(1, 5, '2', 'tablespoons'), -- Sugar
(1, 6, '1/2', 'teaspoon'),  -- Salt
(2, 7, '1', 'lb'),        -- Chicken breast
(2, 12, '2', 'cups'),     -- Mixed vegetables
(2, 8, '3', 'tablespoons'), -- Soy sauce
(2, 9, '2', 'cloves'),    -- Garlic
(2, 10, '1', 'tablespoon'), -- Ginger
(2, 11, '2', 'tablespoons'); -- Vegetable oil

-- Insert sample user activity
INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES
(1, 'recipe_created', 1, 'recipe', 'Created Classic Pancakes recipe'),
(1, 'recipe_created', 2, 'recipe', 'Created Chicken Stir Fry recipe'),
(1, 'profile_updated', 1, 'profile', 'Updated profile information');

-- Insert sample activity for ratings and reviews
INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES
(1, 'recipe_rated', 1, 'recipe', 'Rated Classic Pancakes 5 stars'),
(1, 'recipe_reviewed', 1, 'recipe', 'Reviewed Classic Pancakes'),
(1, 'recipe_rated', 2, 'recipe', 'Rated Chicken Stir Fry 4 stars'),
(1, 'recipe_reviewed', 2, 'recipe', 'Reviewed Chicken Stir Fry');

-- Insert sample reviews
INSERT INTO recipe_reviews (user_id, recipe_id, review_text, rating) VALUES
(1, 1, 'These pancakes are absolutely delicious! Perfect texture and flavor.', '5'),
(1, 2, 'Great stir fry recipe, very flavorful and easy to make.', '4');

-- Insert sample recipe views
INSERT INTO recipe_views (recipe_id, ip_address, viewed_at) VALUES
(1, '192.168.1.1', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, '192.168.1.2', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, '192.168.1.3', NOW()),
(2, '192.168.1.1', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, '192.168.1.2', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, '192.168.1.3', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, '192.168.1.4', NOW());
