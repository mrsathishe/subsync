#!/bin/bash

# Production deployment script for SubSync
set -e

echo "🚀 Starting SubSync deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed."; exit 1; }
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed."; exit 1; }
    command -v pm2 >/dev/null 2>&1 || { print_warning "PM2 not found. Installing PM2..."; npm install -g pm2; }
    
    print_success "Dependencies check completed"
}

# Install all dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    npm install --production=false
    
    # Frontend dependencies
    cd frontend
    npm install
    cd ..
    
    # Backend dependencies (if separate package.json exists)
    if [ -f "backend/package.json" ]; then
        cd backend
        npm install --production
        cd ..
    fi
    
    print_success "Dependencies installed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    npm run build
    cd ..
    
    # Verify build exists
    if [ ! -d "frontend/dist" ]; then
        print_error "Frontend build failed - dist directory not found"
        exit 1
    fi
    
    print_success "Frontend built successfully"
}

# Database setup
setup_database() {
    print_status "Setting up database..."
    
    if [ -f "backend/scripts/fix-schema.js" ]; then
        node backend/scripts/fix-schema.js
        print_success "Database schema updated"
    fi
    
    if [ -f "backend/scripts/add-payment-details.js" ]; then
        node backend/scripts/add-payment-details.js
        print_success "Payment system setup completed"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating directories..."
    
    mkdir -p logs
    mkdir -p backups
    
    print_success "Directories created"
}

# Set file permissions
set_permissions() {
    print_status "Setting file permissions..."
    
    chmod +x deploy.sh
    chmod 644 .env.production
    chmod 755 logs
    
    print_success "Permissions set"
}

# Stop existing PM2 processes
stop_existing() {
    print_status "Stopping existing processes..."
    
    pm2 delete subsync 2>/dev/null || true
    
    print_success "Existing processes stopped"
}

# Start application with PM2
start_application() {
    print_status "Starting application..."
    
    pm2 start ecosystem.config.js
    pm2 save
    
    print_success "Application started"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    sleep 5
    
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_error "Health check failed"
        pm2 logs subsync --lines 50
        exit 1
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    check_dependencies
    install_dependencies
    build_frontend
    setup_database
    create_directories
    set_permissions
    stop_existing
    start_application
    health_check
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Application is running on http://localhost:3000"
    print_status "Use 'pm2 logs subsync' to view logs"
    print_status "Use 'pm2 monit' to monitor the application"
}

# Run main function
main "$@"