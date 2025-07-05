const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

// Telegram Bot API base URL
const TELEGRAM_API_BASE = 'https://api.telegram.org';

// HTML template for documentation
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
        <div class="code">https://{YOUR_SERVER_URL}/bot{YOUR_BOT_TOKEN}/sendMessage</div>
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
fetch('https://{YOUR_SERVER_URL}/bot{YOUR_BOT_TOKEN}/sendMessage', {
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

// Enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    const reqAllowHeaders = req.get('Access-Control-Request-Headers');
    const allowHeaders = reqAllowHeaders ? reqAllowHeaders : 'Content-Type';
    res.setHeader('Access-Control-Allow-Headers', allowHeaders);
    res.setHeader('Access-Control-Max-Age', '86400');
    next();
});

// Handle OPTIONS requests for CORS
app.options('*', (req, res) => {
    res.status(204).send();
});

// Handle all other requests
app.all('*', async (req, res) => {
    // Serve documentation page for root path
    if (req.path === '/' || req.path === '') {
        return res.set('Content-Type', 'text/html; charset=UTF-8')
            .set('Cache-Control', 'public, max-age=3600')
            .send(DOC_HTML);
    }

    // Extract path segments to validate the request format
    const pathParts = req.path.split('/').filter(Boolean);
    if (pathParts.length < 2) {
        return res.status(400).send('Invalid request format');
    }
    if (pathParts[0] === 'file') {
        if (pathParts.length < 3 || !pathParts[1].startsWith('bot')) {
            return res.status(400).send('Invalid file request format');
        }
    } else if (!pathParts[0].startsWith('bot')) {
        return res.status(400).send('Invalid bot request format');
    }

    // Reconstruct the Telegram API URL
    const telegramUrl = `${TELEGRAM_API_BASE}${req.path}${req.url.includes('?') ? req.url.split('?')[1] : ''}`;

    // Prepare headers
    const headers = {};
    for (const [key, value] of Object.entries(req.headers)) {
        headers[key] = value;
    }

    // Ensure JSON requests use UTF-8
    if (headers['content-type'] && headers['content-type'].startsWith('application/json') && !headers['content-type'].includes('charset')) {
        headers['content-type'] = 'application/json; charset=UTF-8';
    }

    // Prepare fetch options
    const init = {
        method: req.method,
        headers,
        redirect: 'follow'
    };

    // Include body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = req.body;
    }

    try {
        const tgRes = await fetch(telegramUrl, init);

        // Copy response headers
        for (const [key, value] of tgRes.headers.entries()) {
            res.set(key, value);
        }

        // Stream response body
        res.status(tgRes.status);
        tgRes.body.pipe(res);
    } catch (err) {
        res.status(500).send(`Error proxying request: ${err.message}`);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});