# OpenVPN Docker Setup

This directory contains the Docker configuration for running an OpenVPN server.

## Prerequisites

- Docker
- Docker Compose

## Setup Instructions

1. Initialize OpenVPN configuration:

```bash
docker compose run --rm openvpn ovpn_genconfig -u udp://<your_vpn_domain_name>
docker compose run --rm openvpn ovpn_initpki
```

2. Start the OpenVPN server:

```bash
docker compose up -d
```

3. Generate client certificates:

```bash
docker compose run --rm openvpn easyrsa build-client-full <client-name> nopass
docker compose run --rm openvpn ovpn_getclient <client-name> > <client-name>.ovpn
```

## Configuration

- The OpenVPN server runs on port 51194/UDP
- Configuration files are stored in the `openvpn-data` directory
- The server will automatically restart unless explicitly stopped

## Security Notes

- Keep your client certificates secure
- Regularly update the OpenVPN image for security patches
- Consider using a firewall to restrict access to the OpenVPN port

## Troubleshooting

If you encounter any issues:

1. Check the container logs: `docker compose logs openvpn`
2. Ensure port 51194/UDP is not blocked by your firewall
3. Verify that the `openvpn-data` directory has the correct permissions
