#!/bin/bash

# SubSync Development Environment Setup
# This script manages SSH tunnel and starts the development server

SSH_USER="sathish"
SSH_HOST="192.168.1.2"
LOCAL_PORT="5432"
REMOTE_PORT="5432"
ENV_FILE="backend/.env.dev"

echo "🚀 Starting SubSync Development Environment..."

# Function to check if SSH tunnel is running
check_tunnel() {
    if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "✅ SSH tunnel already active on port $LOCAL_PORT"
        return 0
    else
        return 1
    fi
}

# Function to start SSH tunnel
start_tunnel() {
    echo "🔗 Starting SSH tunnel to $SSH_USER@$SSH_HOST..."
    ssh -f -N -L $LOCAL_PORT:localhost:$REMOTE_PORT $SSH_USER@$SSH_HOST
    
    # Wait a moment and check if tunnel is established
    sleep 2
    if check_tunnel; then
        echo "✅ SSH tunnel established successfully"
        return 0
    else
        echo "❌ Failed to establish SSH tunnel"
        return 1
    fi
}

# Function to stop SSH tunnel
stop_tunnel() {
    echo "🛑 Stopping SSH tunnel..."
    # Find and kill SSH tunnel processes
    SSH_PID=$(lsof -ti:$LOCAL_PORT -sTCP:LISTEN)
    if [ ! -z "$SSH_PID" ]; then
        kill $SSH_PID
        echo "✅ SSH tunnel stopped"
    else
        echo "ℹ️  No SSH tunnel found running"
    fi
}

# Function to test database connection
test_connection() {
    echo "🔍 Testing database connection..."
    cd backend && node -e "
        require('dotenv').config({ path: '.env.dev' });
        const { Pool } = require('pg');
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        pool.query('SELECT NOW() as time, current_database() as db')
            .then(result => {
                console.log('✅ Database connected:', result.rows[0].db);
                console.log('⏰ Server time:', result.rows[0].time);
                pool.end();
            })
            .catch(err => {
                console.error('❌ Database connection failed:', err.message);
                pool.end();
                process.exit(1);
            });
    "
    cd ..
}

# Main script logic
case "$1" in
    "start")
        if ! check_tunnel; then
            start_tunnel
        fi
        test_connection
        echo "🎯 Starting Node.js development server..."
        cd backend && ENV_FILE=.env.dev npm run dev
        ;;
    "stop")
        stop_tunnel
        ;;
    "restart")
        stop_tunnel
        sleep 1
        start_tunnel
        test_connection
        ;;
    "test")
        test_connection
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|test}"
        echo ""
        echo "Commands:"
        echo "  start   - Start SSH tunnel and development server"
        echo "  stop    - Stop SSH tunnel"
        echo "  restart - Restart SSH tunnel" 
        echo "  test    - Test database connection"
        echo ""
        echo "Example:"
        echo "  ./dev-env.sh start"
        exit 1
        ;;
esac