# TikTok Integration Configuration Guide

## Prerequisites

Before using the TikTok integration, you'll need:
1. TikTok Developer Account
2. API credentials (Client ID, Client Secret)
3. Access Token

## Setup Steps

### 1. Get TikTok API Credentials

1. Visit https://developers.tiktok.com
2. Sign in or create a developer account
3. Create a new application
4. Select "Web" as the platform
5. Get your:
   - Client Key (Client ID)
   - Client Secret
   - Open ID (for APIs)

### 2. Configure Environment Variables

Create a `.env` file in the backend directory with:

```
# TikTok API Configuration
TIKTOK_CLIENT_ID=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_OPEN_ID=your_open_id_here
TIKTOK_API_KEY=your_api_key
TIKTOK_API_SECRET=your_api_secret
TIKTOK_ACCESS_TOKEN=your_access_token_here
TIKTOK_REDIRECT_URI=http://localhost:3000/callback
```

### 3. Install Dependencies

The following packages are required:
- `aiohttp` - async HTTP client
- `requests` - HTTP library

They should already be in `requirements.txt`.

## API Features

### 1. Post Videos
```python
await tiktok_manager.post_video({
    "video_file_path": "/path/to/video.mp4",
    "caption": "Your caption here",
    "hashtags": ["tag1", "tag2"],
    "privacy_level": "PUBLIC"
})
```

**Supported privacy levels:**
- `PUBLIC` - Everyone can see
- `PRIVATE` - Only you can see
- `FRIENDS` - Only friends can see

### 2. Edit Videos
```python
await tiktok_manager.edit_video(video_id, {
    "caption": "Updated caption",
    "hashtags": ["newtag"],
    "privacy_level": "PRIVATE"
})
```

### 3. Schedule Posts
```python
await tiktok_manager.schedule_post(
    video_data,
    "2026-04-09T14:00:00Z"  # ISO format datetime
)
```

### 4. Delete Videos
```python
await tiktok_manager.delete_video(video_id)
```

### 5. Get Analytics
```python
# Single video
await tiktok_manager.get_video_analytics(video_id)

# All videos (last 30 days by default)
await tiktok_manager.get_channel_analytics(period_days=30)
```

**Analytics includes:**
- Views, Likes, Comments, Shares
- Watch time, Average watch time
- Engagement rate
- Follower growth

### 6. Moderate Comments
```python
# Get comments
await tiktok_manager.moderate_comments(video_id, "get")

# Delete a comment
await tiktok_manager.moderate_comments(video_id, "delete")

# Pin a comment
await tiktok_manager.moderate_comments(video_id, "pin")

# Hide a comment
await tiktok_manager.moderate_comments(video_id, "hide")

# Report a comment
await tiktok_manager.moderate_comments(video_id, "report")
```

### 7. Get Trending Content
```python
# Trending sounds
await tiktok_manager.get_trending_sounds(limit=10)

# Trending hashtags
await tiktok_manager.get_trending_hashtags(limit=10)
```

## API Endpoints

### POST Endpoints

#### Post Video
```
POST /api/social/post-tiktok
Content-Type: application/json

{
    "video_file_path": "/path/to/video.mp4",
    "caption": "Video caption",
    "hashtags": ["tag1", "tag2"],
    "privacy_level": "PUBLIC"
}
```

#### Edit Video
```
POST /api/social/tiktok/edit
Content-Type: application/json

{
    "video_id": "123456789",
    "updates": {
        "caption": "New caption",
        "hashtags": ["newtag"]
    }
}
```

#### Schedule Post
```
POST /api/social/tiktok/schedule
Content-Type: application/json

{
    "content": {...video_data...},
    "schedule_time": "2026-04-09T14:00:00Z"
}
```

#### Moderate Comments
```
POST /api/social/tiktok/comments/{video_id}
Content-Type: application/json

{
    "action": "get"  // or: delete, hide, pin, report
}
```

### DELETE Endpoints

#### Delete Video
```
DELETE /api/social/tiktok/{video_id}
```

### GET Endpoints

#### Get Video Analytics
```
GET /api/social/tiktok/analytics/{video_id}
```

#### Get Channel Analytics
```
GET /api/social/tiktok/analytics/channel/summary?period_days=30
```

#### Get Trending Sounds
```
GET /api/social/tiktok/trending/sounds?limit=10
```

#### Get Trending Hashtags
```
GET /api/social/tiktok/trending/hashtags?limit=10
```

## Rate Limits

TikTok API has the following rate limits:
- **Batch Requests**: 60 requests per hour per application
- **Video Upload**: 1000 requests per day per application
- **Comment Operations**: 100 requests per hour

## Best Practices

1. **Use ISOs timestamps** for scheduling (e.g., `2026-04-09T14:00:00Z`)
2. **Optimize video files** (MP4 format, H264 codec, AAC audio)
3. **Use trending sounds and hashtags** for better reach
4. **Cache analytics** to avoid hitting rate limits
5. **Schedule posts** during peak engagement times
6. **Monitor comments** for community engagement

## Troubleshooting

### Authentication Error
- Verify API credentials in `.env`
- Check that credentials haven't expired
- Ensure redirect URI matches TikTok app settings

### Video Upload Failed
- Check video format (MP4 required)
- Verify file exists and is readable
- Check file size (max varies by account)

### Rate Limit Exceeded
- Implement exponential backoff
- Use scheduled batch operations
- Cache frequently requested data

## Testing

Run the examples:
```bash
python backend/tiktok_examples.py
```

Or use cURL:
```bash
# Test posting
curl -X POST http://localhost:8000/api/social/post-tiktok \\
  -H "Content-Type: application/json" \\
  -d '{
    "video_file_path": "/path/to/video.mp4",
    "caption": "Test post",
    "hashtags": ["test"]
  }'
```

## Support

For API issues, visit: https://developers.tiktok.com/doc/
