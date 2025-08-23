# FoodFusion PHP Backend

A PHP-based REST API backend for the FoodFusion recipe application.

## Features

- User authentication (login/register)
- Recipe management (CRUD operations)
- Recipe search functionality
- MySQL database integration
- CORS support for frontend integration
- Docker containerization

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Recipes
- `GET /recipes` - Get all recipes
- `POST /recipes` - Create new recipe
- `GET /recipes/search?q={query}` - Search recipes

### Users
- `GET /users/profile` - Get user profile (requires authorization)

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed
- Ports 8080, 3306, and 8001 available

### Quick Start

1. **Clone and navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Start the services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the services:**
   - PHP API: http://localhost:8080
   - phpMyAdmin: http://localhost:8001
   - MySQL: localhost:3306

4. **Database credentials:**
   - Database: `foodfusion_db`
   - Username: `foodfusion_user`
   - Password: `foodfusion_pass`
   - Root Password: `root_pass`

### Database Setup

The database will be automatically initialized with:
- Sample categories (Breakfast, Lunch, Dinner, etc.)
- Sample admin user (admin@foodfusion.com / password123)
- Sample recipes

### Testing the API

You can test the API endpoints using curl or any API testing tool:

```bash
# Get all recipes
curl http://localhost:8080/recipes

# Search recipes
curl "http://localhost:8080/recipes/search?q=pancake"

# User registration
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# User login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Frontend Integration

The backend is configured with CORS to allow requests from your React frontend. Update your frontend API calls to use:

```javascript
const API_BASE_URL = 'http://localhost:8080';

// Example API call
const response = await fetch(`${API_BASE_URL}/recipes`);
const recipes = await response.json();
```

## File Structure

```
Backend/
├── config/
│   ├── database.php      # Database connection
│   └── cors.php          # CORS configuration
├── controllers/
│   ├── AuthController.php # Authentication logic
│   ├── RecipeController.php # Recipe management
│   └── UserController.php # User operations
├── database/
│   ├── schema.sql        # Database schema
│   └── init.sql          # Database initialization
├── public/
│   ├── .htaccess         # URL rewriting rules
│   └── index.php         # Main API entry point
├── docker-compose.yml    # Docker services configuration
├── Dockerfile            # PHP container configuration
└── apache.conf           # Apache virtual host configuration
```

## Development

### Adding New Endpoints

1. Create a new controller in the `controllers/` directory
2. Add the routing logic in `public/index.php`
3. Update the database schema if needed

### Database Changes

1. Modify `database/schema.sql`
2. Rebuild the database container: `docker-compose down && docker-compose up -d`

## Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in `docker-compose.yml`
2. **Database connection failed**: Ensure MySQL container is running
3. **Permission denied**: Check file permissions and Docker volume mounts

### Logs

View container logs:
```bash
docker-compose logs www      # PHP application logs
docker-compose logs db       # MySQL logs
docker-compose logs phpmyadmin # phpMyAdmin logs
```

## Security Notes

- This is a development setup
- For production, implement proper JWT token validation
- Use environment variables for sensitive data
- Enable HTTPS
- Implement rate limiting
- Add input validation and sanitization
