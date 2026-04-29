import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.text({ type: '*/*' }));

app.post('/mcp/sse', (req, res) => {
    fs.appendFileSync('/tmp/mcp_debug.log', JSON.stringify({
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query
    }) + '\n');
    res.status(404).send("Not found");
});

app.listen(3002, () => console.log('Debugger listening on 3002'));
