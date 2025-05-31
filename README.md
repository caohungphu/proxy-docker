# Proxy Docker

This project contains Docker configurations for running various proxy services, including 3x-ui (X-UI), MTProto/SOCKS5 proxies, and OpenVPN.

## Project Structure

```
.
├── 3x-ui/              # X-UI panel configuration
│   ├── docker-compose.yaml
│   ├── db/            # Database storage
│   └── cert/          # SSL/TLS certificates
├── mtproto-socks5/     # MTProto and SOCKS5 proxy configuration
│   ├── docker-compose.yaml
│   ├── mtproto.env
│   └── socks5.env
└── openvpn/           # OpenVPN configuration
    ├── docker-compose.yaml
    └── openvpn-data/  # OpenVPN data
```

## Telegram Proxy Setup

For detailed instructions on setting up Telegram proxies (MTProto and SOCKS5) with either direct server access or Cloudflare WARP for blocked regions, please refer to [TelegramProxy.md](TelegramProxy.md).

## Install Docker

```bash
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
```

## Components

### 1. [X-UI (3x-ui)](./3x-ui/README.md)

### 2. [MTProto + SOCKS5](./mtproto-socks5/README.md)

### 3. [OpenVPN](./openvpn/README.md)

## Prerequisites

- Docker
- Docker Compose

## Key features:

- 3x-ui on port `2053`
- MTProto proxy on port `51443`
- SOCKS5 proxy on port `51080`
- OpenVPN on port `51194`
- Optional Cloudflare WARP integration (SOCKS5 proxy blocked regions)
