# GitHub Actions Secrets Configuration

This document outlines all the GitHub Secrets needed for the CI/CD pipeline.

## Required Secrets

### Server Configuration
```bash
# Server access details
SERVER_HOST=192.168.1.100        # Your production server IP
SERVER_USER=deploy               # SSH username (recommend creating 'deploy' user)
SERVER_SSH_KEY=-----BEGIN...     # SSH private key content
SERVER_PORT=22                   # SSH port (optional, defaults to 22)
APP_DIR=/var/www/subsync        # Application directory path
```

### Optional Secrets
```bash
# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...  # For deployment notifications
```

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each secret with the exact name and value

## SSH Key Setup

### Option 1: Generate New Key for GitHub Actions
```bash
# Generate dedicated key for deployment
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/subsync_deploy
```

### Option 2: Use Existing Key
```bash
# Display your existing private key
cat ~/.ssh/id_rsa
```

### Add Public Key to Server
```bash
# Copy public key to production server
ssh-copy-id -i ~/.ssh/subsync_deploy.pub deploy@your-server-ip

# Or manually add to authorized_keys
cat ~/.ssh/subsync_deploy.pub >> ~/.ssh/authorized_keys
```

## Server User Setup

Create a dedicated deployment user on your server:

```bash
# On production server
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh

# Add your public key
sudo nano /home/deploy/.ssh/authorized_keys
# Paste your public key here
sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys
```

## Testing SSH Connection

Test your SSH connection before adding to GitHub:

```bash
# Test SSH connection
ssh -i ~/.ssh/subsync_deploy deploy@your-server-ip

# Test with specific port if needed
ssh -i ~/.ssh/subsync_deploy -p 22 deploy@your-server-ip
```

## Environment Variables on Server

Ensure your production server has the correct environment files:

```bash
# On production server
cd /var/www/subsync/backend
cp .env.prod .env
# Edit .env with production values
```

## Troubleshooting

### Common SSH Issues
- Ensure private key has correct permissions: `chmod 600 ~/.ssh/subsync_deploy`
- Verify public key is in server's authorized_keys
- Check SSH service is running: `sudo systemctl status ssh`

### GitHub Actions Debugging
- Check Actions logs in GitHub repository
- Enable debug logging by adding secret: `ACTIONS_STEP_DEBUG=true`