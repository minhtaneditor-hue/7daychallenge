import pexpect
import sys

password = "l5D1bpOpH3"
host = "root@103.97.126.54"
port = "22"

print("Connecting to VPS...")
child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p {port} {host}', encoding='utf-8', timeout=60)
child.logfile = sys.stdout

index = child.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child.sendline(password)
    child.expect([r'root@.*#', r'\$'])
else:
    print("Failed to connect")
    sys.exit(1)

def run_cmd(cmd, timeout=30):
    child.sendline(cmd)
    child.expect([r'root@.*#', r'\$'], timeout=timeout)

# 1. Copy .env mới lên VPS (có TROLYMT_BOT_TOKEN)
print("\n[1] Copying updated .env to VPS...")
child.sendline('exit')
child.expect(pexpect.EOF)

# SCP .env mới
child2 = pexpect.spawn(f'scp -o StrictHostKeyChecking=no -P {port} .env {host}:/opt/my-website/.env', encoding='utf-8', timeout=30)
child2.logfile = sys.stdout
index = child2.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child2.sendline(password)
    child2.expect(pexpect.EOF)
print(".env uploaded.")

# 2. SSH lại để setup cron + copy heartbeat.js
child = pexpect.spawn(f'ssh -o StrictHostKeyChecking=no -p {port} {host}', encoding='utf-8', timeout=60)
child.logfile = sys.stdout
index = child.expect(['assword:', pexpect.EOF, pexpect.TIMEOUT])
if index == 0:
    child.sendline(password)
    child.expect([r'root@.*#', r'\$'])

def run_cmd(cmd, timeout=30):
    child.sendline(cmd)
    child.expect([r'root@.*#', r'\$'], timeout=timeout)

# 3. Pull code mới nhất từ git (có heartbeat.js)
print("\n[2] Pulling latest code...")
run_cmd('cd /opt/my-website && git pull origin main', timeout=60)
run_cmd('cd /opt/my-website && npm install')

# 4. Restart service để load .env mới
print("\n[3] Restarting service...")
run_cmd('systemctl restart mywebsite')
run_cmd('sleep 2')
run_cmd('systemctl status mywebsite --no-pager | head -5')

# 5. Setup crontab - heartbeat mỗi 30 phút
print("\n[4] Setting up heartbeat crontab...")

cron_line = '*/30 * * * * curl -s -X GET http://localhost:3000/api/heartbeat -H "Authorization: Bearer 7day-cron-secret-2026" >> /var/log/heartbeat.log 2>&1'

# Thêm vào crontab (tránh duplicate)
run_cmd(f'(crontab -l 2>/dev/null | grep -v "api/heartbeat"; echo "{cron_line}") | crontab -')
run_cmd('crontab -l')

# 6. Test heartbeat ngay lập tức
print("\n[5] Testing heartbeat endpoint...")
run_cmd('curl -s -X GET http://localhost:3000/api/heartbeat -H "Authorization: Bearer 7day-cron-secret-2026"', timeout=15)

print("\n✅ Heartbeat cron đã được setup!")
print("📡 trolymtabot sẽ báo cáo mỗi 30 phút")

child.sendline('exit')
child.expect(pexpect.EOF)
