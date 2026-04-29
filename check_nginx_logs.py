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

run_cmd('cat /var/log/nginx/access.log | grep mcp')
run_cmd('cat /var/log/nginx/error.log | grep mcp')

child.sendline('exit')
child.expect(pexpect.EOF)
