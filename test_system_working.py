import requests
import json

print('[TEST 1] Creating a product via /api/products POST...')
try:
    payload = {
        'title': 'Standup Automation Tool',
        'description': 'AI-powered daily standup meeting automation for remote teams',
        'product_type': 'template',
        'price': 29.99,
        'tags': ['productivity', 'automation', 'remote-work'],
        'content': 'Complete standup automation system...'
    }
    r = requests.post('http://localhost:8000/api/products', json=payload)
    print('Status: {}'.format(r.status_code))
    if r.status_code in [200, 201]:
        result = r.json()
        print('SUCCESS! Product created:')
        prod_id = result.get("id")
        title = result.get("title")
        prod_type = result.get("product_type")
        price = result.get("price")
        print('  - ID: {}'.format(prod_id))
        print('  - Title: {}'.format(title))
        print('  - Type: {}'.format(prod_type))
        print('  - Price: ${}'.format(price))
    else:
        print('Response: {}'.format(r.text[:300]))
except Exception as e:
    print('Error: {}'.format(str(e)))

print('\n[TEST 2] Listing all products...')
try:
    r = requests.get('http://localhost:8000/api/products')
    print('Status: {}'.format(r.status_code))
    if r.status_code == 200:
        products = r.json()
        print('SUCCESS! Found {} product(s):'.format(len(products)))
        for p in products:
            p_title = p.get("title")
            p_type = p.get("product_type")
            p_price = p.get("price")
            print('  - {} ({}) - ${}'.format(p_title, p_type, p_price))
    else:
        print('Response: {}'.format(r.text[:300]))
except Exception as e:
    print('Error: {}'.format(str(e)))

print('\n[TEST 3] Checking dashboard stats...')
try:
    r = requests.get('http://localhost:8000/api/dashboard/stats')
    print('Status: {}'.format(r.status_code))
    if r.status_code == 200:
        stats = r.json()
        print('Dashboard Stats:')
        total_prod = stats.get("total_products")
        total_rev = stats.get("total_revenue")
        total_clicks = stats.get("total_clicks")
        conv_rate = stats.get("conversion_rate")
        print('  - Total Products: {}'.format(total_prod))
        print('  - Total Revenue: ${}'.format(total_rev))
        print('  - Total Clicks: {}'.format(total_clicks))
        print('  - Conversion Rate: {}%'.format(conv_rate))
except Exception as e:
    print('Error: {}'.format(str(e)))

print('\n[TEST 4] Testing system health...')
try:
    r = requests.get('http://localhost:8000/api/system/health')
    print('Status: {}'.format(r.status_code))
    if r.status_code == 200:
        health = r.json()
        print('System Health:')
        print('  - Status: {}'.format(health.get("status")))
        services = health.get("services", {})
        print('  - Database: {}'.format(services.get("database")))
        print('  - AI Teams: {}'.format(services.get("ai_teams")))
except Exception as e:
    print('Error: {}'.format(str(e)))

print('\n' + '='*50)
print('SYSTEM VERIFICATION COMPLETE')
print('='*50)
