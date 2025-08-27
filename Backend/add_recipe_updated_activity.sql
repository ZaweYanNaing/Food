-- Add recipe_updated activity type to user_activity table
-- This script should be run to update existing databases

-- First, let's check the current ENUM values
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'user_activity' 
AND COLUMN_NAME = 'activity_type';

-- Update the ENUM to include the new activity type
ALTER TABLE user_activity 
MODIFY COLUMN activity_type ENUM(
    'recipe_created', 
    'recipe_updated',
    'recipe_deleted',
    'recipe_liked', 
    'recipe_favorited', 
    'recipe_unfavorited',
    'recipe_shared', 
    'resource_downloaded', 
    'profile_updated'
) NOT NULL;

-- Verify the update
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'user_activity' 
AND COLUMN_NAME = 'activity_type';
