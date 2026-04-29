import pexpect

def run():
    p = pexpect.spawn('ssh -o StrictHostKeyChecking=no -p 22 root@103.97.126.54', encoding='utf-8')
    p.expect('assword:')
    p.sendline('l5D1bpOpH3')
    p.expect('#')
    
    p.sendline('cd /opt/my-website && git checkout mcp/mcp_server.js && git pull')
    p.expect('#', timeout=30)
    print(p.before)
    
    # Remove app.use(express.json()) completely
    p.sendline("sed -i '/app.use(express.json());/d' /opt/my-website/mcp/mcp_server.js")
    p.expect('#')
    
    p.sendline('systemctl restart mcp-server')
    p.expect('#')
    
    p.sendline('exit')

if __name__ == '__main__':
    run()
