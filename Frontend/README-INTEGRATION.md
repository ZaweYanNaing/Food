# FoodFusion Frontend-Backend Integration

## Overview
This document describes the complete integration between the FoodFusion Frontend (React/TypeScript) and Backend (PHP/MySQL) for user authentication functionality.

## What Has Been Implemented

### 1. Backend Updates

#### Database Schema (`Backend/database/schema.sql`)
- Updated users table to use `firstName` and `lastName` instead of `username`
- Added proper indexes for performance
- Maintained existing sample data with updated structure

#### Authentication Controller (`Backend/controllers/AuthController.php`)
- **Login Method**: 
  - Validates email and password
  - Returns user data with firstName/lastName
  - Generates authentication tokens
  - Proper HTTP status codes (200, 401, 500)
  
- **Register Method**:
  - Validates all required fields (firstName, lastName, email, password)
  - Email format validation
  - Password length validation (minimum 6 characters)
  - Checks for existing users
  - Returns complete user data and token
  - Proper HTTP status codes (201, 400, 409, 500)

#### API Routing (`Backend/public/index.php`)
- Proper CORS headers for cross-origin requests
- HTTP method validation
- Consistent error handling
- Proper status code management

### 2. Frontend Updates

#### API Service (`Frontend/src/services/api.ts`)
- Centralized API configuration
- Base URL: `http://localhost:8080/api`
- Automatic token handling in headers
- Consistent error handling
- Type-safe API responses

#### Authentication Context (`Frontend/src/contexts/AuthContext.tsx`)
- **Login Functionality**:
  - Account lockout after 3 failed attempts
  - 3-minute lockout period
  - Proper error handling and user feedback
  - Token storage in localStorage
  
- **Registration Functionality**:
  - Form validation
  - Success/error handling
  - Automatic login after successful registration
  
- **Session Management**:
  - Persistent user sessions
  - Automatic token inclusion in requests
  - Secure logout functionality

#### UI Components
- **JoinUsModal**: Registration form with validation
- **LoginPage**: Complete login interface with lockout handling
- **RegisterPage**: Full registration form with password strength indicator

### 3. API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication

#### Response Format
```json
{
  "success": true,
  "message": "Operation message",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "token": "authentication_token_here"
}
```

### 4. Security Features

#### Backend
- Password hashing using PHP's `password_hash()`
- Input validation and sanitization
- SQL injection prevention with prepared statements
- Proper HTTP status codes for different error scenarios

#### Frontend
- Account lockout mechanism
- Secure token storage
- Form validation
- XSS protection through proper data handling

## How to Test

### 1. Start Backend Services
```bash
cd Backend
docker-compose up -d
```

### 2. Start Frontend Development Server
```bash
cd Frontend
bun run dev
```

### 3. Test API Endpoints
Use the provided `test-api.html` file or test with curl:

#### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'
```

#### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4. Test Frontend Integration
- Open `http://localhost:5173` in your browser
- Navigate to `/register` or `/login`
- Test the complete authentication flow

## Database Access

### PhpMyAdmin
- URL: `http://localhost:8001`
- Username: `foodfusion_user`
- Password: `foodfusion_pass`
- Database: `foodfusion_db`

### Direct MySQL Access
```bash
docker exec -it foodfusion_db mysql -u foodfusion_user -pfoodfusion_pass foodfusion_db
```

## File Structure

```
Food/
├── Backend/
│   ├── controllers/
│   │   └── AuthController.php          # Authentication logic
│   ├── database/
│   │   └── schema.sql                  # Updated database schema
│   ├── public/
│   │   └── index.php                   # API routing
│   └── docker-compose.yml              # Backend services
└── Frontend/
    ├── src/
    │   ├── contexts/
    │   │   └── AuthContext.tsx         # Authentication state management
    │   ├── services/
    │   │   └── api.ts                  # API service layer
    │   ├── pages/auth/
    │   │   ├── LoginPage.tsx           # Login interface
    │   │   └── RegisterPage.tsx        # Registration interface
    │   └── components/ui/
    │       └── JoinUsModal.tsx         # Registration modal
    └── test-api.html                   # API testing interface
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure Docker containers are running
   - Check database credentials in `Backend/config/database.php`
   - Verify MySQL service is healthy: `docker-compose ps`

2. **CORS Issues**
   - Backend includes proper CORS headers
   - Frontend makes requests to correct backend URL
   - Check browser console for CORS errors

3. **Authentication Failures**
   - Verify user exists in database
   - Check password hashing
   - Ensure proper request format

4. **Frontend Not Starting**
   - Check if port 5173 is available
   - Verify all dependencies are installed: `bun install`
   - Check for TypeScript compilation errors

### Debug Commands

```bash
# Check backend logs
docker-compose logs www

# Check database logs
docker-compose logs db

# Test database connection
docker exec -it foodfusion_db mysql -u foodfusion_user -pfoodfusion_pass foodfusion_db -e "SELECT 1"

# Check frontend build
cd Frontend && bun run build
```

## Next Steps

1. **JWT Implementation**: Replace simple tokens with JWT for better security
2. **Password Reset**: Add forgot password functionality
3. **Email Verification**: Implement email verification for new accounts
4. **Social Login**: Add Google, Facebook, or other OAuth providers
5. **Rate Limiting**: Implement API rate limiting to prevent abuse
6. **Logging**: Add comprehensive logging for security monitoring

## Security Considerations

- **Production Deployment**: Change default passwords and database credentials
- **HTTPS**: Use HTTPS in production for secure data transmission
- **Token Expiration**: Implement token expiration and refresh mechanisms
- **Input Validation**: Continue to validate all user inputs thoroughly
- **SQL Injection**: Maintain use of prepared statements
- **XSS Protection**: Ensure proper output encoding in frontend

## Support

For issues or questions about this integration:
1. Check the troubleshooting section above
2. Review backend logs: `docker-compose logs www`
3. Check browser console for frontend errors
4. Verify API endpoints with the test file provided
