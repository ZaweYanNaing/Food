-- Initialize FoodFusion Database
CREATE DATABASE IF NOT EXISTS foodfusion_db;
USE foodfusion_db;

-- Source the schema file
SOURCE /docker-entrypoint-initdb.d/schema.sql;
