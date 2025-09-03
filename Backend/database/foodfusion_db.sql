-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Sep 03, 2025 at 04:32 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodfusion_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Breakfast', 'Morning meals and brunch recipes', '2025-08-26 09:56:46'),
(2, 'Lunch', 'Midday meal recipes', '2025-08-26 09:56:46'),
(3, 'Dinner', 'Evening meal recipes', '2025-08-26 09:56:46'),
(4, 'Dessert', 'Sweet treats and desserts', '2025-08-26 09:56:46'),
(5, 'Snacks', 'Quick bites and appetizers', '2025-08-26 09:56:46'),
(6, 'Vegetarian', 'Plant-based recipes', '2025-08-26 09:56:46'),
(7, 'Vegan', 'Plant-based recipes without animal products', '2025-08-26 09:56:46'),
(8, 'Gluten-Free', 'Recipes without gluten', '2025-08-26 09:56:46'),
(9, 'Quick & Easy', 'Fast and simple recipes', '2025-08-26 09:56:46'),
(10, 'Healthy', 'Nutritious and balanced meals', '2025-08-26 09:56:46');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(11, 'Zawe Yan Naing', 'zawe@gmail.com', 'EIir', 'jflkajdsfkljdslfkjsdklfl', 'new', '2025-09-02 19:00:18', '2025-09-02 19:00:18');

-- --------------------------------------------------------

--
-- Table structure for table `cooking_tips`
--

CREATE TABLE `cooking_tips` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `user_id` int NOT NULL,
  `prep_time` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cooking_tips`
--

INSERT INTO `cooking_tips` (`id`, `title`, `content`, `user_id`, `prep_time`, `created_at`, `updated_at`) VALUES
(1, 'Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 5, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(2, 'Quick Knife Sharpening Hack', 'Use the bottom of a ceramic mug to quickly sharpen your knives. The unglazed ring at the bottom works like a honing steel in a pinch! This is perfect for when you don\'t have access to proper sharpening tools.', 1, 2, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(3, 'Buttermilk Substitute', 'Don\'t have buttermilk? Mix 1 cup milk with 1 tablespoon white vinegar or lemon juice. Let it sit for 5 minutes and you\'ll have perfect buttermilk for your recipes. This works great for pancakes, biscuits, and cakes.', 1, 5, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(4, 'Egg Freshness Test', 'To test if an egg is fresh, place it in a bowl of water. Fresh eggs sink to the bottom, while old eggs float. This is because the air cell inside the egg grows larger as the egg ages.', 1, 1, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(5, 'Meal Prep Containers', 'Use clear glass containers for meal prep so you can easily see what\'s inside. Label containers with the date and contents. This helps prevent food waste and makes meal planning more efficient.', 1, 10, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(6, 'Herb Storage Trick', 'Store fresh herbs like parsley and cilantro in a glass of water in the refrigerator, like flowers in a vase. Cover loosely with a plastic bag. This keeps them fresh for up to 2 weeks.', 1, 2, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(7, 'Cast Iron Seasoning', 'To maintain your cast iron skillet, clean it with hot water and a stiff brush, then dry completely. Apply a thin layer of oil and heat in the oven at 350Â°F for 1 hour. This creates a natural non-stick surface.', 1, 60, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(8, 'Roasting Vegetables', 'Cut vegetables into uniform sizes for even cooking. Toss with oil, salt, and pepper, then roast at 425Â°F. Don\'t overcrowd the pan - vegetables need space to caramelize properly.', 1, 10, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(9, 'Freeze Herbs in Oil', 'Chop fresh herbs and freeze them in ice cube trays with olive oil. This preserves their flavor and makes it easy to add herbs to dishes. One cube is perfect for most recipes.', 1, 15, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(10, 'Bread Crumb Substitute', 'Use crushed crackers, cereal, or nuts as breadcrumb substitutes. This adds different flavors and textures to your dishes while using what you have on hand.', 1, 5, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(11, 'Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 5, '2025-09-02 15:11:44', '2025-09-02 15:11:44'),
(12, 'Quick Knife Sharpening Hack', 'Use the bottom of a ceramic mug to quickly sharpen your knives. The unglazed ring at the bottom works like a honing steel in a pinch! This is perfect for when you don\'t have access to proper sharpening tools.', 1, 2, '2025-09-02 15:11:44', '2025-09-02 15:11:44'),
(26, 'Herb Storage Trick', 'Store fresh herbs like parsley and cilantro in a glass of water in the refrigerator, like flowers in a vase. Cover loosely with a plastic bag. This keeps them fresh for up to 2 weeks.', 1, 2, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(27, 'Cast Iron Seasoning', 'To maintain your cast iron skillet, clean it with hot water and a stiff brush, then dry completely. Apply a thin layer of oil and heat in the oven at 350Â°F for 1 hour. This creates a natural non-stick surface.', 1, 60, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(28, 'Roasting Vegetables', 'Cut vegetables into uniform sizes for even cooking. Toss with oil, salt, and pepper, then roast at 425Â°F. Don\'t overcrowd the pan - vegetables need space to caramelize properly.', 1, 10, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(29, 'Freeze Herbs in Oil', 'Chop fresh herbs and freeze them in ice cube trays with olive oil. This preserves their flavor and makes it easy to add herbs to dishes. One cube is perfect for most recipes.', 1, 15, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(30, 'Bread Crumb Substitute', 'Use crushed crackers, cereal, or nuts as breadcrumb substitutes. This adds different flavors and textures to your dishes while using what you have on hand.', 1, 5, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(31, 'Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 5, '2025-09-02 16:25:10', '2025-09-02 16:25:10'),
(43, 'Test Tip', 'This should work', 1, NULL, '2025-09-02 18:34:35', '2025-09-02 18:34:35');

-- --------------------------------------------------------

--
-- Table structure for table `cuisine_types`
--

CREATE TABLE `cuisine_types` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cuisine_types`
--

INSERT INTO `cuisine_types` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'American', 'Traditional American cuisine', '2025-08-28 05:12:55'),
(2, 'Italian', 'Italian Mediterranean cuisine', '2025-08-28 05:12:55'),
(3, 'Asian', 'Various Asian cuisines', '2025-08-28 05:12:55'),
(4, 'Mexican', 'Mexican and Latin American cuisine', '2025-08-28 05:12:55'),
(5, 'Mediterranean', 'Mediterranean and Middle Eastern cuisine', '2025-08-28 05:12:55'),
(6, 'Indian', 'Indian subcontinent cuisine', '2025-08-28 05:12:55'),
(7, 'French', 'French haute cuisine', '2025-08-28 05:12:55'),
(8, 'Japanese', 'Japanese cuisine', '2025-08-28 05:12:55'),
(9, 'Thai', 'Thai cuisine', '2025-08-28 05:12:55'),
(10, 'Greek', 'Greek Mediterranean cuisine', '2025-08-28 05:12:55'),
(11, 'Test Cuisine', NULL, '2025-08-28 05:23:51');

-- --------------------------------------------------------

--
-- Table structure for table `educational_resources`
--

CREATE TABLE `educational_resources` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `type` enum('document','infographic','video','presentation','guide') NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `download_count` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `educational_resources`
--

INSERT INTO `educational_resources` (`id`, `title`, `description`, `type`, `file_path`, `download_count`, `created_by`, `created_at`, `updated_at`) VALUES
(26, 'Be a Food Hero', 'Cook together. Eat together. Talk together.', 'guide', '/uploads/educational-resources/68b7ae4c5c103_1756868172.pdf', 1, 2, '2025-09-03 02:56:12', '2025-09-03 02:56:23'),
(27, 'MY INTER RECIPES', 'A culinary journey around the world of ', 'document', '/uploads/educational-resources/68b7af4d532af_1756868429.pdf', 1, 2, '2025-09-03 03:00:29', '2025-09-03 03:05:14'),
(28, 'Salmon Fish ', 'Fresh air and real fresh condition with loves', 'infographic', '/uploads/educational-resources/68b7afad23817_1756868525.jpg', 0, 2, '2025-09-03 03:02:05', '2025-09-03 03:25:12'),
(29, 'Pizza', 'How to make pizza at home specially', 'presentation', '/uploads/educational-resources/68b7b86ec6119_1756870766.pptx', 0, 2, '2025-09-03 03:39:26', '2025-09-03 03:39:26'),
(30, 'Egg Hack', 'perfect egg hack. It is fried to pefection.', 'video', '/uploads/educational-resources/68b7c3e9b08f0_1756873705.mp4', 1, 2, '2025-09-03 04:28:25', '2025-09-03 04:28:32');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `created_at`) VALUES
(1, 'All-purpose flour', '2025-08-28 05:12:55'),
(2, 'Eggs', '2025-08-28 05:12:55'),
(3, 'Milk', '2025-08-28 05:12:55'),
(4, 'Butter', '2025-08-28 05:12:55'),
(5, 'Sugar', '2025-08-28 05:12:55'),
(6, 'Salt', '2025-08-28 05:12:55'),
(7, 'Chicken breast', '2025-08-28 05:12:55'),
(8, 'Soy sauce', '2025-08-28 05:12:55'),
(9, 'Garlic', '2025-08-28 05:12:55'),
(10, 'Ginger', '2025-08-28 05:12:55'),
(11, 'Vegetable oil', '2025-08-28 05:12:55'),
(12, 'Mixed vegetables', '2025-08-28 05:12:55'),
(14, 'Test Ingredient 1', '2025-08-28 05:23:51'),
(15, 'Test Ingredient 2', '2025-08-28 05:23:51'),
(16, 'Spaghetti', '2025-08-28 05:55:21'),
(17, 'Pancetta', '2025-08-28 05:55:21'),
(18, 'Parmesan', '2025-08-28 05:55:21'),
(19, 'Rice', '2025-08-28 06:25:30'),
(20, 'Noodle', '2025-08-28 07:30:57'),
(21, 'Oil', '2025-08-28 07:45:53'),
(22, 'Salmon', '2025-09-02 14:23:00');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `instructions` text NOT NULL,
  `cooking_time` int DEFAULT NULL,
  `difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `user_id` int DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `servings` int DEFAULT NULL,
  `cuisine_type_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `title`, `description`, `instructions`, `cooking_time`, `difficulty`, `user_id`, `image_url`, `created_at`, `updated_at`, `servings`, `cuisine_type_id`) VALUES
(1, 'Classic Pancakes', 'Fluffy and delicious breakfast pancakes', '1. Mix dry ingredients\n2. Beat eggs and milk\n3. Combine wet and dry ingredients\n4. Cook on griddle until golden', 20, 'Easy', 1, NULL, '2025-08-26 09:56:46', '2025-08-28 05:51:37', 4, 1),
(2, 'Chicken Stir Fry', 'Quick and healthy chicken stir fry with vegetables', '1. Cut chicken into pieces\n2. Stir fry chicken until golden\n3. Add vegetables and sauce\n4. Cook until vegetables are tender', 25, 'Medium', 1, NULL, '2025-08-26 09:56:46', '2025-08-28 05:51:37', 2, 3),
(13, 'Noo Soup', 'd', 'dfsa', 5, 'Easy', 2, '', '2025-08-28 06:25:30', '2025-08-28 06:25:30', 3, 3),
(16, 'Egg Fried', '', 'Follow These Steps', 5, 'Easy', 2, '', '2025-08-28 07:03:53', '2025-08-28 07:03:53', 1, 3),
(18, 'Spicy Noodle', '', 'Follow Rules', 5, 'Medium', 2, '/uploads/recipe_2_1756366257.jpeg', '2025-08-28 07:30:57', '2025-08-28 07:45:53', 2, 9),
(21, 'Salmon', 'good for health . Make healthly', 'follow steps ', 25, 'Hard', 2, '/uploads/recipe_2_1756822980.jpg', '2025-09-02 14:23:00', '2025-09-02 18:58:51', 2, 8);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_categories`
--

CREATE TABLE `recipe_categories` (
  `recipe_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipe_categories`
--

INSERT INTO `recipe_categories` (`recipe_id`, `category_id`) VALUES
(13, 1),
(16, 1),
(21, 1),
(21, 2),
(16, 4),
(18, 5),
(21, 8),
(18, 9),
(21, 10);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ingredients`
--

CREATE TABLE `recipe_ingredients` (
  `id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  `quantity` varchar(50) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipe_ingredients`
--

INSERT INTO `recipe_ingredients` (`id`, `recipe_id`, `ingredient_id`, `quantity`, `unit`, `created_at`) VALUES
(1, 1, 1, '2', 'cups', '2025-08-28 05:12:55'),
(2, 1, 2, '2', 'pieces', '2025-08-28 05:12:55'),
(3, 1, 3, '1 3/4', 'cups', '2025-08-28 05:12:55'),
(4, 1, 4, '1/4', 'cup', '2025-08-28 05:12:55'),
(5, 1, 5, '2', 'tablespoons', '2025-08-28 05:12:55'),
(6, 1, 6, '1/2', 'teaspoon', '2025-08-28 05:12:55'),
(7, 2, 7, '1', 'lb', '2025-08-28 05:12:55'),
(8, 2, 12, '2', 'cups', '2025-08-28 05:12:55'),
(9, 2, 8, '3', 'tablespoons', '2025-08-28 05:12:55'),
(10, 2, 9, '2', 'cloves', '2025-08-28 05:12:55'),
(11, 2, 10, '1', 'tablespoon', '2025-08-28 05:12:55'),
(12, 2, 11, '2', 'tablespoons', '2025-08-28 05:12:55'),
(20, 13, 2, '2', 'pieces', '2025-08-28 06:25:30'),
(21, 13, 19, '2', 'bowl', '2025-08-28 06:25:30'),
(26, 16, 2, '2', 'pieces', '2025-08-28 07:03:53'),
(33, 18, 2, '2 pieces', '', '2025-08-28 07:45:53'),
(34, 18, 20, '1 package', '', '2025-08-28 07:45:53'),
(35, 18, 21, '1', 'bottle', '2025-08-28 07:45:53'),
(38, 21, 2, '2 pieces', '', '2025-09-02 18:58:51'),
(39, 21, 22, '3 lb', '', '2025-09-02 18:58:51');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_likes`
--

CREATE TABLE `recipe_likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipe_likes`
--

INSERT INTO `recipe_likes` (`id`, `user_id`, `recipe_id`, `created_at`) VALUES
(1, 1, 1, '2025-08-27 05:40:32'),
(3, 2, 13, '2025-08-28 07:01:08'),
(4, 2, 18, '2025-08-28 08:10:50');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_reviews`
--

CREATE TABLE `recipe_reviews` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `review_text` text NOT NULL,
  `rating` enum('1','2','3','4','5') NOT NULL DEFAULT '5',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipe_reviews`
--

INSERT INTO `recipe_reviews` (`id`, `user_id`, `recipe_id`, `review_text`, `rating`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Updated review with new rating', '4', '2025-08-27 05:34:18', '2025-08-28 04:59:25'),
(2, 1, 2, 'Great stir fry recipe, very flavorful and easy to make.', '4', '2025-08-27 05:34:18', '2025-08-28 04:56:03'),
(3, 2, 2, 'This is good for food industry.', '5', '2025-08-27 05:41:48', '2025-08-27 05:41:48'),
(5, 2, 16, 'Good ', '3', '2025-08-28 07:06:02', '2025-08-28 07:06:02'),
(7, 2, 18, 'good', '2', '2025-09-02 13:38:08', '2025-09-02 13:38:08');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_views`
--

CREATE TABLE `recipe_views` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `recipe_id` int NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `recipe_views`
--

INSERT INTO `recipe_views` (`id`, `user_id`, `recipe_id`, `ip_address`, `viewed_at`) VALUES
(34, NULL, 1, '192.168.65.1', '2025-09-02 13:49:22'),
(43, NULL, 1, '192.168.65.1', '2025-09-02 14:17:16'),
(40, NULL, 2, '192.168.65.1', '2025-09-02 14:14:32'),
(38, 2, 2, '192.168.65.1', '2025-09-02 14:13:32'),
(42, NULL, 13, '192.168.65.1', '2025-09-02 14:16:46'),
(36, 2, 16, '192.168.65.1', '2025-09-02 13:53:37'),
(48, NULL, 18, '192.168.65.1', '2025-09-02 19:02:25'),
(46, 2, 18, '192.168.65.1', '2025-09-02 14:23:48'),
(50, 2, 18, '192.168.65.1', '2025-09-03 03:40:35'),
(44, 2, 21, '192.168.65.1', '2025-09-02 14:23:07');

-- --------------------------------------------------------

--
-- Table structure for table `tip_likes`
--

CREATE TABLE `tip_likes` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `tip_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tip_likes`
--

INSERT INTO `tip_likes` (`id`, `user_id`, `tip_id`, `created_at`) VALUES
(34, 1, 2, '2025-09-02 17:29:59'),
(36, 2, 1, '2025-09-02 18:01:51'),
(37, 3, 31, '2025-09-02 18:04:09'),
(38, 3, 30, '2025-09-02 18:04:10'),
(42, 2, 29, '2025-09-02 18:04:46'),
(43, 5, 31, '2025-09-02 18:05:56'),
(44, 5, 30, '2025-09-02 18:05:58'),
(45, 5, 29, '2025-09-02 18:06:02'),
(49, 2, 28, '2025-09-02 18:16:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` text,
  `location` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `bio`, `location`, `website`, `profile_image`, `created_at`, `updated_at`) VALUES
(1, 'First ', 'User', 'zz@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test bio', 'Test City', 'test.com', '', '2025-08-26 09:56:46', '2025-08-27 05:43:21'),
(2, 'Zawe Yan', 'Naing', 'zawe@gmail.com', '$2y$10$7lcVWx8vsStpnoXd/4UNbeOcNnf4Noe3i5yGLOIwVqCga66CRVTdS', 'I\'ve a good day and ', 'Mandalay', 'github.com/ZaweYanNaing', '/uploads/profile_2_1756217127.jpg', '2025-08-26 09:57:28', '2025-08-27 10:31:38'),
(3, 'Aung', 'Naing', 'aung@gmail.com', '$2y$10$M6X9LnPlmZ/sVuMc820g2Orsc4SsDu2CqTC6YlTOZtRs2JcyUrolS', NULL, NULL, NULL, '/uploads/profile_3_1756210717.jpeg', '2025-08-26 10:28:56', '2025-08-26 12:18:37'),
(4, 'Alice', 'Smith', 'alice@example.com', '$2y$10$3uHC80OfcmkH5BXaujcwGeVmMAsOG9WP/a.fFpo/hX1cIzhqkFMxS', NULL, NULL, NULL, NULL, '2025-08-26 10:41:44', '2025-08-26 10:41:44'),
(5, 'joe', 'Naing', 'joe@gmail.com', '$2y$10$Ri1fIaHkqGljL33Wmlt1reL/mUn9e8TyqF716t4v9c5gi2yePduwK', NULL, NULL, NULL, NULL, '2025-09-02 18:05:53', '2025-09-02 18:05:53');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `activity_type` enum('recipe_created','recipe_updated','recipe_deleted','recipe_liked','recipe_unliked','recipe_favorited','recipe_unfavorited','recipe_rated','recipe_reviewed','recipe_shared','tip_created','tip_updated','tip_deleted','tip_liked','tip_unliked','tip_rated','resource_downloaded','profile_updated') NOT NULL,
  `target_id` int DEFAULT NULL,
  `target_type` enum('recipe','tip','resource','profile') NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`id`, `user_id`, `activity_type`, `target_id`, `target_type`, `description`, `created_at`) VALUES
(59, 2, 'recipe_favorited', 1, 'recipe', 'Added recipe to favorites', '2025-08-26 15:51:07'),
(60, 2, 'recipe_favorited', 1, 'recipe', 'Added recipe to favorites', '2025-08-27 02:00:18'),
(61, 2, 'recipe_unfavorited', 1, 'recipe', 'Removed recipe from favorites', '2025-08-27 02:00:37'),
(62, 2, 'recipe_updated', 7, 'recipe', 'Updated recipe: Spicy Noogle', '2025-08-27 04:28:49'),
(63, 2, 'recipe_updated', 7, 'recipe', 'Updated recipe: Spicy Noodle', '2025-08-27 04:30:09'),
(64, 2, 'recipe_updated', 7, 'recipe', 'Updated recipe: Spicy Noodle', '2025-08-27 04:30:33'),
(65, 2, 'recipe_favorited', 1, 'recipe', 'Added recipe to favorites', '2025-08-27 04:45:19'),
(66, 1, 'recipe_rated', 1, 'recipe', 'Rated Classic Pancakes 5 stars', '2025-08-27 05:34:18'),
(67, 1, 'recipe_reviewed', 1, 'recipe', 'Reviewed Classic Pancakes', '2025-08-27 05:34:18'),
(68, 1, 'recipe_rated', 2, 'recipe', 'Rated Chicken Stir Fry 4 stars', '2025-08-27 05:34:18'),
(69, 1, 'recipe_reviewed', 2, 'recipe', 'Reviewed Chicken Stir Fry', '2025-08-27 05:34:18'),
(70, 1, 'recipe_liked', 1, 'recipe', 'Liked recipe', '2025-08-27 05:40:32'),
(71, 2, 'recipe_rated', 2, 'recipe', 'Rated recipe 3 stars', '2025-08-27 05:41:23'),
(72, 2, 'recipe_reviewed', 2, 'recipe', 'Reviewed recipe', '2025-08-27 05:41:48'),
(73, 2, 'recipe_rated', 3, 'recipe', 'Rated recipe 3 stars', '2025-08-27 05:43:56'),
(74, 2, 'profile_updated', 2, 'profile', 'Updated profile information', '2025-08-27 10:31:38'),
(75, 1, 'recipe_rated', 1, 'recipe', 'Rated recipe 4 stars', '2025-08-28 04:59:25'),
(76, 1, 'recipe_reviewed', 1, 'recipe', 'Reviewed recipe', '2025-08-28 04:59:25'),
(77, 2, 'recipe_rated', 3, 'recipe', 'Rated recipe 1 stars', '2025-08-28 05:00:36'),
(78, 2, 'recipe_reviewed', 3, 'recipe', 'Reviewed recipe', '2025-08-28 05:00:36'),
(79, 1, 'recipe_created', 9, 'recipe', 'Created new recipe: Test Recipe', '2025-08-28 05:23:51'),
(80, 1, 'recipe_deleted', 9, 'recipe', 'Deleted recipe', '2025-08-28 05:24:24'),
(81, 2, 'recipe_created', 10, 'recipe', 'Created new recipe: House', '2025-08-28 05:25:56'),
(82, 1, 'recipe_created', 11, 'recipe', 'Created new recipe: Test Single Cuisine Recipe', '2025-08-28 05:51:48'),
(83, 1, 'recipe_deleted', 11, 'recipe', 'Deleted recipe', '2025-08-28 05:53:57'),
(84, 1, 'recipe_created', 12, 'recipe', 'Created new recipe: Spaghetti Carbonara', '2025-08-28 05:55:21'),
(85, 1, 'recipe_deleted', 12, 'recipe', 'Deleted recipe', '2025-08-28 05:55:55'),
(86, 2, 'recipe_created', 13, 'recipe', 'Created new recipe: Noo Soup', '2025-08-28 06:25:30'),
(87, 1, 'recipe_created', 14, 'recipe', 'Created new recipe: Test Recipe Detail', '2025-08-28 06:31:18'),
(88, 1, 'recipe_deleted', 14, 'recipe', 'Deleted recipe', '2025-08-28 06:34:28'),
(89, 1, 'recipe_created', 15, 'recipe', 'Created new recipe: Test Simplified Recipe', '2025-08-28 06:43:29'),
(90, 1, 'recipe_deleted', 15, 'recipe', 'Deleted recipe', '2025-08-28 06:43:46'),
(91, 2, 'recipe_liked', 10, 'recipe', 'Liked recipe', '2025-08-28 06:57:46'),
(92, 2, 'recipe_favorited', 10, 'recipe', 'Added recipe to favorites', '2025-08-28 06:57:51'),
(93, 2, 'recipe_favorited', 13, 'recipe', 'Added recipe to favorites', '2025-08-28 07:01:04'),
(94, 2, 'recipe_liked', 13, 'recipe', 'Liked recipe', '2025-08-28 07:01:08'),
(95, 2, 'recipe_deleted', 10, 'recipe', 'Deleted recipe', '2025-08-28 07:01:45'),
(96, 2, 'recipe_deleted', 7, 'recipe', 'Deleted recipe', '2025-08-28 07:01:58'),
(97, 2, 'recipe_deleted', 3, 'recipe', 'Deleted recipe', '2025-08-28 07:02:10'),
(98, 2, 'recipe_unfavorited', 1, 'recipe', 'Removed recipe from favorites', '2025-08-28 07:02:18'),
(99, 2, 'recipe_created', 16, 'recipe', 'Created new recipe: Egg Fried', '2025-08-28 07:03:53'),
(100, 2, 'recipe_favorited', 16, 'recipe', 'Added recipe to favorites', '2025-08-28 07:04:05'),
(101, 2, 'recipe_rated', 16, 'recipe', 'Rated recipe 3 stars', '2025-08-28 07:06:02'),
(102, 2, 'recipe_reviewed', 16, 'recipe', 'Reviewed recipe', '2025-08-28 07:06:02'),
(103, 1, 'recipe_created', 17, 'recipe', 'Created new recipe: Test Fixed Recipe', '2025-08-28 07:23:40'),
(104, 1, 'recipe_deleted', 17, 'recipe', 'Deleted recipe', '2025-08-28 07:23:59'),
(105, 2, 'recipe_created', 18, 'recipe', 'Created new recipe: Spicy Noodle', '2025-08-28 07:30:57'),
(106, 1, 'recipe_created', 19, 'recipe', 'Created new recipe: Test Recipe with Image', '2025-08-28 07:40:04'),
(107, 1, 'recipe_created', 20, 'recipe', 'Created new recipe: Test Recipe with Real Image', '2025-08-28 07:42:47'),
(108, 1, 'recipe_deleted', 20, 'recipe', 'Deleted recipe', '2025-08-28 07:43:15'),
(109, 2, 'recipe_updated', 18, 'recipe', 'Updated recipe: Spicy Noodle', '2025-08-28 07:45:53'),
(110, 2, 'recipe_favorited', 18, 'recipe', 'Added recipe to favorites', '2025-08-28 07:59:24'),
(111, 2, 'recipe_liked', 18, 'recipe', 'Liked recipe', '2025-08-28 08:10:50'),
(112, 2, 'recipe_unfavorited', 16, 'recipe', 'Removed recipe from favorites', '2025-08-28 10:26:24'),
(113, 2, 'recipe_unfavorited', 13, 'recipe', 'Removed recipe from favorites', '2025-08-28 10:26:58'),
(114, 2, 'recipe_rated', 18, 'recipe', 'Rated recipe 2 stars', '2025-09-02 13:38:08'),
(115, 2, 'recipe_reviewed', 18, 'recipe', 'Reviewed recipe', '2025-09-02 13:38:08'),
(116, 2, 'recipe_created', 21, 'recipe', 'Created new recipe: Salmon', '2025-09-02 14:23:00'),
(117, 1, 'tip_created', 1, 'tip', 'Created cooking tip: Perfect Rice Every Time', '2025-09-02 15:11:44'),
(118, 1, 'tip_created', 2, 'tip', 'Created cooking tip: Quick Knife Sharpening Hack', '2025-09-02 15:11:44'),
(119, 1, 'tip_created', 3, 'tip', 'Created cooking tip: Buttermilk Substitute', '2025-09-02 15:11:44'),
(120, 1, 'tip_created', 1, 'tip', 'Created cooking tip: Perfect Rice Every Time', '2025-09-02 15:12:33'),
(121, 1, 'tip_created', 2, 'tip', 'Created cooking tip: Quick Knife Sharpening Hack', '2025-09-02 15:12:33'),
(122, 1, 'tip_created', 3, 'tip', 'Created cooking tip: Buttermilk Substitute', '2025-09-02 15:12:33'),
(123, 1, 'tip_rated', 27, 'tip', 'Rated cooking tip 1 stars', '2025-09-02 15:17:26'),
(124, 1, 'tip_rated', 27, 'tip', 'Rated cooking tip 2 stars', '2025-09-02 15:17:28'),
(125, 1, 'tip_liked', 27, 'tip', 'Liked cooking tip', '2025-09-02 15:17:33'),
(126, 1, 'tip_liked', 28, 'tip', 'Liked cooking tip', '2025-09-02 15:17:36'),
(127, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:41:53'),
(128, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:42:00'),
(129, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:43:59'),
(130, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:44:01'),
(131, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:44:02'),
(132, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:44:25'),
(133, 1, 'tip_liked', 29, 'tip', 'Liked cooking tip', '2025-09-02 16:44:58'),
(134, 1, 'tip_unliked', 29, 'tip', 'Unliked cooking tip', '2025-09-02 16:44:58'),
(135, 1, 'tip_liked', 29, 'tip', 'Liked cooking tip', '2025-09-02 16:44:59'),
(136, 1, 'tip_unliked', 29, 'tip', 'Unliked cooking tip', '2025-09-02 16:44:59'),
(137, 1, 'tip_liked', 29, 'tip', 'Liked cooking tip', '2025-09-02 16:45:00'),
(138, 1, 'tip_unliked', 29, 'tip', 'Unliked cooking tip', '2025-09-02 16:45:00'),
(139, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:45:36'),
(140, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 16:46:07'),
(141, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:47:56'),
(142, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 16:48:02'),
(143, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:48:08'),
(144, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 16:49:21'),
(145, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:49:28'),
(146, 2, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:49:38'),
(147, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:50:10'),
(148, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:50:11'),
(149, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:50:11'),
(150, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 16:50:38'),
(151, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:50:38'),
(152, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:50:40'),
(153, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:50:41'),
(154, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:50:41'),
(155, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:50:42'),
(156, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:51:08'),
(157, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:51:09'),
(158, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:51:09'),
(159, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:51:09'),
(160, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:51:09'),
(161, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:51:09'),
(162, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 16:51:09'),
(163, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 16:51:10'),
(164, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 16:51:12'),
(165, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 16:51:12'),
(166, 1, 'tip_unliked', 1, 'tip', 'Unliked cooking tip', '2025-09-02 17:23:10'),
(167, 1, 'tip_liked', 29, 'tip', 'Liked cooking tip', '2025-09-02 17:25:07'),
(168, 1, 'tip_liked', 28, 'tip', 'Liked cooking tip', '2025-09-02 17:25:14'),
(169, 1, 'tip_liked', 27, 'tip', 'Liked cooking tip', '2025-09-02 17:25:16'),
(170, 2, 'tip_liked', 1, 'tip', 'Liked cooking tip', '2025-09-02 17:26:01'),
(171, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 17:26:42'),
(172, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 17:26:42'),
(173, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:21'),
(174, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 17:27:23'),
(175, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:23'),
(176, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 17:27:23'),
(177, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:23'),
(178, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 17:27:23'),
(179, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:24'),
(180, 1, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 17:27:24'),
(181, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:27'),
(182, 1, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 17:27:29'),
(183, 1, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:29'),
(184, 1, 'tip_unliked', 29, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:33'),
(185, 1, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:34'),
(186, 1, 'tip_unliked', 28, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:37'),
(187, 1, 'tip_unliked', 27, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:38'),
(188, 1, 'tip_liked', 26, 'tip', 'Liked cooking tip', '2025-09-02 17:27:40'),
(189, 1, 'tip_unliked', 26, 'tip', 'Unliked cooking tip', '2025-09-02 17:27:41'),
(190, 1, 'tip_liked', 2, 'tip', 'Liked cooking tip', '2025-09-02 17:29:59'),
(191, 1, 'tip_liked', 1, 'tip', 'Liked cooking tip', '2025-09-02 18:01:33'),
(192, 2, 'tip_unliked', 1, 'tip', 'Unliked cooking tip', '2025-09-02 18:01:40'),
(193, 2, 'tip_liked', 1, 'tip', 'Liked cooking tip', '2025-09-02 18:01:51'),
(194, 3, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 18:04:09'),
(195, 3, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 18:04:10'),
(196, 2, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 18:04:31'),
(197, 2, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 18:04:33'),
(198, 2, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 18:04:34'),
(199, 2, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 18:04:41'),
(200, 2, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 18:04:44'),
(201, 2, 'tip_liked', 29, 'tip', 'Liked cooking tip', '2025-09-02 18:04:46'),
(202, 5, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 18:05:56'),
(203, 5, 'tip_liked', 30, 'tip', 'Liked cooking tip', '2025-09-02 18:05:58'),
(204, 5, 'tip_liked', 29, 'tip', 'Liked cooking tip', '2025-09-02 18:06:02'),
(205, 5, 'tip_liked', 11, 'tip', 'Liked cooking tip', '2025-09-02 18:06:14'),
(206, 5, 'tip_unliked', 11, 'tip', 'Unliked cooking tip', '2025-09-02 18:06:15'),
(207, 5, 'tip_liked', 12, 'tip', 'Liked cooking tip', '2025-09-02 18:06:19'),
(208, 5, 'tip_unliked', 12, 'tip', 'Unliked cooking tip', '2025-09-02 18:06:20'),
(209, 5, 'tip_liked', 26, 'tip', 'Liked cooking tip', '2025-09-02 18:06:26'),
(210, 5, 'tip_unliked', 26, 'tip', 'Unliked cooking tip', '2025-09-02 18:06:27'),
(211, 2, 'tip_liked', 28, 'tip', 'Liked cooking tip', '2025-09-02 18:16:08'),
(212, 1, 'tip_unliked', 1, 'tip', 'Unliked cooking tip', '2025-09-02 18:16:51'),
(213, 1, 'tip_created', 41, 'tip', 'Created cooking tip: Test Cooking Tip', '2025-09-02 18:27:20'),
(214, 2, 'tip_created', 42, 'tip', 'Created cooking tip: Hope', '2025-09-02 18:28:58'),
(215, 2, 'tip_deleted', 42, 'tip', 'Deleted cooking tip', '2025-09-02 18:31:16'),
(216, 1, 'tip_deleted', 41, 'tip', 'Deleted cooking tip', '2025-09-02 18:31:21'),
(217, 1, 'tip_created', 43, 'tip', 'Created cooking tip: Test Tip', '2025-09-02 18:34:35'),
(218, 2, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 18:57:58'),
(219, 2, 'tip_liked', 31, 'tip', 'Liked cooking tip', '2025-09-02 18:58:00'),
(220, 2, 'tip_unliked', 31, 'tip', 'Unliked cooking tip', '2025-09-02 18:58:08'),
(221, 2, 'tip_unliked', 30, 'tip', 'Unliked cooking tip', '2025-09-02 18:58:14'),
(222, 2, 'recipe_updated', 21, 'recipe', 'Updated recipe: Salmon', '2025-09-02 18:58:51');

-- --------------------------------------------------------

--
-- Table structure for table `user_favorites`
--

CREATE TABLE `user_favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_favorites`
--

INSERT INTO `user_favorites` (`id`, `user_id`, `recipe_id`, `created_at`) VALUES
(15, 2, 18, '2025-08-28 07:59:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `cooking_tips`
--
ALTER TABLE `cooking_tips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_created` (`created_at` DESC);

--
-- Indexes for table `cuisine_types`
--
ALTER TABLE `cuisine_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `educational_resources`
--
ALTER TABLE `educational_resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_recipes_cuisine_type` (`cuisine_type_id`);

--
-- Indexes for table `recipe_categories`
--
ALTER TABLE `recipe_categories`
  ADD PRIMARY KEY (`recipe_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_recipe_ingredient` (`recipe_id`,`ingredient_id`),
  ADD KEY `idx_recipe_ingredients` (`recipe_id`),
  ADD KEY `idx_ingredient_recipes` (`ingredient_id`);

--
-- Indexes for table `recipe_likes`
--
ALTER TABLE `recipe_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_recipe_like` (`user_id`,`recipe_id`),
  ADD KEY `idx_recipe_likes` (`recipe_id`,`user_id`);

--
-- Indexes for table `recipe_reviews`
--
ALTER TABLE `recipe_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_recipe_review` (`user_id`,`recipe_id`),
  ADD KEY `idx_recipe_reviews` (`recipe_id`,`user_id`),
  ADD KEY `idx_user_reviews` (`user_id`);

--
-- Indexes for table `recipe_views`
--
ALTER TABLE `recipe_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_unique_view` (`recipe_id`,`user_id`,`ip_address`,`viewed_at`),
  ADD KEY `idx_recipe_views` (`recipe_id`,`viewed_at`),
  ADD KEY `idx_user_views` (`user_id`,`viewed_at`),
  ADD KEY `idx_ip_views` (`ip_address`,`viewed_at`);

--
-- Indexes for table `tip_likes`
--
ALTER TABLE `tip_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_tip_like` (`user_id`,`tip_id`),
  ADD KEY `idx_tip_likes` (`tip_id`,`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_name` (`firstName`,`lastName`);

--
-- Indexes for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_activity` (`user_id`,`activity_type`,`created_at`);

--
-- Indexes for table `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_recipe` (`user_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`),
  ADD KEY `idx_user_favorites` (`user_id`,`recipe_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cooking_tips`
--
ALTER TABLE `cooking_tips`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `cuisine_types`
--
ALTER TABLE `cuisine_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `educational_resources`
--
ALTER TABLE `educational_resources`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `recipe_likes`
--
ALTER TABLE `recipe_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `recipe_reviews`
--
ALTER TABLE `recipe_reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `recipe_views`
--
ALTER TABLE `recipe_views`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `tip_likes`
--
ALTER TABLE `tip_likes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT for table `user_favorites`
--
ALTER TABLE `user_favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cooking_tips`
--
ALTER TABLE `cooking_tips`
  ADD CONSTRAINT `cooking_tips_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `educational_resources`
--
ALTER TABLE `educational_resources`
  ADD CONSTRAINT `educational_resources_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `recipes_ibfk_2` FOREIGN KEY (`cuisine_type_id`) REFERENCES `cuisine_types` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `recipe_categories`
--
ALTER TABLE `recipe_categories`
  ADD CONSTRAINT `recipe_categories_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_likes`
--
ALTER TABLE `recipe_likes`
  ADD CONSTRAINT `recipe_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_likes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_reviews`
--
ALTER TABLE `recipe_reviews`
  ADD CONSTRAINT `recipe_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recipe_reviews_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipe_views`
--
ALTER TABLE `recipe_views`
  ADD CONSTRAINT `recipe_views_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `recipe_views_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tip_likes`
--
ALTER TABLE `tip_likes`
  ADD CONSTRAINT `tip_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tip_likes_ibfk_2` FOREIGN KEY (`tip_id`) REFERENCES `cooking_tips` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD CONSTRAINT `user_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_favorites`
--
ALTER TABLE `user_favorites`
  ADD CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_favorites_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
