import pexpect
import sys

def run():
    print("Connecting to VPS...")
    p = pexpect.spawn('ssh -o StrictHostKeyChecking=no -p 22 root@103.97.126.54', encoding='utf-8')
    p.expect('assword:')
    p.sendline('l5D1bpOpH3')
    p.expect('#')
    
    print("Pulling code...")
    p.sendline('cd /opt/my-website && git pull')
    p.expect('#', timeout=30)
    print(p.before)
    
    print("Updating mcp-server.service...")
    service_content = """[Unit]
Description=MCP Server for AI Agent
After=network.target

[Service]
EnvironmentFile=/opt/my-website/.env
Type=simple
User=root
WorkingDirectory=/opt/my-website
ExecStart=/usr/bin/node mcp/mcp_server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
"""
    p.sendline("cat << 'INNER_EOF' > /etc/systemd/system/mcp-server.service\n" + service_content + "INNER_EOF")
    p.expect('#')
    
    print("Restarting mcp-server...")
    p.sendline('systemctl daemon-reload && systemctl restart mcp-server')
    p.expect('#')
    
    print("Checking status...")
    p.sendline('systemctl status mcp-server --no-pager | head -n 10')
    p.expect('#')
    print(p.before)
    
    p.sendline('exit')
    print("Done!")

if __name__ == '__main__':
    run()
