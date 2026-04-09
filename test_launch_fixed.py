import requests
import json

print('\n[TEST] Testing Fixed Launch-Product Endpoint...')
print('='*60)

try:
    payload = {
        'concept': 'Daily Standup Automation',
        'niche': 'productivity',
        'product_type': 'ebook',
        'auto_publish': False,
        'generate_social': False
    }
    r = requests.post('http://localhost:8000/api/launch-product', json=payload, timeout=15)
    print('Status Code: {}'.format(r.status_code))
    
    if r.status_code in [200, 201]:
        data = r.json()
        print('Result: SUCCESS')
        product_title = data.get('product', {}).get('title', 'Unknown')
        print('Product Generated: {}'.format(product_title))
        print('Success: {}'.format(data.get('success')))
    else:
        print('Status: {}'.format(r.status_code))
        print('Response: {}'.format(r.text[:300]))
except Exception as e:
    print('Error: {}'.format(str(e)))

print('='*60)
