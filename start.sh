#!/bin/bash

# Replit Startup Script
echo "🚀 Starting Video Editor Portfolio..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if build exists
if [ ! -d "build" ]; then
    echo "🔨 Building application..."
    npm run build
fi

# Start the application
echo "✨ Starting server on port 3000..."
npm run serve