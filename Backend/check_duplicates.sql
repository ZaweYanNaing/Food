-- Check for duplicate favorites
SELECT 
    uf.user_id,
    uf.recipe_id,
    r.title as recipe_title,
    COUNT(*) as duplicate_count
FROM user_favorites uf
JOIN recipes r ON uf.recipe_id = r.id
GROUP BY uf.user_id, uf.recipe_id
HAVING COUNT(*) > 1
ORDER BY uf.user_id, uf.recipe_id;

-- Show all favorites for a specific user (replace USER_ID with actual user ID)
-- SELECT 
--     uf.id,
--     uf.user_id,
--     uf.recipe_id,
--     r.title,
--     uf.created_at
-- FROM user_favorites uf
-- JOIN recipes r ON uf.recipe_id = r.id
-- WHERE uf.user_id = USER_ID
-- ORDER BY uf.recipe_id, uf.created_at;
