#!/bin/bash

# SubSync Production Server Setup Script
# Run with: sudo bash setup-production-server.sh

set -e

echo "🚀 Setting up SubSync Production Server..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx

# Install Git
echo "📦 Installing Git..."
apt install -y git

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/subsync
mkdir -p /var/www/html/subsync

# Set proper permissions
echo "🔐 Setting permissions..."
chown -R www-data:www-data /var/www/html/subsync
chmod -R 755 /var/www/html/subsync

# Copy Nginx configuration
echo "🔧 Configuring Nginx..."
if [ -f "/var/www/subsync/.github/nginx-config/subsync.conf" ]; then
    cp /var/www/subsync/.github/nginx-config/subsync.conf /etc/nginx/sites-available/subsync
    ln -sf /etc/nginx/sites-available/subsync /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl reload nginx
    echo "✅ Nginx configured successfully"
else
    echo "⚠️ Nginx config file not found, skipping..."
fi

# Setup PM2 startup
echo "🔧 Configuring PM2 startup..."
pm2 startup systemd -u www-data --hp /var/www
systemctl enable pm2-www-data

# Setup firewall (UFW)
echo "🔥 Configuring firewall..."
ufw --force enable
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 3000  # Backend port
echo "✅ Firewall configured"

# Install SSL certificate (optional)
echo "🔒 SSL Certificate Setup..."
echo "To setup SSL certificate, run:"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d your-domain.com"

# Create deployment user (optional)
echo "👤 Creating deployment user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    usermod -aG sudo deploy
    echo "✅ Deploy user created"
else
    echo "⚠️ Deploy user already exists"
fi

# Setup SSH keys directory
echo "🔑 Setting up SSH keys..."
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chown deploy:deploy /home/deploy/.ssh

echo ""
echo "✅ Production server setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your SSH public key to /home/deploy/.ssh/authorized_keys"
echo "2. Clone your repository: git clone https://github.com/mrsathishe/subsync.git /var/www/subsync"
echo "3. Setup your environment variables in /var/www/subsync/backend/.env"
echo "4. Configure GitHub Secrets with your server details"
echo "5. Push to main branch to trigger deployment"
echo ""