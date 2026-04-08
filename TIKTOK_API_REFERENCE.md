# TikTok Integration - API Reference Card

## Quick Reference

### Authentication
- Set `TIKTOK_ACCESS_TOKEN` in environment
- Ensure TikTok API credentials configured in `.env`

---

## Operations

### 1️⃣ POST A VIDEO
```
POST /api/social/post-tiktok

{
  "video_file_path": string,      // Required: path to video file
  "caption": string,              // Required: video caption
  "hashtags": [string],           // Optional: hashtag array
  "privacy_level": "PUBLIC"       // Optional: PUBLIC|PRIVATE|FRIENDS
}

Returns:
{
  "status": "success",
  "video_id": "123456789",
  "post_url": "https://tiktok.com/@creator/video/...",
  "posted_at": "2026-04-08T..."
}
```

### 2️⃣ EDIT A VIDEO
```
POST /api/social/tiktok/edit

{
  "video_id": string,             // Required: video ID
  "updates": {
    "caption": string,            // Optional: new caption
    "hashtags": [string],         // Optional: new hashtags
    "privacy_level": string       // Optional: privacy setting
  }
}

Returns:
{
  "status": "success",
  "video_id": "123456789",
  "updated_fields": ["caption", "hashtags"]
}
```

### 3️⃣ SCHEDULE A POST
```
POST /api/social/tiktok/schedule

{
  "content": {                    // Required: video data
    "video_file_path": string,
    "caption": string,
    "hashtags": [string]
  },
  "schedule_time": string         // Required: ISO datetime
}

Returns:
{
  "status": "success",
  "scheduled_id": "scheduled_1",
  "schedule_time": "2026-04-09T14:00:00Z"
}
```

### 4️⃣ DELETE A VIDEO
```
DELETE /api/social/tiktok/{video_id}

Returns:
{
  "status": "success",
  "video_id": "123456789",
  "message": "Video deleted successfully"
}
```

### 5️⃣ GET VIDEO ANALYTICS
```
GET /api/social/tiktok/analytics/{video_id}

Returns:
{
  "status": "success",
  "video_id": "123456789",
  "analytics": {
    "views": 45000,
    "likes": 3200,
    "comments": 450,
    "shares": 120,
    "watch_time_seconds": 180000,
    "average_watch_time": 3.5,
    "engagement_rate": "7.2%",
    "follower_growth": 230
  }
}
```

### 6️⃣ GET CHANNEL ANALYTICS
```
GET /api/social/tiktok/analytics/channel/summary?period_days=30

Returns:
{
  "status": "success",
  "period_days": 30,
  "analytics": {
    "total_videos": 15,
    "total_views": 500000,
    "total_likes": 35000,
    "total_comments": 5000,
    "total_shares": 1200,
    "follower_count": 8500,
    "new_followers": 450,
    "engagement_rate": "8.1%",
    "average_video_views": 45000
  }
}
```

### 7️⃣ MODERATE COMMENTS
```
POST /api/social/tiktok/comments/{video_id}

{
  "action": string                // get|delete|hide|pin|report
}

Returns:
{
  "status": "success",
  "video_id": "123456789",
  "action": "get",
  "comments": [
    {
      "comment_id": "c1",
      "author": "user123",
      "text": "Love this!",
      "likes": 234,
      "timestamp": "2026-04-08T..."
    }
  ],
  "total_comments": 450
}
```

### 8️⃣ GET TRENDING SOUNDS
```
GET /api/social/tiktok/trending/sounds?limit=10

Returns:
{
  "status": "success",
  "trending_sounds": [
    {
      "sound_id": "sound_1",
      "title": "Trending Sound #1",
      "artist": "Artist Name",
      "uses_count": 100000,
      "duration": "35s"
    }
  ]
}
```

### 9️⃣ GET TRENDING HASHTAGS
```
GET /api/social/tiktok/trending/hashtags?limit=10

Returns:
{
  "status": "success",
  "trending_hashtags": [
    {
      "hashtag": "trending1",
      "view_count": 50000000,
      "video_count": 500000
    }
  ]
}
```

---

## Python SDK Usage

```python
from ai_services.tiktok_manager import get_tiktok_manager

tiktok = get_tiktok_manager()

# Post
result = await tiktok.post_video({
    "caption": "Hello TikTok!",
    "hashtags": ["viral"]
})

# Edit
await tiktok.edit_video(video_id, {
    "caption": "Updated!"
})

# Schedule
await tiktok.schedule_post(content, "2026-04-09T14:00:00Z")

# Delete
await tiktok.delete_video(video_id)

# Analytics
video_analytics = await tiktok.get_video_analytics(video_id)
channel_analytics = await tiktok.get_channel_analytics(30)

# Comments
comments = await tiktok.moderate_comments(video_id, "get")

# Trending
sounds = await tiktok.get_trending_sounds(10)
hashtags = await tiktok.get_trending_hashtags(10)
```

---

## cURL Examples

### Post a Video
```bash
curl -X POST http://localhost:8000/api/social/post-tiktok \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "Amazing product! 🚀",
    "hashtags": ["viral", "trending"],
    "privacy_level": "PUBLIC"
  }'
```

### Get Analytics
```bash
curl -X GET http://localhost:8000/api/social/tiktok/analytics/VIDEO_ID
```

### Schedule a Post
```bash
curl -X POST http://localhost:8000/api/social/tiktok/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "caption": "Posting tomorrow!",
      "hashtags": ["scheduled"]
    },
    "schedule_time": "2026-04-10T10:00:00Z"
  }'
```

### Get Trending Hashtags
```bash
curl -X GET "http://localhost:8000/api/social/tiktok/trending/hashtags?limit=5"
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "status": "error",
  "message": "Description of what went wrong",
  "platform": "tiktok"
}
```

Common errors:
- `"Video not found"` - Invalid video_id
- `"TikTok API key not configured"` - Missing credentials
- `"API rate limit exceeded"` - Too many requests

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 401 | Unauthorized (missing credentials) |
| 404 | Not found (video doesn't exist) |
| 429 | Rate limited (too many requests) |
| 500 | Server error |

---

## Rate Limits

- **Posts**: 1000 per day
- **reads**: 60 per hour
- **Batch operations**: 100 per hour

---

## Timestamp Format

All timestamps use ISO 8601:
```
2026-04-09T14:00:00Z
2026-04-09T14:00:00+05:00
2026-04-09T14:00:00-08:00
```

---

## Tips & Tricks

1. **Use trending hashtags** for better reach
2. **Post at peak times** (typically 6-10 PM)
3. **Batch multiple posts** when possible
4. **Cache trending data** to avoid rate limits
5. **Monitor comments** for engagement
6. **Schedule in advance** for consistency

---

Generated: 2026-04-08
Version: 1.0
Status: Production Ready ✅
