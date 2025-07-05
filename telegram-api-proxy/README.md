# Telegram Bot API Proxy

A lightweight HTTP proxy server that acts as a transparent intermediary for the Telegram Bot API. This proxy allows you to bypass network restrictions and create middleware for your Telegram bot applications.

## Features

- **Transparent Proxying**: Forwards all requests to Telegram's official API servers
- **Full API Support**: Supports all Telegram Bot API methods and endpoints
- **CORS Support**: Built-in CORS headers for browser-based applications
- **Docker Ready**: Containerized deployment with Docker and Docker Compose
- **Lightweight**: Minimal Node.js server with no external dependencies
- **Security**: Does not store or modify bot tokens - all requests are forwarded directly

## Quick Start

### Using Docker Compose (Recommended)

1. Clone or download this repository
2. Navigate to the project directory
3. Run the proxy:

```bash
docker-compose up -d
```

The proxy will be available at `http://localhost:8080`

### Manual Setup

1. Ensure you have Node.js 18+ installed
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node proxy.js
```

## Usage

Replace `api.telegram.org` with your proxy server URL in your API calls.

### Example

**Original Telegram API URL:**

```
https://api.telegram.org/bot{YOUR_BOT_TOKEN}/sendMessage
```

**Using this proxy:**

```
http://localhost:8080/bot{YOUR_BOT_TOKEN}/sendMessage
```

### JavaScript Example

```javascript
fetch("http://localhost:8080/bot{YOUR_BOT_TOKEN}/sendMessage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    chat_id: "123456789",
    text: "Hello from Telegram Bot API Proxy!",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## API Endpoints

- `GET /` - Documentation page
- `GET/POST /bot{token}/*` - All Telegram Bot API endpoints
- `GET/POST /file/bot{token}/*` - Telegram file download endpoints

## Configuration

### Environment Variables

- `NODE_ENV` - Set to `production` for production deployment (default: development)
- `PORT` - Server port (default: 8080)

### Docker Configuration

The proxy runs on port 8080 by default. You can modify the port mapping in `docker-compose.yaml`:

```yaml
ports:
  - "YOUR_PORT:8080"
```

## Security Notes

- This proxy does not store, cache, or modify your bot tokens
- All requests are forwarded directly to Telegram's API servers
- CORS is enabled for all origins (`*`) - consider restricting this in production
- No authentication is required to use the proxy

## Development

### Project Structure

```
telegram-api-proxy/
├── proxy.js           # Main proxy server implementation
├── Dockerfile         # Docker container configuration
├── docker-compose.yaml # Docker Compose configuration
└── README.md          # This file
```

### Building from Source

```bash
# Build Docker image
docker build -t telegram-api-proxy .

# Run container
docker run -p 8080:8080 telegram-api-proxy
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port mapping in docker-compose.yaml
2. **CORS errors**: Ensure your client is making requests to the correct proxy URL
3. **Network connectivity**: Verify the proxy can reach `api.telegram.org`

### Logs

View container logs:

```bash
docker-compose logs telegram-api-proxy
```

## License

This project is based on the original work from [cf-worker-telegram](https://github.com/tuanpb99/cf-worker-telegram).
