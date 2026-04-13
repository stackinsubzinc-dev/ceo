# 🎬 Video Generation & Multi-Platform Product Sync - Setup Guide

This guide walks you through setting up real video generation and product syncing across all your stores.

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd ceo/backend
pip install -r requirements.txt
```

### Step 2: Set Environment Variables

Create or update `.env` in the `backend` directory with:

```bash
# Video Generation (Required for video generation)
ELEVENLABS_API_KEY=sk_...          # From elevenlabs.io
PEXELS_API_KEY=...                 # From pexels.com/api
PIXABAY_API_KEY=...                # From pixabay.com/api/docs

# YouTube Integration (Required for YouTube uploads)
YOUTUBE_CLIENT_SECRETS_FILE=youtube_client_secret.json
YOUTUBE_CREDENTIALS_FILE=youtube_credentials.json

# Platform Integrations (Add only the platforms you use)

# Etsy
ETSY_API_KEY=...
ETSY_SHOP_ID=...
ETSY_ACCESS_TOKEN=...

# Shopify
SHOPIFY_STORE_URL=yourstore.myshopify.com
SHOPIFY_ACCESS_TOKEN=shppa_...

# Amazon Seller Central
AMAZON_ACCESS_KEY_ID=...
AMAZON_SECRET_ACCESS_KEY=...
AMAZON_SELLER_ID=A1EXAMPLE
AMAZON_REGION=US

# TikTok Shop
TIKTOK_SHOP_ACCESS_TOKEN=...
TIKTOK_SHOP_CIPHER=...

# Gumroad
GUMROAD_TOKEN=...
```

## 📹 Feature 1: Faceless Video Generation

### What It Does
Automatically generates professional YouTube Shorts, TikTok, and Instagram Reels videos with:
- AI voiceover (ElevenLabs)
- Background footage (Pexels/Pixabay)
- Auto-generated text overlays
- Optimized 1080x1920 vertical format

### Setup

1. **Get ElevenLabs API Key**:
   - Go to https://elevenlabs.io
   - Sign up (free tier available)
   - Copy API key to `.env`

2. **Get Pexels API Key** (optional, for background videos):
   - Go to https://www.pexels.com/api/
   - Create account and get API key
   - Add to `.env`

3. **Get Pixabay API Key** (optional, fallback for videos):
   - Go to https://pixabay.com/api/docs/
   - Get API key
   - Add to `.env`

### Usage

**Generate a single video:**
```bash
curl -X POST "http://localhost:8000/api/videos/generate-faceless" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123",
    "style": "motivational",
    "duration": 60,
    "count": 1
  }'
```

**Response:**
```json
{
  "success": true,
  "video_id": "vid_abc123",
  "video_path": "/path/to/video.mp4",
  "duration": 60,
  "format": "1080x1920",
  "timestamp": "2026-04-13T...",
  "platforms_ready": {
    "youtube_shorts": true,
    "tiktok": true,
    "instagram_reels": true
  }
}
```

**Generate multiple video styles:**
```bash
curl -X POST "http://localhost:8000/api/videos/generate-faceless" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123",
    "style": "motivational",
    "duration": 60,
    "count": 5
  }'
```

**Video Styles Available:**
- `motivational` - Inspiring product benefits
- `tutorial` - How-to guide format
- `demo` - Product demo walkthrough
- `testimonial` - Customer success story
- `comparison` - Product vs alternatives

**Get all videos for a product:**
```bash
curl "http://localhost:8000/api/videos/product/prod_123"
```

## 🏪 Feature 2: Multi-Platform Product Sync

### Supported Platforms
- ✅ **Etsy** - Full API integration
- ✅ **Shopify** - Full API integration  
- ✅ **Amazon** - Full API integration
- ✅ **TikTok Shop** - Full API integration
- ✅ **Gumroad** - Full API integration

### Setup Platform Credentials

#### Etsy
1. Go to https://www.etsy.com/developers
2. Create app and get API key
3. Get shop ID from your shop settings
4. Get access token from OAuth flow
5. Add to `.env`:
   ```
   ETSY_API_KEY=your_key
   ETSY_SHOP_ID=your_shop_id
   ETSY_ACCESS_TOKEN=your_token
   ```

#### Shopify
1. Go to your Shopify admin
2. Create custom app (Settings → Apps & integrations)
3. Get store URL and access token
4. Add to `.env`:
   ```
   SHOPIFY_STORE_URL=yourstore.myshopify.com
   SHOPIFY_ACCESS_TOKEN=shppa_...
   ```

#### Amazon Seller Central
1. Go to https://sellercentral.amazon.com
2. Get AWS Access Key & Secret Key
3. Get Seller ID from account settings
4. Add to `.env`:
   ```
   AMAZON_ACCESS_KEY_ID=AKIA...
   AMAZON_SECRET_ACCESS_KEY=...
   AMAZON_SELLER_ID=A1EXAMPLE
   ```

#### TikTok Shop
1. Go to https://partner.tiktok-shops.com
2. Create seller account
3. Get access token from developer settings
4. Add to `.env`:
   ```
   TIKTOK_SHOP_ACCESS_TOKEN=...
   TIKTOK_SHOP_CIPHER=...
   ```

#### Gumroad
1. Go to https://gumroad.com
2. Account settings → Developer
3. Get API token
4. Add to `.env`:
   ```
   GUMROAD_TOKEN=...
   ```

### Usage

**One-click publish to all configured stores:**
```bash
curl -X POST "http://localhost:8000/api/products/prod_123/sync-all-platforms" \
  -H "Content-Type: application/json" \
  -d '{
    "platforms": ["etsy", "shopify", "tiktok_shop"]
  }'
```

**Response:**
```json
{
  "success": true,
  "product_id": "prod_123",
  "synced_to": {
    "etsy": {
      "listing_id": "123456789",
      "url": "https://www.etsy.com/listing/123456789",
      "status": "published"
    },
    "shopify": {
      "product_id": "abc123",
      "url": "https://yourstore.myshopify.com/admin/products/abc123",
      "status": "created"
    },
    "tiktok_shop": {
      "product_id": "xyz789",
      "url": "https://www.tiktokshop.com/product/xyz789",
      "status": "published"
    }
  },
  "failed": []
}
```

**Sync inventory updates:**
```bash
curl -X PUT "http://localhost:8000/api/products/prod_123/sync-inventory" \
  -H "Content-Type: application/json" \
  -d '{
    "inventory_updates": {
      "etsy": 50,
      "shopify": 100,
      "tiktok_shop": 75
    }
  }'
```

**Update pricing per platform:**
```bash
curl -X PUT "http://localhost:8000/api/products/prod_123/sync-pricing" \
  -H "Content-Type: application/json" \
  -d '{
    "pricing": {
      "etsy": 29.99,
      "shopify": 39.99,
      "amazon": 24.99
    }
  }'
```

**Check sync status:**
```bash
curl "http://localhost:8000/api/products/prod_123/sync-status"
```

**Sync multiple products:**
```bash
curl -X POST "http://localhost:8000/api/products/sync-batch" \
  -H "Content-Type: application/json" \
  -d '{"product_ids": ["prod_1", "prod_2", "prod_3"]}'
```

## 🎥 Feature 3: YouTube Integration

### Setup YouTube API

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com
   - Create new project
   - Enable YouTube Data API v3

2. **Create OAuth Credentials:**
   - Go to Credentials
   - Create "OAuth 2.0 Client ID" (Web application)
   - Download as JSON → save as `youtube_client_secret.json` in backend directory
   - Add to `.env`:
     ```
     YOUTUBE_CLIENT_SECRETS_FILE=youtube_client_secret.json
     YOUTUBE_CREDENTIALS_FILE=youtube_credentials.json
     ```

### Usage

**Get YouTube authorization URL:**
```bash
curl "http://localhost:8000/api/youtube/auth/url"
```
Visit the returned URL to authorize.

**Handle OAuth callback:**
```bash
curl -X POST "http://localhost:8000/api/youtube/auth/callback?code=AUTHORIZATION_CODE"
```

**Upload video to YouTube Shorts:**
```bash
curl -X POST "http://localhost:8000/api/youtube/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "vid_abc123",
    "title": "Amazing Product Demo",
    "description": "Check out this incredible product...",
    "tags": ["shorts", "product", "demo"],
    "privacy_status": "public",
    "made_for_kids": false
  }'
```

**Check video processing status:**
```bash
curl "http://localhost:8000/api/youtube/video/dQw4w9WgXcQ/status"
```

**Get channel analytics:**
```bash
curl "http://localhost:8000/api/youtube/channel/analytics"
```

**Create playlist for products:**
```bash
curl -X POST "http://localhost:8000/api/youtube/playlist/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Reviews 2026",
    "description": "All our product demo videos",
    "privacy_status": "public"
  }'
```

## 🔧 Complete Workflow Example

```bash
# 1. Generate 3 video variations for a product
curl -X POST "http://localhost:8000/api/videos/generate-faceless" \
  -d '{"product_id": "prod_123", "count": 3, "style": "motivational"}'

# 2. Sync product to all stores
curl -X POST "http://localhost:8000/api/products/prod_123/sync-all-platforms" \
  -d '{"platforms": ["etsy", "shopify", "tiktok_shop"]}'

# 3. Upload first video to YouTube
curl -X POST "http://localhost:8000/api/youtube/upload" \
  -d '{
    "video_id": "first_video_id",
    "title": "Product Name Demo",
    "tags": ["shorts", "product"],
    "privacy_status": "public"
  }'

# 4. Check YouTube upload status
curl "http://localhost:8000/api/youtube/video/YOUTUBE_VIDEO_ID/status"
```

## ⚡ Pro Tips

1. **Batch Processing**: Use `/products/sync-batch` for bulk product uploads to save time

2. **Inventory Management**: Set up inventory sync before launch to avoid overselling

3. **Platform-Specific Pricing**: Use different prices on different platforms to optimize for each market

4. **Video Series**: Generate multiple video variations to test different hooks and CTAs

5. **YouTube Playlists**: Organize all product videos into playlists for better discoverability

6. **Monitor Status**: Check sync status regularly to ensure all platforms stay in sync

## 🐛 Troubleshooting

**Video Generation Fails:**
- Check ElevenLabs API key is valid
- Verify Pexels/Pixabay keys for background footage
- Check disk space for video output
- Ensure ffmpeg is installed (`pip install imageio-ffmpeg`)

**Product Sync Not Working:**
- Verify platform API credentials in `.env`
- Check network connectivity
- Review platform API rate limits
- Check database collections exist

**YouTube Upload Fails:**
- Verify OAuth authorization complete
- Check video format is MP4 (1080x1920)
- Verify title < 100 chars, description < 5000 chars
- Check YouTube API quota limits

## 📊 API Documentation

All endpoints available at: `http://localhost:8000/docs` (Swagger UI)

See the code comments in:
- `backend/ai_services/faceless_video_generator.py`
- `backend/ai_services/multi_platform_product_sync.py`
- `backend/ai_services/youtube_data_api.py`

## 🚀 Deployment

When deploying to production:

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables** on Railway/Vercel

3. **Test endpoints** before going live

4. **Monitor sync operations** for errors

5. **Set up alerting** for failed syncs

6. **Regular backups** of product sync history

Happy launching! 🎉
