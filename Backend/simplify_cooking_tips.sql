-- Simplify Cooking Tips Database Schema
-- Remove tip_likes, tip_ratings tables and simplify cooking_tips table

-- Drop existing tables if they exist
DROP TABLE IF EXISTS tip_ratings;
DROP TABLE IF EXISTS tip_likes;

-- Modify cooking_tips table to remove unwanted columns
ALTER TABLE cooking_tips 
DROP COLUMN difficulty_level,
DROP COLUMN rating_average,
DROP COLUMN rating_count,
DROP COLUMN like_count;

-- Insert sample cooking tips with simplified structure
INSERT INTO cooking_tips (title, content, user_id, prep_time) VALUES
('Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 5),
('Quick Knife Sharpening Hack', 'Use the bottom of a ceramic mug to quickly sharpen your knives. The unglazed ring at the bottom works like a honing steel in a pinch! This is perfect for when you don''t have access to proper sharpening tools.', 1, 2),
('Buttermilk Substitute', 'Don''t have buttermilk? Mix 1 cup milk with 1 tablespoon white vinegar or lemon juice. Let it sit for 5 minutes and you''ll have perfect buttermilk for your recipes. This works great for pancakes, biscuits, and cakes.', 1, 5),
('Egg Freshness Test', 'To test if an egg is fresh, place it in a bowl of water. Fresh eggs sink to the bottom, while old eggs float. This is because the air cell inside the egg grows larger as the egg ages.', 1, 1),
('Meal Prep Containers', 'Use clear glass containers for meal prep so you can easily see what''s inside. Label containers with the date and contents. This helps prevent food waste and makes meal planning more efficient.', 1, 10),
('Herb Storage Trick', 'Store fresh herbs like parsley and cilantro in a glass of water in the refrigerator, like flowers in a vase. Cover loosely with a plastic bag. This keeps them fresh for up to 2 weeks.', 1, 2),
('Cast Iron Seasoning', 'To maintain your cast iron skillet, clean it with hot water and a stiff brush, then dry completely. Apply a thin layer of oil and heat in the oven at 350°F for 1 hour. This creates a natural non-stick surface.', 1, 60),
('Roasting Vegetables', 'Cut vegetables into uniform sizes for even cooking. Toss with oil, salt, and pepper, then roast at 425°F. Don''t overcrowd the pan - vegetables need space to caramelize properly.', 1, 10),
('Freeze Herbs in Oil', 'Chop fresh herbs and freeze them in ice cube trays with olive oil. This preserves their flavor and makes it easy to add herbs to dishes. One cube is perfect for most recipes.', 1, 15),
('Bread Crumb Substitute', 'Use crushed crackers, cereal, or nuts as breadcrumb substitutes. This adds different flavors and textures to your dishes while using what you have on hand.', 1, 5);
