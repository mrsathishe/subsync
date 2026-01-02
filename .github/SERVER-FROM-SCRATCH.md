# SubSync - Complete Server Setup from Scratch

Since you don't have any code on your server yet, here's everything you need to get SubSync running on your Ubuntu server (192.168.1.2).

## Quick Setup (Automated)

### Step 1: Download and Run Setup Script

On your Ubuntu server (192.168.1.2), run:

```bash
# Download the setup script
curl -o complete-setup.sh https://raw.githubusercontent.com/mrsathishe/subsync/main/.github/scripts/complete-server-setup.sh

# Make it executable
chmod +x complete-setup.sh

# Run the setup
./complete-setup.sh
```

This script will automatically:
- ✅ Install Node.js 18
- ✅ Install PM2 process manager
- ✅ Install Git
- ✅ Clone your SubSync repository
- ✅ Install all dependencies
- ✅ Build the frontend
- ✅ Start both services with PM2
- ✅ Configure firewall
- ✅ Setup auto-start on boot

## Manual Setup (Step by Step)

If you prefer to do it manually:

### Step 1: SSH into Your Ubuntu Server
```bash
ssh your-username@192.168.1.2
```

### Step 2: Install Required Software
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Git
sudo npm install -g pm2
sudo apt install -y git
```

### Step 3: Clone SubSync Repository
```bash
# Create directory
mkdir -p /home/$USER/subsync
cd /home/$USER/subsync

# Clone the repository
git clone https://github.com/mrsathishe/subsync.git .
```

### Step 4: Setup Backend (Port 3000)
```bash
cd backend

# Install dependencies
npm install --production

# Create environment file
nano .env
```

Add this content to `.env`:
```bash
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
```

```bash
# Start backend with PM2
pm2 start server.js --name subsync-backend --env production
```

### Step 5: Setup Frontend (Port 3001)
```bash
cd ../frontend

# Install dependencies
npm install --production

# Build for production
npm run build

# Serve with PM2 on port 3001
pm2 serve dist 3001 --name subsync-frontend --spa
```

### Step 6: Configure PM2 Auto-start
```bash
# Save PM2 configuration
pm2 save

# Setup auto-start on boot
pm2 startup systemd -u $USER --hp /home/$USER
# Copy and run the command it shows
```

### Step 7: Configure Firewall
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 3000  # Backend
sudo ufw allow 3001  # Frontend Production  
sudo ufw allow 5173  # Frontend Development
```

## Router Port Forwarding Setup

Configure your router to forward these ports to 192.168.1.2:

| External Port | Internal IP | Internal Port | Purpose |
|---------------|-------------|---------------|---------|
| 3000 | 192.168.1.2 | 3000 | Backend API |
| 3001 | 192.168.1.2 | 3001 | Frontend (Production) |
| 5173 | 192.168.1.2 | 5173 | Frontend (Development) |

### Router Access:
1. Open browser to your router IP (usually `192.168.1.1`)
2. Login with admin credentials
3. Find **Port Forwarding** or **Virtual Servers**
4. Add the rules above
5. Save and restart router

## Testing Your Setup

### Local Testing (on server):
```bash
# Test backend
curl http://localhost:3000/health

# Test frontend
curl http://localhost:3001

# Check PM2 status
pm2 list
pm2 logs
```

### External Testing (from internet):
- **Backend**: http://satz.co.in:3000/health
- **Frontend**: http://satz.co.in:3001
- **Development**: http://satz.co.in:5173 (when running dev mode)

## Development Mode

For development with hot reload:

```bash
# Terminal 1: Backend
cd /home/$USER/subsync/backend
npm run dev

# Terminal 2: Frontend  
cd /home/$USER/subsync/frontend
npm run dev
```

Then access: http://satz.co.in:5173

## Useful Commands

```bash
# PM2 Management
pm2 list                    # Show all processes
pm2 logs subsync-backend    # Backend logs
pm2 logs subsync-frontend   # Frontend logs
pm2 restart all             # Restart all services
pm2 stop all               # Stop all services
pm2 delete all             # Delete all processes

# Update SubSync
cd /home/$USER/subsync
git pull origin main        # Pull latest changes
# Then restart services with pm2 restart all

# Check ports
netstat -tlnp | grep :3000  # Check backend port
netstat -tlnp | grep :3001  # Check frontend port
```

## Database Setup

Don't forget to setup your PostgreSQL database with the connection details in your `.env` file!

## Final URLs

After setup and router configuration:
- **Your existing site**: https://satz.co.in (unchanged)
- **SubSync Frontend**: http://satz.co.in:3001
- **SubSync API**: http://satz.co.in:3000/api
- **Development**: http://satz.co.in:5173 (when in dev mode)

🎉 **Your SubSync will be live at http://satz.co.in:3001**