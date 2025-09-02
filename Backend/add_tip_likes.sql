-- Add like_count column to cooking_tips table
ALTER TABLE cooking_tips ADD COLUMN like_count INT DEFAULT 0;


-- Update existing tips to have like_count = 0
UPDATE cooking_tips SET like_count = 0 WHERE like_count IS NULL;