#!/bin/bash

# Quick Deployment Script for AWS
# Run this script after updating your backend code

echo "🚀 Starting deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create .env file with CLIENT_URL and other variables"
    echo "   See .env.example for reference"
    exit 1
fi

# Check if CLIENT_URL is set
if ! grep -q "CLIENT_URL=" .env; then
    echo "⚠️  Warning: CLIENT_URL not found in .env"
    echo "   Add: CLIENT_URL=http://your-frontend-url"
fi

echo "📦 Pulling latest code..."
git pull origin main

echo "🛑 Stopping existing containers..."
docker-compose down

echo "🔨 Building and starting containers..."
docker-compose up -d --build

echo "⏳ Waiting for containers to start..."
sleep 5

echo "📊 Container status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Check logs: docker-compose logs -f backend"
echo "   2. Test API: curl http://localhost:5000/api/auth/check-auth"
echo "   3. Update frontend .env with: VITE_API_BASE_URL=http://your-server-ip:5000"
echo ""
echo "🔍 View logs now? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    docker-compose logs -f backend
fi
