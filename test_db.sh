source /opt/my-website/.env
curl -s -X POST -H "Authorization: Bearer $TURSO_TOKEN" -H "Content-Type: application/json" -d '{"requests":[{"type":"execute","stmt":{"sql":"SELECT * FROM products WHERE id = 1"}}]}' https://minhtan-academy-vo-tanlm-m.turso.io/v2/pipeline
