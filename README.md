# Proxy Docker

This project contains Docker configurations for running various proxy services, including 3x-ui (X-UI) and MTProto/SOCKS5 proxies.

## Project Structure

```
.
├── 3x-ui/              # X-UI panel configuration
│   └── docker-compose.yaml
└── mtproto-socks5/     # MTProto and SOCKS5 proxy configuration
    ├── docker-compose.yaml
    ├── mtproto.env
    └── socks5.env
```

## Telegram Proxy Setup

For detailed instructions on setting up Telegram proxies (MTProto and SOCKS5) with either direct server access or Cloudflare WARP for blocked regions, please refer to [TelegramProxy.md](README/TelegramProxy.mdTelegramProxy.md).

Key features:

- MTProto proxy on port 51443
- SOCKS5 proxy on port 51080
- Optional Cloudflare WARP integration (SOCKS5 proxy blocked regions)

## Install docker

```
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
```

## Components

### 1. X-UI (3x-ui)

A web-based panel for managing Xray-core, supporting multiple protocols including VMess, VLess, Trojan, and Shadowsocks.

**Features:**

- Web-based management interface
- Multiple protocol support
- Fail2ban protection enabled
- Persistent storage for database and certificates

### 2. MTProto Proxy

Official Telegram MTProto proxy implementation.

**Features:**

- Runs on port 51443
- Uses official Telegram proxy image
- Environment-based configuration

### 3. SOCKS5 Proxy

A lightweight SOCKS5 proxy server.

**Features:**

- Runs on port 51080
- Simple configuration via environment variables
- Based on serjs/go-socks5-proxy

## Setup Instructions

### Prerequisites

- Docker
- Docker Compose

### X-UI Setup

1. Navigate to the 3x-ui directory:
   ```bash
   cd 3x-ui
   ```
2. Create required directories:
   ```bash
   mkdir -p db cert
   ```
3. Start the service:
   ```bash
   docker compose up -d
   ```
4. Access the web panel at `http://your-server-ip:2053`

### MTProto and SOCKS5 Setup

1. Navigate to the mtproto-socks5 directory:
   ```bash
   cd mtproto-socks5
   ```
2. Configure environment variables in `mtproto.env` and `socks5.env`
3. Start the services:
   ```bash
   docker compose up -d
   ```

## Ports

- X-UI Panel: (default port: 2053; default user: admin/admin)
- MTProto Proxy: 51443
- SOCKS5 Proxy: 51080

## Security Notes

- Make sure to change default credentials
- Keep your certificates and environment files secure
- Regularly update the Docker images
- Consider using a reverse proxy with SSL/TLS for the X-UI panel

## Maintenance

- To update containers:
  ```bash
  docker compose pull
  docker compose up -d
  ```
- To view logs:
  ```bash
  docker compose logs -f
  ```
