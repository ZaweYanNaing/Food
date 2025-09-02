-- Clean up existing duplicates first
DELETE rv1 FROM recipe_views rv1
INNER JOIN recipe_views rv2 
WHERE rv1.id > rv2.id 
AND rv1.recipe_id = rv2.recipe_id 
AND (
    (rv1.user_id IS NOT NULL AND rv1.user_id = rv2.user_id) OR
    (rv1.user_id IS NULL AND rv2.user_id IS NULL AND rv1.ip_address = rv2.ip_address)
)
AND DATE(rv1.viewed_at) = DATE(rv2.viewed_at);

-- Add a generated column for the unique constraint
ALTER TABLE recipe_views 
ADD COLUMN view_key VARCHAR(255) GENERATED ALWAYS AS (
    CONCAT(recipe_id, '_', COALESCE(user_id, 0), '_', ip_address, '_', DATE(viewed_at))
) STORED;

-- Add unique constraint on the generated column
ALTER TABLE recipe_views 
ADD CONSTRAINT unique_daily_view UNIQUE (view_key);
