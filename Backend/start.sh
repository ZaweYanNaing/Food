#!/bin/bash

echo "🚀 Starting FoodFusion Backend Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ FoodFusion Backend is ready!"
echo ""
echo "🌐 Access URLs:"
echo "   - PHP API: http://localhost:8080"
echo "   - phpMyAdmin: http://localhost:8001"
echo "   - MySQL: localhost:3306"
echo ""
echo "🔑 Default credentials:"
echo "   - Database: foodfusion_db"
echo "   - Username: foodfusion_user"
echo "   - Password: foodfusion_pass"
echo "   - Admin user: admin@foodfusion.com / password123"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
