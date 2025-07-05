// Telegram Bot API base URL
const TELEGRAM_API_BASE = 'https://api.telegram.org';
const http = require('http');

// HTML template for documentation (unchanged)
const DOC_HTML = `<!DOCTYPE html>
<html>
<head>
    <title>Telegram Bot API Proxy Documentation</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { color: #0088cc; }
        .code {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            overflow-x: auto;
        }
        .note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .example {
            background: #e7f5ff;
            border-left: 4px solid #0088cc;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Telegram Bot API Proxy</h1>
    <p>This service acts as a transparent proxy for the Telegram Bot API. It allows you to bypass network restrictions and create middleware for your Telegram bot applications.</p>

    <h2>How to Use</h2>
    <p>Replace <code>api.telegram.org</code> with this server's URL in your API calls.</p>

    <div class="example">
        <h3>Example Usage:</h3>
        <p>Original Telegram API URL:</p>
        <div class="code">https://api.telegram.org/bot{YOUR_BOT_TOKEN}/sendMessage</div>
        <p>Using this proxy:</p>
        <div class="code">http://{YOUR_SERVER_URL}:8080/bot{YOUR_BOT_TOKEN}/sendMessage</div>
    </div>

    <h2>Features</h2>
    <ul>
        <li>Supports all Telegram Bot API methods</li>
        <li>Handles both GET and POST requests</li>
        <li>Full CORS support for browser-based applications</li>
        <li>Transparent proxying of responses</li>
        <li>Maintains original status codes and headers</li>
    </ul>

    <div class="note">
        <strong>Note:</strong> This proxy does not store or modify your bot tokens. All requests are forwarded directly to Telegram's API servers.
    </div>

    <h2>Example Code</h2>
    <div class="code">
// JavaScript Example
fetch('http://{YOUR_SERVER_URL}:8080/bot{YOUR_BOT_TOKEN}/sendMessage', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        chat_id: "123456789",
        text: "Hello from Telegram Bot API Proxy!"
    })
})
.then(response => response.json())
.then(data => console.log(data));
    </div>
</body>
</html>`;

async function handleRequest(request, url) {
    if (url.pathname === '/' || url.pathname === '') {
        return {
            body: DOC_HTML,
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
                'Cache-Control': 'public, max-age=3600',
            },
            status: 200,
        };
    }

    // Extract path segments to validate the request format
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
        return { body: 'Invalid request format', status: 400 };
    }
    if (pathParts[0] === 'file') {
        if (pathParts.length < 3 || !pathParts[1].startsWith('bot')) {
            return { body: 'Invalid file request format', status: 400 };
        }
    } else if (!pathParts[0].startsWith('bot')) {
        return { body: 'Invalid bot request format', status: 400 };
    }

    // Reconstruct the Telegram API URL
    const telegramUrl = `${TELEGRAM_API_BASE}${url.pathname}${url.search}`;

    // Clone request headers
    const headers = {};
    for (const [key, value] of Object.entries(request.headers)) {
        headers[key] = value;
    }

    // Ensure JSON requests explicitly use UTF-8
    const contentType = headers['Content-Type'] || headers['content-type'];
    if (contentType && contentType.startsWith('application/json') && !contentType.includes('charset')) {
        headers['Content-Type'] = 'application/json; charset=UTF-8';
    }

    const init = {
        method: request.method,
        headers,
        redirect: 'follow',
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = await request.text();
    }

    // Forward the request to Telegram API
    try {
        const tgRes = await fetch(telegramUrl, init);
        const body = await tgRes.text();
        const resHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
            'Access-Control-Allow-Headers': request.headers['access-control-request-headers'] || 'Content-Type',
        };
        for (const [key, value] of tgRes.headers) {
            resHeaders[key] = value;
        }
        return {
            body,
            headers: resHeaders,
            status: tgRes.status,
        };
    } catch (err) {
        return { body: `Error proxying request: ${err.message}`, status: 500 };
    }
}

// Handle OPTIONS requests for CORS
function handleOptions(request) {
    const reqAllowHeaders = request.headers['access-control-request-headers'];
    const allowHeaders = reqAllowHeaders ? reqAllowHeaders : 'Content-Type';

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': allowHeaders,
        'Access-Control-Max-Age': '86400',
    };

    return {
        body: null,
        status: 204,
        headers: corsHeaders,
    };
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    let body = '';
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        req.on('data', chunk => {
            body += chunk;
        });
    }

    req.on('end', async () => {
        const request = {
            method: req.method,
            headers: req.headers,
            body,
        };

        let response;
        if (req.method === 'OPTIONS') {
            response = handleOptions(request);
        } else {
            response = await handleRequest(request, url);
        }

        res.writeCode = response.status || 200;
        for (const [key, value] of Object.entries(response.headers || {})) {
            res.setHeader(key, value);
        }
        if (response.body) {
            res.write(response.body);
        } else {
            res.end();
        }
    });
});

// Start server
server.listen(8080, () => {
    console.log('Server running on port 8080');
});