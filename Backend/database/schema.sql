-- FoodFusion Database Schema
-- Updated to match the actual database structure

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

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

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `recipe_categories`
--

CREATE TABLE `recipe_categories` (
  `recipe_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Sample data for tables
--

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

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(11, 'Zawe Yan Naing', 'zawe@gmail.com', 'EIir', 'jflkajdsfkljdslfkjsdklfl', 'new', '2025-09-02 19:00:18', '2025-09-02 19:00:18');

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
(7, 'Cast Iron Seasoning', 'To maintain your cast iron skillet, clean it with hot water and a stiff brush, then dry completely. Apply a thin layer of oil and heat in the oven at 350°F for 1 hour. This creates a natural non-stick surface.', 1, 60, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(8, 'Roasting Vegetables', 'Cut vegetables into uniform sizes for even cooking. Toss with oil, salt, and pepper, then roast at 425°F. Don\'t overcrowd the pan - vegetables need space to caramelize properly.', 1, 10, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(9, 'Freeze Herbs in Oil', 'Chop fresh herbs and freeze them in ice cube trays with olive oil. This preserves their flavor and makes it easy to add herbs to dishes. One cube is perfect for most recipes.', 1, 15, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(10, 'Bread Crumb Substitute', 'Use crushed crackers, cereal, or nuts as breadcrumb substitutes. This adds different flavors and textures to your dishes while using what you have on hand.', 1, 5, '2025-09-02 15:11:25', '2025-09-02 15:11:25'),
(11, 'Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 5, '2025-09-02 15:11:44', '2025-09-02 15:11:44'),
(12, 'Quick Knife Sharpening Hack', 'Use the bottom of a ceramic mug to quickly sharpen your knives. The unglazed ring at the bottom works like a honing steel in a pinch! This is perfect for when you don\'t have access to proper sharpening tools.', 1, 2, '2025-09-02 15:11:44', '2025-09-02 15:11:44'),
(26, 'Herb Storage Trick', 'Store fresh herbs like parsley and cilantro in a glass of water in the refrigerator, like flowers in a vase. Cover loosely with a plastic bag. This keeps them fresh for up to 2 weeks.', 1, 2, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(27, 'Cast Iron Seasoning', 'To maintain your cast iron skillet, clean it with hot water and a stiff brush, then dry completely. Apply a thin layer of oil and heat in the oven at 350°F for 1 hour. This creates a natural non-stick surface.', 1, 60, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(28, 'Roasting Vegetables', 'Cut vegetables into uniform sizes for even cooking. Toss with oil, salt, and pepper, then roast at 425°F. Don\'t overcrowd the pan - vegetables need space to caramelize properly.', 1, 10, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(29, 'Freeze Herbs in Oil', 'Chop fresh herbs and freeze them in ice cube trays with olive oil. This preserves their flavor and makes it easy to add herbs to dishes. One cube is perfect for most recipes.', 1, 15, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(30, 'Bread Crumb Substitute', 'Use crushed crackers, cereal, or nuts as breadcrumb substitutes. This adds different flavors and textures to your dishes while using what you have on hand.', 1, 5, '2025-09-02 15:12:09', '2025-09-02 15:12:09'),
(31, 'Perfect Rice Every Time', 'The key to perfect rice is the 1:2 ratio (1 cup rice to 2 cups water) and never lifting the lid while it cooks. Let it rest for 10 minutes after cooking for fluffy results. For brown rice, use 1:2.5 ratio and cook for 45 minutes.', 1, 5, '2025-09-02 16:25:10', '2025-09-02 16:25:10');

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
(10, 'Greek', 'Greek Mediterranean cuisine', '2025-08-28 05:12:55');

--
-- Dumping data for table `educational_resources`
--

INSERT INTO `educational_resources` (`id`, `title`, `description`, `type`, `file_path`, `download_count`, `created_by`, `created_at`, `updated_at`) VALUES
(26, 'Be a Food Hero', 'Cook together. Eat together. Talk together.', 'guide', '/uploads/educational-resources/68b7ae4c5c103_1756868172.pdf', 1, 2, '2025-09-03 02:56:12', '2025-09-03 02:56:23'),
(27, 'MY INTER RECIPES', 'A culinary journey around the world of ', 'document', '/uploads/educational-resources/68b7af4d532af_1756868429.pdf', 1, 2, '2025-09-03 03:00:29', '2025-09-03 03:05:14'),
(28, 'Salmon Fish ', 'Fresh air and real fresh condition with loves', 'infographic', '/uploads/educational-resources/68b7afad23817_1756868525.jpg', 0, 2, '2025-09-03 03:02:05', '2025-09-03 03:25:12'),
(29, 'Pizza', 'How to make pizza at home specially', 'presentation', '/uploads/educational-resources/68b7b86ec6119_1756870766.pptx', 0, 2, '2025-09-03 03:39:26', '2025-09-03 03:39:26'),
(30, 'Egg Hack', 'perfect egg hack. It is fried to pefection.', 'video', '/uploads/educational-resources/68b7c3e9b08f0_1756873705.mp4', 1, 2, '2025-09-03 04:28:25', '2025-09-03 04:28:32');

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

--
-- Dumping data for table `recipe_likes`
--

INSERT INTO `recipe_likes` (`id`, `user_id`, `recipe_id`, `created_at`) VALUES
(1, 1, 1, '2025-08-27 05:40:32'),
(3, 2, 13, '2025-08-28 07:01:08'),
(4, 2, 18, '2025-08-28 08:10:50');

--
-- Dumping data for table `recipe_reviews`
--

INSERT INTO `recipe_reviews` (`id`, `user_id`, `recipe_id`, `review_text`, `rating`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Updated review with new rating', '4', '2025-08-27 05:34:18', '2025-08-28 04:59:25'),
(2, 1, 2, 'Great stir fry recipe, very flavorful and easy to make.', '4', '2025-08-27 05:34:18', '2025-08-28 04:56:03'),
(3, 2, 2, 'This is good for food industry.', '5', '2025-08-27 05:41:48', '2025-08-27 05:41:48'),
(5, 2, 16, 'Good ', '3', '2025-08-28 07:06:02', '2025-08-28 07:06:02'),
(7, 2, 18, 'good', '2', '2025-09-02 13:38:08', '2025-09-02 13:38:08');

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `bio`, `location`, `website`, `profile_image`, `created_at`, `updated_at`) VALUES
(1, 'First ', 'User', 'zz@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test bio', 'Test City', 'test.com', '', '2025-08-26 09:56:46', '2025-08-27 05:43:21'),
(2, 'Zawe Yan', 'Naing', 'zawe@gmail.com', '$2y$10$7lcVWx8vsStpnoXd/4UNbeOcNnf4Noe3i5yGLOIwVqCga66CRVTdS', 'I\'ve a good day and ', 'Mandalay', 'github.com/ZaweYanNaing', '/uploads/profile_2_1756217127.jpg', '2025-08-26 09:57:28', '2025-08-27 10:31:38'),
(3, 'Aung', 'Naing', 'aung@gmail.com', '$2y$10$M6X9LnPlmZ/sVuMc820g2Orsc4SsDu2CqTC6YlTOZtRs2JcyUrolS', NULL, NULL, NULL, '/uploads/profile_3_1756210717.jpeg', '2025-08-26 10:28:56', '2025-08-26 12:18:37'),
(4, 'Alice', 'Smith', 'alice@example.com', '$2y$10$3uHC80OfcmkH5BXaujcwGeVmMAsOG9WP/a.fFpo/hX1cIzhqkFMxS', NULL, NULL, NULL, NULL, '2025-08-26 10:41:44', '2025-08-26 10:41:44'),
(5, 'joe', 'Naing', 'joe@gmail.com', '$2y$10$Ri1fIaHkqGljL33Wmlt1reL/mUn9e8TyqF716t4v9c5gi2yePduwK', NULL, NULL, NULL, NULL, '2025-09-02 18:05:53', '2025-09-02 18:05:53');

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
