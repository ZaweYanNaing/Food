-- Remove like_count column from cooking_tips table and create separate tip_likes table

-- Remove like_count column from cooking_tips table
ALTER TABLE cooking_tips DROP COLUMN like_count;

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
