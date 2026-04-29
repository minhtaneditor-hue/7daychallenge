import urllib.request
import json
import os

url = "https://database-chestnut-jacket-vercel-icfg-hj6h16ghbwbnbfoibck4ype8.aws-us-east-1.turso.io/v2/pipeline"
token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzYyMzU4NTQsImlkIjoiMDE5ZDhmZTgtMzgwMS03OWYwLWJkZmYtY2I1N2FhMTU1MDlmIiwicmlkIjoiNGVmZDlkMzAtMDMxMi00NTZmLThlNWItOTU1YzNmMmFmNDA4In0.8DWOpoBhvZ279KxJuyozJH0RkigrfJG7g3YmQwJqC_iivTp3cftPuelcJLeXtCKLFmlFkFOzGJpMDn5BOo0QBA"

data = json.dumps({
    "requests": [
        {"type": "execute", "stmt": {"sql": "SELECT id, name, price FROM products"}}
    ]
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
})

response = urllib.request.urlopen(req)
result = json.loads(response.read())
print(json.dumps(result, indent=2))
