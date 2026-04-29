import pexpect
import sys

password = "l5D1bpOpH3"
host = "root@103.97.126.54"
port = "22"

print("Connecting to VPS to configure Nginx...")
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

nginx_config = """server {
    listen 80;
    server_name 103.97.126.54;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
"""

run_cmd('cat << "EOF" > /etc/nginx/sites-available/mywebsite\n' + nginx_config + 'EOF')
run_cmd('ln -sf /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/')
run_cmd('rm -f /etc/nginx/sites-enabled/default')
run_cmd('nginx -t')
run_cmd('systemctl restart nginx')

print("Nginx configured.")
child.sendline('exit')
child.expect(pexpect.EOF)
