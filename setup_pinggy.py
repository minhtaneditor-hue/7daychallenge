import pexpect
import sys
import time

password = "l5D1bpOpH3"
host = "root@103.97.126.54"
port = "22"

child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p {port} {host}', encoding='utf-8', timeout=120)
child.logfile = sys.stdout

index = child.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child.sendline(password)
    child.expect([r'#', r'\$'])
else:
    sys.exit(1)

def run_cmd(cmd):
    child.sendline(cmd)
    child.expect([r'root@.*#', r'\$'])

# Setup a systemd service for pinggy tunnel
service_content = """[Unit]
Description=Pinggy Tunnel for MCP
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/ssh -p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:localhost:3001 a.pinggy.io
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
"""

run_cmd('cat << "EOF" > /etc/systemd/system/pinggy-tunnel.service\n' + service_content + 'EOF')
run_cmd('systemctl daemon-reload')
run_cmd('systemctl enable pinggy-tunnel')
run_cmd('systemctl restart pinggy-tunnel')
time.sleep(3)
run_cmd('systemctl status pinggy-tunnel --no-pager')
run_cmd('journalctl -u pinggy-tunnel -n 20 --no-pager')

child.sendline('exit')
child.expect(pexpect.EOF)
