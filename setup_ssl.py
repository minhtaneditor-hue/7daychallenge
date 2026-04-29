import pexpect
import sys

password = "l5D1bpOpH3"
host = "root@103.97.126.54"
port = "22"
domain = "7day.minhtanacademy.com"

print(f"Connecting to VPS to setup SSL for {domain}...")
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

# Update Nginx config with domain
nginx_config = f"""server {{
    listen 80;
    server_name {domain};

    location / {{
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }}
}}
"""

run_cmd('cat << "EOF" > /etc/nginx/sites-available/mywebsite\n' + nginx_config + 'EOF')
run_cmd('nginx -t')
run_cmd('systemctl restart nginx')

# Install Certbot
run_cmd('apt-get update')
run_cmd('apt-get install -y certbot python3-certbot-nginx')

# Get SSL certificate
# --nginx: use nginx plugin
# -d: domain
# --non-interactive: don't ask questions
# --agree-tos: agree to Terms of Service
# -m: email for notifications
print("Requesting SSL certificate from Let's Encrypt...")
run_cmd(f'certbot --nginx -d {domain} --non-interactive --agree-tos -m admin@{domain}', timeout=120)

run_cmd('systemctl restart nginx')

print("SSL setup complete.")
child.sendline('exit')
child.expect(pexpect.EOF)
