# Direct Port Access Setup for SubSync

## Overview
- **Your existing site**: https://satz.co.in (stays unchanged)
- **SubSync Frontend**: http://satz.co.in:5173 (development) or http://satz.co.in:3001 (production)
- **SubSync Backend**: http://satz.co.in:3000/api

## Step 1: Router Port Forwarding

### Add these port forwarding rules to your router:

| Service | External Port | Internal IP | Internal Port | Protocol |
|---------|---------------|-------------|---------------|----------|
| SubSync Backend | 3000 | 192.168.1.2 | 3000 | TCP |
| SubSync Frontend Dev | 5173 | 192.168.1.2 | 5173 | TCP |
| SubSync Frontend Prod | 3001 | 192.168.1.2 | 3001 | TCP |

### Router Configuration Steps:
1. Access router admin (usually `192.168.1.1`)
2. Find **Port Forwarding** or **Virtual Servers**
3. Add the rules above
4. Save and restart router

## Step 2: Ubuntu Server Setup (192.168.1.2)

### 2.1 Install Requirements
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 2.2 Clone SubSync
```bash
# Create directory and clone
mkdir -p /home/$USER/subsync
cd /home/$USER/subsync
git clone https://github.com/mrsathishe/subsync.git .
```

### 2.3 Setup Backend (Port 3000)
```bash
cd backend
npm install

# Setup environment
cp .env.prod .env
# Edit .env with your database settings
nano .env

# Start backend with PM2
pm2 start server.js --name subsync-backend --env production
pm2 save
pm2 startup  # Enable auto-start on boot
```

### 2.4 Setup Frontend for Production (Port 3001)
```bash
cd ../frontend
npm install

# Build for production
npm run build

# Serve built files on port 3001 with PM2
pm2 serve dist 3001 --name subsync-frontend --spa
pm2 save
```

## Step 3: Update Vite Config for Direct Port Access

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  // Remove base path since we're using direct port access
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',  // Allow external connections
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    host: '0.0.0.0',  // Allow external connections
    port: 3001
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## Step 4: Firewall Configuration

```bash
# Allow the required ports
sudo ufw allow 3000  # Backend
sudo ufw allow 5173  # Frontend Dev
sudo ufw allow 3001  # Frontend Prod
sudo ufw enable
```

## Step 5: Start Services

### Development Mode:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Mode:
```bash
# Both services managed by PM2
pm2 list
pm2 logs subsync-backend
pm2 logs subsync-frontend
```

## Step 6: Test Access

### From Internet:
- **Backend Health**: http://satz.co.in:3000/health
- **Frontend Dev**: http://satz.co.in:5173
- **Frontend Prod**: http://satz.co.in:3001

### Local Testing:
```bash
# Test backend locally
curl http://localhost:3000/health
curl http://192.168.1.2:3000/health

# Test frontend locally  
curl http://localhost:5173
curl http://192.168.1.2:3001
```

## Step 7: Update Frontend API Configuration

No changes needed! Your existing API configuration will work since both frontend and backend are on the same domain (satz.co.in), just different ports.

## GitHub Actions for Direct Port Access

The deployment will:
1. Pull latest code to `/home/$USER/subsync`
2. Restart PM2 processes
3. No nginx configuration needed

## Advantages of Direct Port Access:
✅ **Simple setup** - No web server configuration  
✅ **No conflicts** - Your existing site stays untouched  
✅ **Easy debugging** - Direct access to services  
✅ **Development friendly** - Hot reload on port 5173  

## URLs Summary:
- **Your existing site**: https://satz.co.in
- **SubSync (Development)**: http://satz.co.in:5173  
- **SubSync (Production)**: http://satz.co.in:3001
- **SubSync API**: http://satz.co.in:3000/api/health

## Security Note:
Since you're exposing ports directly, consider:
- Using HTTPS with SSL certificates later
- Setting up basic authentication if needed
- Monitoring access logs

Would you like me to update the GitHub Actions workflow for this direct port approach?