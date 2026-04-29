import pexpect

def run():
    p = pexpect.spawn('ssh -o StrictHostKeyChecking=no -p 22 root@103.97.126.54', encoding='utf-8')
    p.expect('assword:')
    p.sendline('l5D1bpOpH3')
    p.expect('#')
    
    p.sendline('cat << "SCRIPT_EOF" > check_db.sh\nsource /opt/my-website/.env\ncurl -s -X POST -H "Authorization: Bearer $TURSO_TOKEN" -H "Content-Type: application/json" -d \'{"requests":[{"type":"execute","stmt":{"sql":"SELECT * FROM products WHERE id = 1"}}]}\' ${TURSO_URL/libsql:\/\//https:\/\/}/v2/pipeline\nSCRIPT_EOF')
    p.expect('#')
    
    p.sendline('bash check_db.sh')
    p.expect('#', timeout=10)
    print("RESULT:", p.before)
    
    p.sendline('exit')

if __name__ == '__main__':
    run()
