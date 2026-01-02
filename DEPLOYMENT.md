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