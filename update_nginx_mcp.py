import pexpect
import sys

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

script = """
import re
with open('/etc/nginx/sites-available/mywebsite', 'r') as f:
    content = f.read()

location_block = '''
    location /mcp/ {
        proxy_pass http://127.0.0.1:3001/mcp/;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_set_header Host $host;
        chunked_transfer_encoding off;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }
'''

if 'location /mcp/' not in content:
    content = content.replace('location / {', location_block + '\\n    location / {')
    with open('/etc/nginx/sites-available/mywebsite', 'w') as f:
        f.write(content)
    print("Nginx config updated")
else:
    print("Nginx config already has /mcp/")
"""

run_cmd('cat << "EOF" > /tmp/update_nginx.py\n' + script + 'EOF')
run_cmd('python3 /tmp/update_nginx.py')
run_cmd('nginx -t')
run_cmd('systemctl restart nginx')

child.sendline('exit')
child.expect(pexpect.EOF)
