-- Simplify educational_resources table by removing unnecessary fields
ALTER TABLE educational_resources 
DROP COLUMN category,
DROP COLUMN file_size,
DROP COLUMN file_type,
DROP COLUMN thumbnail_path,
DROP COLUMN video_url,
DROP COLUMN duration,
DROP COLUMN language,
DROP COLUMN difficulty_level,
DROP COLUMN tags,
DROP COLUMN is_featured,
DROP COLUMN is_active;
