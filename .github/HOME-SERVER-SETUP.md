# Home Server Setup Guide for satz.co.in/subsync

## Your Network Configuration
- **Public IP**: 17.233.103.242
- **Local Server**: 192.168.1.2 (Ubuntu)
- **Domain**: satz.co.in (GoDaddy)
- **Target URL**: satz.co.in/subsync

## Step 1: GoDaddy DNS Configuration

### 1.1 Login to GoDaddy
1. Go to [godaddy.com](https://godaddy.com)
2. Login to your account
3. Go to **My Products** → **DNS** → **Manage DNS** for satz.co.in

### 1.2 Create/Update DNS Records
Add these DNS records:

| Type | Name | Value | TTL |
|------|------|--------|-----|
| A | @ | 17.233.103.242 | 1 Hour |
| A | www | 17.233.103.242 | 1 Hour |

**What this does:**
- `satz.co.in` → points to your public IP
- `www.satz.co.in` → points to your public IP

## Step 2: Router Port Forwarding

### 2.1 Access Your Router
1. Open browser and go to your router's IP (usually `192.168.1.1` or `192.168.0.1`)
2. Login with admin credentials

### 2.2 Setup Port Forwarding Rules

Add these port forwarding rules:

| Service | External Port | Internal IP | Internal Port | Protocol |
|---------|---------------|-------------|---------------|----------|
| HTTP | 80 | 192.168.1.2 | 80 | TCP |
| HTTPS | 443 | 192.168.1.2 | 443 | TCP |
| SubSync API | 3000 | 192.168.1.2 | 3000 | TCP |

**What this does:**
- Routes web traffic from internet → your Ubuntu server
- External visitors can reach your server through your public IP

## Step 3: Dynamic DNS (DDNS) Setup

Since your public IP might change, set up DDNS to auto-update GoDaddy:

### 3.1 Install DDNS Client on Ubuntu Server (192.168.1.2)
```bash
# Install ddclient
sudo apt update
sudo apt install ddclient

# Configure for GoDaddy
sudo nano /etc/ddclient.conf
```

### 3.2 DDNS Configuration File
```bash
# /etc/ddclient.conf
protocol=godaddy
use=web
server=api.godaddy.com
login=YOUR_GODADDY_API_KEY
password=YOUR_GODADDY_API_SECRET
satz.co.in,www.satz.co.in
```

### 3.3 Get GoDaddy API Keys
1. Go to [developer.godaddy.com](https://developer.godaddy.com/)
2. Create account and get API Key & Secret
3. Add them to the ddclient.conf file above

### 3.4 Start DDNS Service
```bash
sudo systemctl enable ddclient
sudo systemctl start ddclient
sudo systemctl status ddclient
```

## Step 4: Ubuntu Server Setup (192.168.1.2)

### 4.1 Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2, Nginx, Git
sudo npm install -g pm2
sudo apt install -y nginx git
```

### 4.2 Clone SubSync Repository
```bash
# Create directory
sudo mkdir -p /var/www/subsync
sudo chown $USER:$USER /var/www/subsync

# Clone repository
cd /var/www
git clone https://github.com/mrsathishe/subsync.git
cd subsync
```

### 4.3 Setup Backend
```bash
cd backend
npm install --production

# Setup environment (copy your production config)
cp .env.prod .env
# Edit .env with your database details

# Start with PM2
pm2 start server.js --name subsync-backend
pm2 save
pm2 startup
```

### 4.4 Setup Frontend
```bash
cd ../frontend
npm install --production
npm run build

# Create web directory
sudo mkdir -p /var/www/html/subsync
sudo cp -r dist/* /var/www/html/subsync/
sudo chown -R www-data:www-data /var/www/html/subsync
```

## Step 5: Nginx Configuration for satz.co.in/subsync

### 5.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/satz.co.in
```

### 5.2 Nginx Configuration Content
```nginx
server {
    listen 80;
    server_name satz.co.in www.satz.co.in;
    
    # Main website root (if you have other content)
    location / {
        root /var/www/html;
        index index.html index.htm;
        try_files $uri $uri/ =404;
    }
    
    # SubSync Frontend at /subsync
    location /subsync {
        alias /var/www/html/subsync;
        index index.html;
        try_files $uri $uri/ /subsync/index.html;
        
        # Handle React Router for SPA
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # SubSync Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

### 5.3 Enable Site
```bash
# Enable the site
sudo ln -sf /etc/nginx/sites-available/satz.co.in /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: SSL Certificate (Free with Let's Encrypt)

### 6.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
```

### 6.2 Get SSL Certificate
```bash
sudo certbot --nginx -d satz.co.in -d www.satz.co.in
```

### 6.3 Auto-renewal
```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
```

## Step 7: Test Your Setup

### 7.1 Test DNS Resolution
```bash
# Check if domain resolves to your IP
nslookup satz.co.in
dig satz.co.in
```

### 7.2 Test Website Access
- **HTTP**: http://satz.co.in/subsync
- **HTTPS**: https://satz.co.in/subsync (after SSL setup)
- **API**: https://satz.co.in/api/health

## Step 8: Update Frontend Configuration

Update your frontend to use the correct base path:

### 8.1 Update Vite Config
```javascript
// frontend/vite.config.js
export default defineConfig({
  base: '/subsync/',  // Add this line
  // ... rest of config
})
```

### 8.2 Rebuild Frontend
```bash
cd frontend
npm run build
sudo cp -r dist/* /var/www/html/subsync/
```

## Troubleshooting

### Common Issues:
1. **Can't access from internet**: Check port forwarding rules
2. **DNS not resolving**: Wait up to 24 hours for DNS propagation
3. **502 Bad Gateway**: Check if PM2 backend is running (`pm2 list`)
4. **404 on /subsync**: Check nginx configuration and file permissions

### Useful Commands:
```bash
# Check services
sudo systemctl status nginx
pm2 list
pm2 logs subsync-backend

# Check ports
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000

# Check your public IP
curl ifconfig.me
```

## Final URL Structure
- **Main Site**: satz.co.in
- **SubSync App**: satz.co.in/subsync  
- **API Endpoints**: satz.co.in/api/*
- **Health Check**: satz.co.in/health