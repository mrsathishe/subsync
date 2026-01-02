# Production Deployment Guide

## Environment Configurations

### Development Environment (Local with SSH Tunnel)
- **File:** `backend/.env.dev`
- **Database:** Connect via SSH tunnel to localhost:5432
- **Usage:** `npm run dev:local` or `./dev-env.sh start`

### Production Environment (Direct Connection)
- **File:** `backend/.env.prod` 
- **Database:** Direct connection to 192.168.1.2:5432
- **Usage:** `npm run start:prod`

### Default Environment (Supabase)
- **File:** `backend/.env`
- **Database:** Supabase PostgreSQL (original configuration)
- **Usage:** `npm run start` or `npm run dev`

## Production Deployment

### Prerequisites
1. Ensure PostgreSQL server at 192.168.1.2:5432 accepts external connections
2. Configure PostgreSQL `pg_hba.conf` to allow connections from production server
3. Ensure firewall allows connections on port 5432

### PostgreSQL Configuration for Production

On the database server (192.168.1.2), update these files:

**postgresql.conf:**
```
listen_addresses = '*'  # or specific IP addresses
port = 5432
```

**pg_hba.conf:**
```
# Allow connections from production server
host    subsync    sathish    <production-server-ip>/32    md5
# Or for all IPs (less secure)
host    all        all        0.0.0.0/0                   md5
```

### Start Production Server

```bash
# On production server
cd backend
npm run start:prod
```

### Environment Variables Summary

| Environment | SSH Tunnel | Database Host | Port | Command |
|-------------|------------|---------------|------|---------|
| Development | ✅ Yes     | localhost     | 5432 | `npm run dev:local` |
| Production  | ❌ No      | 192.168.1.2   | 5432 | `npm run start:prod` |
| Default     | ❌ No      | Supabase      | 5432 | `npm run start` |

### Security Notes

- Change JWT_SECRET in production
- Use strong database passwords
- Configure proper firewall rules
- Consider using SSL/TLS for database connections
- Restrict database access to specific IP ranges

## Automated Deployment with GitHub Actions

### Option 1: GitHub Actions → Ubuntu Server (Recommended)

#### Prerequisites on Server

1. **Install required software:**
```bash
sudo apt update
sudo apt install -y git nodejs npm nginx
sudo npm install -g pm2
```

2. **Clone repository (initial setup):**
```bash
cd /var/www
sudo git clone https://github.com/mrsathishe/subsync.git
sudo chown -R $USER:$USER /var/www/subsync
cd subsync
```

3. **Setup backend:**
```bash
cd backend
npm install --production
cp .env.prod .env  # Use production environment
pm2 start server.js --name subsync-backend --env production
pm2 save
pm2 startup
```

4. **Setup frontend:**
```bash
cd ../frontend
npm install --production
npm run build
sudo mkdir -p /var/www/html/subsync
sudo cp -r dist/* /var/www/html/subsync/
```

5. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/subsync
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /var/www/html/subsync;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
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
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/subsync /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### GitHub Secrets Configuration

In GitHub → Repository → Settings → Secrets and Variables → Actions, add:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SERVER_HOST` | `192.168.x.x` or public IP | Server IP address |
| `SERVER_USER` | `ubuntu` or your username | SSH username |
| `SERVER_SSH_KEY` | Private SSH key content | SSH private key |
| `SERVER_PORT` | `22` | SSH port (optional, defaults to 22) |
| `APP_DIR` | `/var/www/subsync` | Application directory |
| `SLACK_WEBHOOK_URL` | Slack webhook URL | Optional: for notifications |

#### SSH Key Setup

1. **Generate SSH key pair on your local machine:**
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions@subsync"
```

2. **Copy public key to server:**
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@your-server
```

3. **Add private key to GitHub Secrets:**
   - Copy the content of your private key file
   - Add it as `SERVER_SSH_KEY` secret in GitHub

#### Deployment Pipeline Features

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes:

**🧪 Continuous Integration:**
- Automated testing on pull requests
- Frontend build verification
- Backend dependency installation
- Code linting

**🚀 Continuous Deployment:**
- Triggers on push to `main` branch
- Automated server deployment via SSH
- PM2 process management
- Frontend build and nginx deployment
- Health checks after deployment

**📊 Monitoring:**
- Post-deployment health checks
- Slack notifications (optional)
- Deployment status reporting

#### Deployment Workflow

1. **Developer pushes to `main` branch**
2. **GitHub Actions triggers:**
   - Runs tests and builds
   - SSH into production server
   - Pulls latest code
   - Installs dependencies
   - Restarts backend with PM2
   - Builds and deploys frontend
   - Performs health checks

#### Manual Deployment Commands

If you need to deploy manually:

```bash
# On production server
cd /var/www/subsync

# Pull latest changes
git pull origin main

# Backend deployment
cd backend
npm install --production
pm2 restart subsync-backend

# Frontend deployment
cd ../frontend
npm install --production
npm run build
sudo cp -r dist/* /var/www/html/subsync/
sudo systemctl reload nginx
```

#### Monitoring and Logs

```bash
# Check PM2 processes
pm2 list
pm2 logs subsync-backend

# Check nginx status
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log

# Check application logs
cd /var/www/subsync/backend
tail -f logs/app.log  # if you have logging configured
```

#### Rollback Strategy

```bash
# Rollback to previous commit
cd /var/www/subsync
git reset --hard HEAD~1
npm install --production
pm2 restart subsync-backend

# Or rollback to specific commit
git reset --hard <commit-hash>
```