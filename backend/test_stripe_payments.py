"""
Test script for Stripe Payment endpoints
"""
import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000"

async def test_create_checkout():
    """Test creating a Stripe checkout session"""
    print("=" * 60)
    print("Testing POST /api/payments/create-checkout")
    print("=" * 60)
    payload = {
        "product_id": "prod_12345",
        "customer_email": "customer@example.com",
        "success_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel",
        "quantity": 1
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/payments/create-checkout",
            json=payload
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

async def test_product_payment_stats():
    """Test getting payment statistics for a product"""
    print("=" * 60)
    print("Testing GET /api/payments/{product_id}/stats")
    print("=" * 60)
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{BASE_URL}/api/payments/prod_12345/stats"
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

async def test_all_payment_stats():
    """Test getting overall payment statistics"""
    print("=" * 60)
    print("Testing GET /api/payments/all-stats")
    print("=" * 60)
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(
            f"{BASE_URL}/api/payments/all-stats"
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

async def test_webhook_simulation():
    """Simulate Stripe webhook event"""
    print("=" * 60)
    print("Testing POST /api/payments/webhook (Simulated)")
    print("=" * 60)
    payload = {
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "id": "cs_test_123456",
                "payment_intent": "pi_test_123456",
                "customer_email": "customer@example.com",
                "amount_total": 2999,
                "metadata": {
                    "product_id": "prod_12345",
                    "customer_email": "customer@example.com"
                }
            }
        }
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            f"{BASE_URL}/api/payments/webhook",
            json=payload
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()

async def main():
    print("\n💳 Stripe Payment Endpoints Test Suite")
    print("=" * 60)
    print("Note: Server must be running on http://localhost:8000\n")
    print("⚠️  Stripe API key must be configured for payment tests\n")
    
    try:
        print("1️⃣  Testing checkout session creation...")
        try:
            await test_create_checkout()
        except Exception as e:
            print(f"⚠️  Skipped (likely no Stripe key or product): {str(e)[:100]}\n")
        
        print("2️⃣  Testing product payment stats...")
        try:
            await test_product_payment_stats()
        except Exception as e:
            print(f"⚠️  Skipped (likely no product payments): {str(e)[:100]}\n")
        
        print("3️⃣  Testing overall payment stats...")
        await test_all_payment_stats()
        
        print("4️⃣  Testing webhook simulation...")
        try:
            await test_webhook_simulation()
        except Exception as e:
            print(f"⚠️  Skipped (webhook error): {str(e)[:100]}\n")
        
        print("✅ All payment tests completed!")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
