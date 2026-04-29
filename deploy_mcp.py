import pexpect
import sys

password = "l5D1bpOpH3"
host = "root@103.97.126.54"
port = "22"

print("Connecting to VPS to deploy MCP Server...")
child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p {port} {host}', encoding='utf-8', timeout=180)
child.logfile = sys.stdout

index = child.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child.sendline(password)
    child.expect([r'#', r'\$'])
else:
    print("Failed to connect")
    sys.exit(1)

def run_cmd(cmd, timeout=60):
    child.sendline(cmd)
    child.expect([r'root@.*#', r'\$'], timeout=timeout)

run_cmd('cd /opt/my-website')
run_cmd('rm -f package-lock.json')
run_cmd('git pull', timeout=120)
run_cmd('npm install', timeout=120)

run_cmd('cp mcp/README.md /tmp/')

# Create systemd service
service_config = """[Unit]
Description=MCP Server for AI Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/my-website
ExecStart=/usr/bin/node mcp/mcp_server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
"""

run_cmd('cat << "EOF" > /etc/systemd/system/mcp-server.service\n' + service_config + 'EOF')
run_cmd('systemctl daemon-reload')
run_cmd('systemctl enable mcp-server')
run_cmd('systemctl restart mcp-server')
run_cmd('sleep 2')
run_cmd('systemctl status mcp-server --no-pager')
run_cmd('curl -I http://127.0.0.1:3001/mcp')

print("MCP Server deployed.")
child.sendline('exit')
child.expect(pexpect.EOF)
