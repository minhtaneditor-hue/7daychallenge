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
with open('/etc/nginx/sites-available/mywebsite', 'r') as f:
    content = f.read()

content = content.replace('proxy_pass http://127.0.0.1:3001/mcp/;', 'proxy_pass http://127.0.0.1:3001;')

with open('/etc/nginx/sites-available/mywebsite', 'w') as f:
    f.write(content)
print("Nginx config fixed")
"""

run_cmd('cat << "EOF" > /tmp/fix_nginx.py\n' + script + 'EOF')
run_cmd('python3 /tmp/fix_nginx.py')
run_cmd('nginx -t')
run_cmd('systemctl restart nginx')

child.sendline('exit')
child.expect(pexpect.EOF)
