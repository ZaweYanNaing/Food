-- First, let's check the current table structure
DESCRIBE recipe_views;

-- Simple approach: Just clean up duplicates and add a regular unique index
-- Clean up existing duplicates
DELETE rv1 FROM recipe_views rv1
INNER JOIN recipe_views rv2 
WHERE rv1.id > rv2.id 
AND rv1.recipe_id = rv2.recipe_id 
AND (
    (rv1.user_id IS NOT NULL AND rv1.user_id = rv2.user_id) OR
    (rv1.user_id IS NULL AND rv2.user_id IS NULL AND rv1.ip_address = rv2.ip_address)
)
AND DATE(rv1.viewed_at) = DATE(rv2.viewed_at);

-- Add a simple unique index on the main fields
-- This will prevent most duplicates
CREATE UNIQUE INDEX idx_unique_view 
ON recipe_views (recipe_id, user_id, ip_address, viewed_at);
