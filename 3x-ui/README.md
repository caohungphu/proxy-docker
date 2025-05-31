# 3X-UI Panel Setup

This directory contains the Docker configuration for running the X-UI panel, a web-based management interface for Xray-core.

## Prerequisites

- Docker
- Docker Compose

## Configuration Files

- `docker-compose.yaml`: Main configuration file
- `db/`: Directory for persistent database storage
- `cert/`: Directory for SSL/TLS certificates

## Setup Instructions

1. Create required directories:

```bash
mkdir -p db cert
```

2. Start the service:

```bash
docker compose up -d
```

3. Access the web panel:

- URL: `http://your-server-ip:2053`
- Default credentials:
  - Username: `admin`
  - Password: `admin`

## Features

- Web-based management interface
- Multiple protocol support:
  - VMess
  - VLess
  - Trojan
  - Shadowsocks
- Fail2ban protection
- Persistent storage for database and certificates

## Security Notes

- Change the default admin credentials immediately after first login
- Keep your certificates secure
- Consider using a reverse proxy with SSL/TLS
- Regularly update the Docker image

## Maintenance

- To update the container:

```bash
docker compose pull
docker compose up -d
```

- To view logs:

```bash
docker compose logs -f
```

## Troubleshooting

If you encounter any issues:

1. Check the container logs: `docker compose logs`
2. Ensure port 2053 is not blocked by your firewall
3. Verify that the `db` and `cert` directories have correct permissions
4. Check if the database is properly initialized
