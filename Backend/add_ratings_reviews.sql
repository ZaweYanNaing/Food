-- Add recipe ratings and reviews tables
-- This script should be run to add rating and review functionality

-- Create recipe_ratings table for user ratings
CREATE TABLE IF NOT EXISTS recipe_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_recipe_rating (user_id, recipe_id),
    INDEX idx_recipe_ratings (recipe_id, user_id),
    INDEX idx_user_ratings (user_id)
);

-- Create recipe_reviews table for user reviews
CREATE TABLE IF NOT EXISTS recipe_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    review_text TEXT NOT NULL,
    rating_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (rating_id) REFERENCES recipe_ratings(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_recipe_review (user_id, recipe_id),
    INDEX idx_recipe_reviews (recipe_id, user_id),
    INDEX idx_user_reviews (user_id)
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
INSERT INTO recipe_ratings (user_id, recipe_id, rating) VALUES
(1, 1, 5),
(1, 2, 4);

INSERT INTO recipe_reviews (user_id, recipe_id, review_text, rating_id) VALUES
(1, 1, 'These pancakes are absolutely delicious! Perfect texture and flavor.', 1),
(1, 2, 'Great stir fry recipe, very flavorful and easy to make.', 2);

-- Insert sample activity for ratings and reviews
INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES
(1, 'recipe_rated', 1, 'recipe', 'Rated Classic Pancakes 5 stars'),
(1, 'recipe_reviewed', 1, 'recipe', 'Reviewed Classic Pancakes'),
(1, 'recipe_rated', 2, 'recipe', 'Rated Chicken Stir Fry 4 stars'),
(1, 'recipe_reviewed', 2, 'recipe', 'Reviewed Chicken Stir Fry');
