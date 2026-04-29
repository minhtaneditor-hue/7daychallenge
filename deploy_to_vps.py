import pexpect
import sys
import os

password = "l5D1bpOpH3"
host = "root@103.97.126.54"
port = "22"

print("Uploading brain.db via SCP...")
child = pexpect.spawn(f'scp -o StrictHostKeyChecking=no -P {port} brain.db .env {host}:/tmp/', encoding='utf-8', timeout=60)
child.logfile = sys.stdout
index = child.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child.sendline(password)
    child.expect(pexpect.EOF)
print("Upload done.")

print("Connecting to VPS via SSH...")
child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p {port} {host}', encoding='utf-8', timeout=120)
child.logfile = sys.stdout

index = child.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child.sendline(password)
    child.expect([r'#', r'\$'])
else:
    print("Failed to connect")
    sys.exit(1)

def run_cmd(cmd):
    child.sendline(cmd)
    child.expect([r'root@.*#', r'\$'])

run_cmd('apt-get update')
run_cmd('curl -fsSL https://deb.nodesource.com/setup_20.x | bash -')
run_cmd('apt-get install -y nodejs git')

run_cmd('rm -rf /opt/my-website')
run_cmd('git clone https://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@github.com/minhtaneditor-hue/7daychallenge.git /opt/my-website')
run_cmd('cp /tmp/brain.db /opt/my-website/brain.db')
run_cmd('cp /tmp/.env /opt/my-website/.env')
run_cmd('cd /opt/my-website && npm install')

# Create systemd service
service_file = """[Unit]
Description=My Website
After=network.target

[Service]
EnvironmentFile=/opt/my-website/.env
Type=simple
User=root
WorkingDirectory=/opt/my-website
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
"""
run_cmd('cat << "EOF" > /etc/systemd/system/mywebsite.service\n' + service_file + 'EOF')

run_cmd('systemctl daemon-reload')
run_cmd('systemctl enable mywebsite')
run_cmd('systemctl restart mywebsite')

run_cmd('sleep 2')
run_cmd('curl -s http://localhost:3000 | head -n 5')

print("Deployment complete.")
child.sendline('exit')
child.expect(pexpect.EOF)
