#!/bin/bash

# SubSync Complete Server Setup Script
# Run this on your Ubuntu server (192.168.1.2)
# Usage: bash complete-setup.sh

set -e

echo "🚀 Setting up SubSync on Ubuntu Server (192.168.1.2)..."
echo "This will install everything needed for SubSync with direct port access"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please run this script as a regular user (not root)"
    exit 1
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_status "System updated"

# Install Node.js 18
echo "📦 Installing Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_status "Node.js installed: $(node --version)"
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install PM2
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_status "PM2 installed"
else
    print_status "PM2 already installed"
fi

# Install Git
echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install -y git
    print_status "Git installed"
else
    print_status "Git already installed"
fi

# Create application directory
echo "📁 Setting up application directory..."
mkdir -p /home/$USER/subsync
cd /home/$USER/subsync

# Clone SubSync repository
echo "📥 Cloning SubSync repository..."
if [ ! -d ".git" ]; then
    git clone https://github.com/mrsathishe/subsync.git .
    print_status "Repository cloned"
else
    git pull origin main
    print_status "Repository updated"
fi

# Setup Backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
npm install --production
print_status "Backend dependencies installed"

# Setup environment file
if [ ! -f ".env" ]; then
    if [ -f ".env.prod" ]; then
        cp .env.prod .env
        print_warning "Copied .env.prod to .env - please update database settings"
    else
        cat > .env << EOF
# Database Configuration
DB_HOST=192.168.1.2
DB_PORT=5432
DB_NAME=subsync
DB_USER=sathish
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=3000
NODE_ENV=production
EOF
        print_warning "Created basic .env file - please update with your settings"
    fi
fi

# Start backend with PM2
echo "🚀 Starting backend service..."
pm2 delete subsync-backend 2>/dev/null || true
pm2 start server.js --name subsync-backend --env production
print_status "Backend started on port 3000"

# Setup Frontend
echo "🎨 Setting up frontend..."
cd ../frontend

# Install frontend dependencies
npm install --production
print_status "Frontend dependencies installed"

# Build frontend
npm run build
print_status "Frontend built"

# Start frontend with PM2 on port 3001
echo "🌐 Starting frontend service..."
pm2 delete subsync-frontend 2>/dev/null || true
pm2 serve dist 3001 --name subsync-frontend --spa
print_status "Frontend started on port 3001"

# Save PM2 configuration
pm2 save
print_status "PM2 configuration saved"

# Setup PM2 startup script
echo "⚡ Setting up PM2 auto-start..."
pm2 startup systemd -u $USER --hp /home/$USER | grep -E '^sudo' | bash
print_status "PM2 auto-start configured"

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 3000  # Backend
sudo ufw allow 3001  # Frontend Production
sudo ufw allow 5173  # Frontend Development
print_status "Firewall configured"

# Test services
echo "🔍 Testing services..."
sleep 5

# Test backend
if curl -f -s http://localhost:3000/health > /dev/null; then
    print_status "Backend is responding on port 3000"
else
    print_error "Backend is not responding on port 3000"
fi

# Test frontend
if curl -f -s http://localhost:3001 > /dev/null; then
    print_status "Frontend is responding on port 3001"
else
    print_error "Frontend is not responding on port 3001"
fi

# Show PM2 status
echo "📊 Service status:"
pm2 list

# Show network information
echo ""
echo "🌐 Network Configuration:"
echo "Local IP: $(hostname -I | awk '{print $1}')"
echo "Public IP: $(curl -s ifconfig.me 2>/dev/null || echo 'Unable to fetch')"

echo ""
echo "🎉 SubSync setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Update database settings in: /home/$USER/subsync/backend/.env"
echo "2. Configure router port forwarding:"
echo "   - Port 3000 → 192.168.1.2:3000 (Backend API)"
echo "   - Port 3001 → 192.168.1.2:3001 (Frontend Production)"
echo "   - Port 5173 → 192.168.1.2:5173 (Frontend Development)"
echo ""
echo "🌐 Access URLs (after router setup):"
echo "   - Backend API: http://satz.co.in:3000/health"
echo "   - Frontend Prod: http://satz.co.in:3001"
echo "   - Frontend Dev: http://satz.co.in:5173 (when running npm run dev)"
echo ""
echo "🔧 Useful Commands:"
echo "   pm2 list                    # Show running processes"
echo "   pm2 logs subsync-backend    # View backend logs"
echo "   pm2 logs subsync-frontend   # View frontend logs"
echo "   pm2 restart all             # Restart all services"
echo ""
echo "📝 Edit database settings:"
echo "   nano /home/$USER/subsync/backend/.env"
echo ""

# Show environment file location
print_warning "Please edit the database configuration in:"
echo "/home/$USER/subsync/backend/.env"