# Add SubSync to Existing satz.co.in Website

## ⚠️ Important: Preserving Your Existing Website

Your existing website at https://satz.co.in will remain completely untouched. SubSync will be added as a subdirectory at https://satz.co.in/subsync.

## Option 1: Manual Nginx Configuration (Recommended)

### Step 1: Add Only SubSync Routes to Your Existing Nginx Config

Find your existing nginx config file for satz.co.in:
```bash
sudo nano /etc/nginx/sites-available/satz.co.in
```

**ADD THESE BLOCKS** to your existing server configuration (don't replace anything):

```nginx
# Add to your existing HTTP server block (port 80)
server {
    # Your existing configuration stays here...
    
    # ADD THESE LINES for SubSync:
    location /subsync {
        alias /var/www/html/subsync;
        index index.html;
        try_files $uri $uri/ /subsync/index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

```nginx
# Add to your existing HTTPS server block (port 443)
server {
    # Your existing HTTPS configuration stays here...
    
    # ADD THESE LINES for SubSync:
    location /subsync {
        alias /var/www/html/subsync;
        index index.html;
        try_files $uri $uri/ /subsync/index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
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
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

### Step 2: Test and Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Option 2: Separate Config File (Alternative)

If you prefer to keep SubSync configuration separate:

### Create separate config file:
```bash
sudo nano /etc/nginx/sites-available/subsync-addon
```

**Content:**
```nginx
# SubSync addon for existing satz.co.in
# This adds /subsync routes to your existing website

location /subsync {
    alias /var/www/html/subsync;
    index index.html;
    try_files $uri $uri/ /subsync/index.html;
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

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

location /health {
    proxy_pass http://localhost:3000/health;
    access_log off;
}
```

Then include it in your main config:
```nginx
# In your existing satz.co.in config file
server {
    # Your existing config...
    
    # Include SubSync routes
    include /etc/nginx/sites-available/subsync-addon;
}
```

## SubSync Backend Setup

```bash
# Clone and setup SubSync backend
cd /var/www
sudo git clone https://github.com/mrsathishe/subsync.git
sudo chown -R $USER:$USER /var/www/subsync

# Setup backend
cd subsync/backend
npm install --production
cp .env.prod .env  # Configure your database settings

# Start with PM2
pm2 start server.js --name subsync-backend
pm2 save
```

## SubSync Frontend Setup

```bash
# Build and deploy frontend
cd /var/www/subsync/frontend
npm install --production
npm run build

# Deploy to nginx
sudo mkdir -p /var/www/html/subsync
sudo cp -r dist/* /var/www/html/subsync/
sudo chown -R www-data:www-data /var/www/html/subsync
```

## Final Result

- **Your existing website**: https://satz.co.in (unchanged)
- **SubSync app**: https://satz.co.in/subsync (new addition)
- **SubSync API**: https://satz.co.in/api/* (new addition)

## GitHub Actions Update

The GitHub Actions will only deploy SubSync files without touching your existing website:

- Frontend → `/var/www/html/subsync/`
- Backend → PM2 process
- No changes to your main website files

## Testing

Test that both work:
```bash
# Your existing site (should work as before)
curl -I https://satz.co.in

# New SubSync app
curl -I https://satz.co.in/subsync

# SubSync API
curl https://satz.co.in/health
```