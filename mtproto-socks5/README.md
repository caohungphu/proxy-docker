# MTProto and SOCKS5 Proxy Setup

This directory contains Docker configurations for running Telegram MTProto and SOCKS5 proxies.

## Prerequisites

- Docker
- Docker Compose

## Configuration Files

- `docker-compose.yaml`: Main configuration file
- `mtproto.env`: Environment variables for MTProto proxy
- `socks5.env`: Environment variables for SOCKS5 proxy

## Setup Instructions

1. Configure environment variables:

   - Edit `mtproto.env` to set your MTProto proxy settings
   - Edit `socks5.env` to set your SOCKS5 proxy settings

2. Start the services:

```bash
docker compose up -d
```

## Ports

- MTProto Proxy: 51443
- SOCKS5 Proxy: 51080

## Features

### MTProto Proxy

- Official Telegram MTProto proxy implementation
- Environment-based configuration
- Automatic restart on failure

### SOCKS5 Proxy

- Lightweight SOCKS5 proxy server
- Simple configuration via environment variables
- Based on serjs/go-socks5-proxy

## Security Notes

- Keep your environment files secure
- Regularly update the Docker images
- Consider using a firewall to restrict access to the proxy ports

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

## Troubleshooting

If you encounter any issues:

1. Check the container logs: `docker compose logs`
2. Ensure ports 51443 and 51080 are not blocked by your firewall
3. Verify that environment variables are correctly set
