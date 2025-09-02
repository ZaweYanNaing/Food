-- Cooking Tips & Knowledge Sharing Database Schema
-- Add these tables to support the cooking tips system

-- Create cooking_tips table
CREATE TABLE IF NOT EXISTS cooking_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
    prep_time INT, -- in minutes, optional
    like_count INT DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_rating (rating_average DESC),
    INDEX idx_created (created_at DESC)
);

-- Create tip_likes table for user likes on tips
CREATE TABLE IF NOT EXISTS tip_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tip_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tip_id) REFERENCES cooking_tips(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tip_like (user_id, tip_id),
    INDEX idx_tip_likes (tip_id, user_id)
);

-- Create tip_ratings table for user ratings on tips
CREATE TABLE IF NOT EXISTS tip_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tip_id INT NOT NULL,
    rating ENUM('1', '2', '3', '4', '5') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tip_id) REFERENCES cooking_tips(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tip_rating (user_id, tip_id),
    INDEX idx_tip_ratings (tip_id, user_id),
    INDEX idx_user_ratings (user_id)
);

-- Insert sample cooking tips
INSERT INTO cooking_tips (title, content, user_id, difficulty_level, prep_time) VALUES
('Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 'Beginner', 5),
('Quick Knife Sharpening Hack', 'Use the bottom of a ceramic mug to quickly sharpen your knives. The unglazed ring at the bottom works like a honing steel in a pinch! This is perfect for when you don''t have access to proper sharpening tools.', 1, 'Beginner', 2),
('Buttermilk Substitute', 'Don''t have buttermilk? Mix 1 cup milk with 1 tablespoon white vinegar or lemon juice. Let it sit for 5 minutes and you''ll have perfect buttermilk for your recipes. This works great for pancakes, biscuits, and cakes.', 1, 'Beginner', 5),
('Egg Freshness Test', 'To test if an egg is fresh, place it in a bowl of water. Fresh eggs sink to the bottom, while old eggs float. This is because the air cell inside the egg grows larger as the egg ages.', 1, 'Beginner', 1),
('Meal Prep Containers', 'Use clear glass containers for meal prep so you can easily see what''s inside. Label containers with the date and contents. This helps prevent food waste and makes meal planning more efficient.', 1, 'Beginner', 10),
('Herb Storage Trick', 'Store fresh herbs like parsley and cilantro in a glass of water in the refrigerator, like flowers in a vase. Cover loosely with a plastic bag. This keeps them fresh for up to 2 weeks.', 1, 'Beginner', 2),
('Cast Iron Seasoning', 'To maintain your cast iron skillet, clean it with hot water and a stiff brush, then dry completely. Apply a thin layer of oil and heat in the oven at 350°F for 1 hour. This creates a natural non-stick surface.', 1, 'Intermediate', 60),
('Roasting Vegetables', 'Cut vegetables into uniform sizes for even cooking. Toss with oil, salt, and pepper, then roast at 425°F. Don''t overcrowd the pan - vegetables need space to caramelize properly.', 1, 'Beginner', 10),
('Freeze Herbs in Oil', 'Chop fresh herbs and freeze them in ice cube trays with olive oil. This preserves their flavor and makes it easy to add herbs to dishes. One cube is perfect for most recipes.', 1, 'Beginner', 15),
('Bread Crumb Substitute', 'Use crushed crackers, cereal, or nuts as breadcrumb substitutes. This adds different flavors and textures to your dishes while using what you have on hand.', 1, 'Beginner', 5);

-- Update user_activity table to include tip-related activities
ALTER TABLE user_activity 
MODIFY COLUMN activity_type ENUM(
    'recipe_created', 'recipe_updated', 'recipe_deleted', 'recipe_liked', 'recipe_unliked', 
    'recipe_favorited', 'recipe_unfavorited', 'recipe_rated', 'recipe_reviewed', 'recipe_shared', 
    'tip_created', 'tip_updated', 'tip_deleted', 'tip_liked', 'tip_unliked', 
    'tip_rated',
    'resource_downloaded', 'profile_updated'
) NOT NULL;

-- Update target_type to include 'tip'
ALTER TABLE user_activity 
MODIFY COLUMN target_type ENUM('recipe', 'tip', 'resource', 'profile') NOT NULL;

-- Insert sample tip activities
INSERT INTO user_activity (user_id, activity_type, target_id, target_type, description) VALUES
(1, 'tip_created', 1, 'tip', 'Created cooking tip: Perfect Rice Every Time'),
(1, 'tip_created', 2, 'tip', 'Created cooking tip: Quick Knife Sharpening Hack'),
(1, 'tip_created', 3, 'tip', 'Created cooking tip: Buttermilk Substitute');

-- Create triggers to update tip statistics
DELIMITER //

-- Trigger to update tip like count
CREATE TRIGGER update_tip_like_count_after_insert
AFTER INSERT ON tip_likes
FOR EACH ROW
BEGIN
    UPDATE cooking_tips 
    SET like_count = like_count + 1 
    WHERE id = NEW.tip_id;
END//

-- Trigger to update tip like count after delete
CREATE TRIGGER update_tip_like_count_after_delete
AFTER DELETE ON tip_likes
FOR EACH ROW
BEGIN
    UPDATE cooking_tips 
    SET like_count = like_count - 1 
    WHERE id = OLD.tip_id;
END//

-- Trigger to update tip rating statistics
CREATE TRIGGER update_tip_rating_stats_after_insert
AFTER INSERT ON tip_ratings
FOR EACH ROW
BEGIN
    UPDATE cooking_tips 
    SET rating_count = rating_count + 1,
        rating_average = (
            SELECT AVG(CAST(rating AS DECIMAL(3,2))) 
            FROM tip_ratings 
            WHERE tip_id = NEW.tip_id
        )
    WHERE id = NEW.tip_id;
END//

-- Trigger to update tip rating statistics after update
CREATE TRIGGER update_tip_rating_stats_after_update
AFTER UPDATE ON tip_ratings
FOR EACH ROW
BEGIN
    UPDATE cooking_tips 
    SET rating_average = (
            SELECT AVG(CAST(rating AS DECIMAL(3,2))) 
            FROM tip_ratings 
            WHERE tip_id = NEW.tip_id
        )
    WHERE id = NEW.tip_id;
END//

-- Trigger to update tip rating statistics after delete
CREATE TRIGGER update_tip_rating_stats_after_delete
AFTER DELETE ON tip_ratings
FOR EACH ROW
BEGIN
    UPDATE cooking_tips 
    SET rating_count = rating_count - 1,
        rating_average = COALESCE((
            SELECT AVG(CAST(rating AS DECIMAL(3,2))) 
            FROM tip_ratings 
            WHERE tip_id = OLD.tip_id
        ), 0.00)
    WHERE id = OLD.tip_id;
END//

DELIMITER ;
