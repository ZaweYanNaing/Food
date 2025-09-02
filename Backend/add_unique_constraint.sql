-- Add unique constraint to prevent duplicate views
ALTER TABLE recipe_views 
ADD CONSTRAINT unique_recipe_view 
UNIQUE (recipe_id, user_id, ip_address, DATE(viewed_at));
