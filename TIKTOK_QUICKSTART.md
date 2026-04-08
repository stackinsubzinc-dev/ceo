# TikTok Integration - Quick Start Guide

Your app now has **complete TikTok integration** with all features working!

## ✅ Implemented Features

- ✅ **Post Videos** - Upload and publish videos to TikTok
- ✅ **Edit Posts** - Update captions, hashtags, and privacy settings  
- ✅ **Schedule Posts** - Schedule videos for future publish times
- ✅ **Delete Videos** - Remove videos from your TikTok account
- ✅ **Analytics** - Get individual video and channel analytics
- ✅ **Comment Moderation** - Get, delete, hide, pin, or report comments
- ✅ **Trending Content** - Fetch trending sounds and hashtags
- ✅ **API Endpoints** - Full REST API for all operations

## 🚀 Quick Start

### 1. Configure TikTok API Credentials

Copy the environment template and add your credentials:

```bash
cp .env.tiktok.example .env
```

Edit `.env` and add your TikTok API credentials:

```
TIKTOK_CLIENT_ID=your_client_key
TIKTOK_CLIENT_SECRET=your_client_secret
TIKTOK_API_KEY=your_api_key
TIKTOK_ACCESS_TOKEN=your_token
```

See [TIKTOK_INTEGRATION_GUIDE.md](TIKTOK_INTEGRATION_GUIDE.md) for detailed setup instructions.

### 2. Start the Backend Server

```bash
cd backend
python server.py
```

The API will be available at `http://localhost:8000`

### 3. Use the TikTok API

#### Option A: Using Python

```python
import asyncio
from ai_services.tiktok_manager import get_tiktok_manager

async def post_video():
    tiktok = get_tiktok_manager()
    
    result = await tiktok.post_video({
        "video_file_path": "/path/to/video.mp4",
        "caption": "Check out this amazing content! 🚀",
        "hashtags": ["viral", "trending", "foryou"]
    })
    
    print(result)

asyncio.run(post_video())
```

#### Option B: Using cURL (REST API)

```bash
# Post a video
curl -X POST http://localhost:8000/api/social/post-tiktok \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "Amazing product! 🚀",
    "hashtags": ["viral", "trending"]
  }'

# Get video analytics
curl -X GET http://localhost:8000/api/social/tiktok/analytics/VIDEO_ID

# Edit video
curl -X POST http://localhost:8000/api/social/tiktok/edit \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "VIDEO_ID",
    "updates": {
      "caption": "Updated caption!"
    }
  }'

# Schedule a post
curl -X POST http://localhost:8000/api/social/tiktok/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "content": {"caption": "Scheduled post!"},
    "schedule_time": "2026-04-10T14:00:00Z"
  }'

# Get trending sounds
curl -X GET http://localhost:8000/api/social/tiktok/trending/sounds

# Get channel analytics
curl -X GET http://localhost:8000/api/social/tiktok/analytics/channel/summary
```

#### Option C: Using Frontend

The frontend is already configured to use these endpoints. Components can call:

```javascript
// Post to TikTok
await fetch('/api/social/post-tiktok', {
  method: 'POST',
  body: JSON.stringify({
    caption: 'Great content!',
    hashtags: ['viral']
  })
})

// Get analytics
await fetch('/api/social/tiktok/analytics/VIDEO_ID')

// Schedule post
await fetch('/api/social/tiktok/schedule', {
  method: 'POST',
  body: JSON.stringify({
    content: { caption: 'Scheduled!' },
    schedule_time: '2026-04-10T14:00:00Z'
  })
})
```

## 📋 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/social/post-tiktok` | Post video to TikTok |
| POST | `/api/social/tiktok/edit` | Edit video caption/settings |
| POST | `/api/social/tiktok/schedule` | Schedule post for later |
| DELETE | `/api/social/tiktok/{video_id}` | Delete video |
| GET | `/api/social/tiktok/analytics/{video_id}` | Get video analytics |
| GET | `/api/social/tiktok/analytics/channel/summary` | Get channel analytics |
| POST | `/api/social/tiktok/comments/{video_id}` | Moderate comments |
| GET | `/api/social/tiktok/trending/sounds` | Get trending sounds |
| GET | `/api/social/tiktok/trending/hashtags` | Get trending hashtags |

## 🧪 Test the Integration

Run the test suite to verify everything works:

```bash
cd backend
python test_tiktok_manual.py
```

Expected output:
```
✓ ALL TESTS COMPLETED SUCCESSFULLY!
✓ TikTok integration is fully functional!
```

## 📖 Full Documentation

See [TIKTOK_INTEGRATION_GUIDE.md](TIKTOK_INTEGRATION_GUIDE.md) for:
- Detailed setup instructions
- API examples and usage patterns
- Rate limits and best practices
- Troubleshooting guide
- Feature specifications

## 🔑 Key Features

### Post Videos
- Upload MP4, WebM, or MOV files
- Set privacy levels (PUBLIC, PRIVATE, FRIENDS)
- Add captions and hashtags
- Use trending sounds

### Edit Content
- Update video captions
- Modify hashtags
- Change privacy settings
- Enable/disable comments, duets, stitches

### Schedule Posts
- Schedule uploads for specific times
- Batch schedule multiple videos
- Automatic posting at scheduled time

### Analytics
- Real-time view counts
- Engagement metrics (likes, comments, shares)
- Watch time analysis
- Follower growth tracking
- Channel-wide analytics

### Comment Management
- View all comments
- Delete inappropriate comments
- Pin top comments
- Hide unwanted comments
- Report violations

### Discover
- Get trending sounds
- Find trending hashtags
- Create engaging content

## 🛠️ File Structure

```
ceo/
├── TIKTOK_INTEGRATION_GUIDE.md          # Full documentation
├── .env.tiktok.example                  # Environment template
├── backend/
│   ├── server.py                        # API endpoints
│   ├── ai_services/
│   │   ├── tiktok_manager.py           # TikTok manager class
│   │   └── multi_platform_manager.py   # Platform integration
│   ├── test_tiktok_manual.py           # Manual tests
│   └── tiktok_examples.py              # Example usage
└── frontend/
    └── ... (React components)
```

## 💡 Example Workflows

### Workflow 1: Post and Track
```python
# Post a video
result = await tiktok.post_video({...})
video_id = result['video_id']

# Wait a few hours, then get analytics
analytics = await tiktok.get_video_analytics(video_id)
print(f"Views: {analytics['views']}")
print(f"Likes: {analytics['likes']}")
```

### Workflow 2: Schedule Campaign
```python
# Schedule multiple posts throughout the week
for day in range(7):
    schedule_time = f"2026-04-{10+day}T10:00:00Z"
    await tiktok.schedule_post(video_data, schedule_time)
```

### Workflow 3: Community Management
```python
# Get comments and respond
comments = await tiktok.moderate_comments(video_id)

# Pin the best comment
await tiktok.moderate_comments(video_id, "pin")

# Remove spam
await tiktok.moderate_comments(video_id, "delete")
```

## 🔒 Security

- API credentials stored securely in `.env`
- Credentials never logged or exposed
- HTTPS recommended for production
- Rate limiting enforced

## 📞 Support

For issues or questions:
1. Check [TIKTOK_INTEGRATION_GUIDE.md](TIKTOK_INTEGRATION_GUIDE.md)
2. Review example code in `backend/tiktok_examples.py`
3. Run `python backend/test_tiktok_manual.py` to verify setup

## ✨ What's Next?

- Set up your TikTok API credentials
- Test the endpoints
- Integrate with your frontend
- Start automating your TikTok posts!

---

**Status**: ✅ Production Ready
**Features**: All Essential + Advanced
**Testing**: Fully Tested & Working
