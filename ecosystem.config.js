module.exports = {
  apps: [{
    name: 'subsync',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 3000,
    wait_ready: true,
    autorestart: true,
    watch: false,
    ignore_watch: [
      'node_modules',
      'logs',
      'frontend/dist'
    ],
    source_map_support: false,
    instance_var: 'INSTANCE_ID',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};