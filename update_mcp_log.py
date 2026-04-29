import pexpect
import sys

def run():
    p = pexpect.spawn('ssh -o StrictHostKeyChecking=no -p 22 root@103.97.126.54', encoding='utf-8')
    p.expect('assword:')
    p.sendline('l5D1bpOpH3')
    p.expect('#')
    
    # We will patch mcp_server.js to add heavy logging and fix the body parsing
    p.sendline("""cat << 'PATCH_EOF' > patch.js
const fs = require('fs');
let code = fs.readFileSync('/opt/my-website/mcp/mcp_server.js', 'utf8');

// replace express.json() with a more robust parser
code = code.replace('app.use(express.json());', `
app.use((req, res, next) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    if (data) {
      try { req.body = JSON.parse(data); }
      catch(e) { req.body = data; }
    }
    console.log('[' + new Date().toISOString() + '] ' + req.method + ' ' + req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
});
`);

fs.writeFileSync('/opt/my-website/mcp/mcp_server.js', code);
PATCH_EOF
node patch.js
""")
    p.expect('#')
    
    p.sendline('systemctl restart mcp-server')
    p.expect('#')
    
    print("Restarted with logging")
    p.sendline('exit')

if __name__ == '__main__':
    run()
