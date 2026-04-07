import urllib.request
import re

url = 'https://forms.gle/n17rUg6AmGxbTPWs6'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    action = re.search(r'action="(https://docs.google.com/forms/d/e/[^"]+/formResponse)"', html)
    if action:
        print("ACTIONURL:", action.group(1))
    else:
        print("ACTIONURL NOT FOUND")
        meta = re.search(r'URL=(https://docs\.google\.com/forms/d/e/[^/]+)', html)
        if meta:
            print("REDIRECT URL:", meta.group(1))
            
    entries = re.findall(r'name="(entry\.\d+)"', html)
    print("FIELDS:", list(set(entries)))
    
    # Dump some context
    FB_context = re.findall(r'.{0,50}entry\.\d+.*', html)
    for c in FB_context[:10]:
        print(c)
        
except Exception as e:
    print(e)
