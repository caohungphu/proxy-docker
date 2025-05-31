# Telegram Proxy Setup Guide

This guide explains how to set up Telegram proxies using either direct server access or Cloudflare WARP for blocked regions.

## Prerequisites

- Docker and Docker Compose installed
- Server with public IP
- Basic knowledge of networking and firewall configuration

## 1. Direct Server Setup (Non-Blocked IP)

### Initial Setup

1. Navigate to the mtproto-socks5 directory:

   ```bash
   cd mtproto-socks5
   ```

2. Configure firewall:

   ```bash
   sudo ufw allow 51443 # MTProto port
   sudo ufw allow 51080 # SOCKS5 port
   ```

3. Start the services:

   ```bash
   docker compose up -d
   ```

4. Monitor MTProto logs:
   ```bash
   docker logs -f mtproto
   ```

### Connection Information

#### MTProto Proxy

Use one of these formats to connect:

- `tg://proxy?server=<your_ip>&port=443&secret=<secret>`
- `https://t.me/proxy?server=<your_ip>&port=443&secret=<secret>`

Note: Replace `443` with your actual port (51443)

#### SOCKS5 Proxy

Use one of these formats to connect:

- `socks5h://<your_proxy_user>:<your_proxy_pass>@<your_ip>:<your_port>`
- `https://t.me/socks?server=<your_ip>&port=<your_port>&user=<your_proxy_user>&pass=<your_proxy_pass>`

## 2. Blocked Region Setup (Using Cloudflare WARP)

### Initial Setup

1. Navigate to the 3x-ui directory:

   ```bash
   cd 3x-ui
   ```

2. Configure firewall:

   ```bash
   sudo ufw allow 2053  # Dashboard port
   sudo ufw allow <your_port>  # SOCKS5 port
   ```

3. Start the service:

   ```bash
   docker compose up -d
   ```

4. Access the web panel at `http://your-server-ip:2053`
   - Default credentials: admin/admin

### Configuration Steps

1. Set up inbound rules in the X-UI panel
2. Configure outbound rules with WARP
3. Test the WARP connection:
   ```bash
   curl -x "socks5h://<your_proxy_user>:<your_proxy_pass>@<your_ip>:<your_port>" \
        -fsSL "https://www.cloudflare.com/cdn-cgi/trace" | grep warp
   ```
   Expected output: `warp=on`

### Connection Information

#### SOCKS5 Proxy

Use one of these formats to connect:

- `socks5h://<your_proxy_user>:<your_proxy_pass>@<your_ip>:<your_port>`
- `https://t.me/socks?server=<your_ip>&port=<your_port>&user=<your_proxy_user>&pass=<your_proxy_pass>`

## Troubleshooting

1. Check service status:

   ```bash
   docker compose ps
   ```

2. View service logs:

   ```bash
   docker compose logs -f
   ```

3. Common issues:
   - If connection fails, verify firewall rules
   - Check if ports are not used by other services
   - Ensure environment variables are correctly set

## Security Recommendations

1. Use strong passwords for SOCKS5 proxy
2. Regularly update Docker images
3. Monitor service logs for suspicious activities
4. Consider using a reverse proxy with SSL/TLS
5. Keep your server's system and Docker updated
