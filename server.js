import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = parsedUrl.pathname;

    // 1. Handle API Routes
    if (filePath.startsWith('/api/')) {
        try {
            const apiPath = path.join(process.cwd(), filePath + '.js');
            if (fs.existsSync(apiPath)) {
                const module = await import(apiPath);
                // Mock req/res for the handler
                const mockReq = { 
                    method: req.method, 
                    url: req.url, 
                    headers: req.headers,
                    query: Object.fromEntries(parsedUrl.searchParams),
                    body: await getBody(req)
                };
                const mockRes = {
                    status: (code) => ({
                        json: (data) => {
                            res.writeHead(code, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(data));
                        }
                    })
                };
                return module.default(mockReq, mockRes);
            }
        } catch (err) {
            console.error('API Error:', err);
            res.writeHead(500);
            return res.end(JSON.stringify({ error: err.message }));
        }
    }

    // 2. Handle Static Files
    if (filePath === '/') filePath = '/index.html';
    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
        const ext = path.extname(fullPath);
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.svg': 'image/svg+xml'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        return fs.createReadStream(fullPath).pipe(res);
    }

    res.writeHead(404);
    res.end('Not Found');
});

async function getBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
