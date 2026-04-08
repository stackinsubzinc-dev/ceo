#!/bin/bash
# SETUP SCRIPT - Run this to set up TikTok integration

set -e

echo "================================================"
echo "🚀 TIKTOK + PRODUCT INTEGRATION SETUP"
echo "================================================"
echo ""

# Step 1: Create .env file
echo "[1/4] Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.tiktok.example .env
    echo "✓ Created .env file"
    echo ""
    echo "📝 IMPORTANT: Edit .env and add your TikTok credentials:"
    echo "  TIKTOK_CLIENT_ID=your_client_key"
    echo "  TIKTOK_CLIENT_SECRET=your_client_secret"
    echo "  TIKTOK_API_KEY=your_api_key"
    echo "  TIKTOK_ACCESS_TOKEN=your_token"
    echo ""
    read -p "Press Enter after updating .env..."
else
    echo "✓ .env already exists"
fi

# Step 2: Check Python is installed
echo "[2/4] Verifying Python installation..."
python --version
echo "✓ Python is installed"

# Step 3: Install/update dependencies
echo "[3/4] Checking dependencies..."
if grep -q "aiohttp" requirements.txt; then
    echo "✓ Required packages already in requirements.txt"
else
    echo "⚠️  Note: Update requirements.txt with: aiohttp, requests"
fi

# Step 4: Verify files exist
echo "[4/4] Verifying integration files..."
if [ -f "backend/ai_services/tiktok_manager.py" ]; then
    echo "✓ tiktok_manager.py exists"
else
    echo "❌ tiktok_manager.py missing"
    exit 1
fi

if [ -f "backend/ai_services/product_tiktok_integration.py" ]; then
    echo "✓ product_tiktok_integration.py exists"
else
    echo "❌ product_tiktok_integration.py missing"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ SETUP COMPLETE!"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd backend && python server.py"
echo "  2. Test integration: python test_tiktok_manual.py"
echo "  3. API docs: http://localhost:8000/docs"
echo ""
echo "API Endpoints available:"
echo "  POST   /api/products/{id}/post-tiktok"
echo "  POST   /api/products/{id}/post-tiktok-series"
echo "  POST   /api/products/{id}/schedule-tiktok"
echo "  GET    /api/social/tiktok/analytics/{video_id}"
echo "  POST   /api/social/tiktok/comments/{video_id}"
echo ""
echo "Documentation:"
echo "  - PRODUCT_TIKTOK_INTEGRATION.md (you are here)"
echo "  - TIKTOK_INTEGRATION_GUIDE.md (full setup)"
echo "  - TIKTOK_API_REFERENCE.md (API docs)"
echo ""
