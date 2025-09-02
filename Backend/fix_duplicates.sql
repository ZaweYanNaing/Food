-- Add unique constraint to prevent duplicate views (handles NULL user_id)
-- First, clean up existing duplicates
DELETE rv1 FROM recipe_views rv1
INNER JOIN recipe_views rv2 
WHERE rv1.id > rv2.id 
AND rv1.recipe_id = rv2.recipe_id 
AND (
    (rv1.user_id IS NOT NULL AND rv1.user_id = rv2.user_id) OR
    (rv1.user_id IS NULL AND rv2.user_id IS NULL AND rv1.ip_address = rv2.ip_address)
)
AND DATE(rv1.viewed_at) = DATE(rv2.viewed_at);

-- Add unique index to prevent future duplicates
CREATE UNIQUE INDEX unique_daily_view 
ON recipe_views (recipe_id, COALESCE(user_id, 0), ip_address, DATE(viewed_at));
