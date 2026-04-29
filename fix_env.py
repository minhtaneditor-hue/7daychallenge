import pexpect

def run():
    p = pexpect.spawn('ssh -o StrictHostKeyChecking=no -p 22 root@103.97.126.54', encoding='utf-8')
    p.expect('assword:')
    p.sendline('l5D1bpOpH3')
    p.expect('#')
    
    # Check if TURSO_URL is in the environment of mcp-server
    p.sendline('strings /proc/$(pgrep -f mcp_server.js)/environ | grep TURSO')
    p.expect('#')
    print("ENV:", p.before)
    
    p.sendline('exit')

if __name__ == '__main__':
    run()
