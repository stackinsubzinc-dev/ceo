"""
TikTok Integration Test Suite
Tests all TikTok API operations
"""

import asyncio
import sys
import os
import json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import pytest
except ImportError:
    pytest = None

from ai_services.tiktok_manager import get_tiktok_manager, TikTokManager


class TestTikTokManager:
    """Test suite for TikTok Manager"""
    
    def test_post_video(self):
        """Test posting a video to TikTok"""
        if pytest:
            pytest.mark.asyncio
        
        tiktok = get_tiktok_manager()
        result = asyncio.run(tiktok.post_video({
            "caption": "Test video",
            "hashtags": ["test", "demo"]
        }))
        
        assert result["status"] == "success"
        assert result["platform"] == "tiktok"
        assert "video_id" in result
        assert "posted_at" in result
    
    @pytest.mark.asyncio
    async def test_edit_video(self):
        """Test editing a video"""
        tiktok = get_tiktok_manager()
        
        # First post a video
        post_result = await tiktok.post_video({
            "caption": "Original caption",
            "hashtags": ["test"]
        })
        
        video_id = post_result["video_id"]
        
        # Then edit it
        edit_result = await tiktok.edit_video(video_id, {
            "caption": "Updated caption",
            "hashtags": ["updated"]
        })
        
        assert edit_result["status"] == "success"
        assert edit_result["video_id"] == video_id
    
    @pytest.mark.asyncio
    async def test_schedule_post(self):
        """Test scheduling a post"""
        tiktok = get_tiktok_manager()
        
        result = await tiktok.schedule_post(
            {
                "caption": "Scheduled post",
                "hashtags": ["scheduled"]
            },
            "2026-04-10T10:00:00Z"
        )
        
        assert result["status"] == "success"
        assert "scheduled_id" in result
        assert result["schedule_time"] == "2026-04-10T10:00:00Z"
    
    @pytest.mark.asyncio
    async def test_delete_video(self):
        """Test deleting a video"""
        tiktok = get_tiktok_manager()
        
        # Post a video
        post_result = await tiktok.post_video({
            "caption": "Video to delete",
            "hashtags": ["delete"]
        })
        
        video_id = post_result["video_id"]
        
        # Delete it
        delete_result = await tiktok.delete_video(video_id)
        
        assert delete_result["status"] == "success"
        assert delete_result["video_id"] == video_id
    
    @pytest.mark.asyncio
    async def test_video_analytics(self):
        """Test getting video analytics"""
        tiktok = get_tiktok_manager()
        
        # Post a video
        post_result = await tiktok.post_video({
            "caption": "Video for analytics",
            "hashtags": ["analytics"]
        })
        
        video_id = post_result["video_id"]
        
        # Get analytics
        analytics = await tiktok.get_video_analytics(video_id)
        
        assert analytics["status"] == "success"
        assert "analytics" in analytics
        assert "views" in analytics["analytics"]
        assert "likes" in analytics["analytics"]
        assert "comments" in analytics["analytics"]
        assert "shares" in analytics["analytics"]
    
    @pytest.mark.asyncio
    async def test_channel_analytics(self):
        """Test getting channel analytics"""
        tiktok = get_tiktok_manager()
        
        result = await tiktok.get_channel_analytics(30)
        
        assert result["status"] == "success"
        assert "analytics" in result
        assert result["analytics"]["total_videos"] >= 0
        assert "engagement_rate" in result["analytics"]
    
    @pytest.mark.asyncio
    async def test_moderate_comments(self):
        """Test comment moderation"""
        tiktok = get_tiktok_manager()
        
        # Post a video
        post_result = await tiktok.post_video({
            "caption": "Video with comments",
            "hashtags": ["comments"]
        })
        
        video_id = post_result["video_id"]
        
        # Get comments
        result = await tiktok.moderate_comments(video_id, "get")
        
        assert result["status"] == "success"
        assert "comments" in result
    
    @pytest.mark.asyncio
    async def test_trending_sounds(self):
        """Test getting trending sounds"""
        tiktok = get_tiktok_manager()
        
        result = await tiktok.get_trending_sounds(10)
        
        assert result["status"] == "success"
        assert "trending_sounds" in result
        assert len(result["trending_sounds"]) > 0
    
    @pytest.mark.asyncio
    async def test_trending_hashtags(self):
        """Test getting trending hashtags"""
        tiktok = get_tiktok_manager()
        
        result = await tiktok.get_trending_hashtags(10)
        
        assert result["status"] == "success"
        assert "trending_hashtags" in result
        assert len(result["trending_hashtags"]) > 0


async def run_manual_tests():
    """Run manual tests"""
    print("\n" + "="*60)
    print("Manual TikTok Integration Tests")
    print("="*60)
    
    tiktok = get_tiktok_manager()
    
    try:
        # Test 1: Post video
        print("\n[TEST 1] Posting video...")
        post_result = await tiktok.post_video({
            "caption": "🚀 Check out this amazing product!",
            "hashtags": ["viral", "trending", "foryou", "business"]
        })
        print("✓ Posted successfully")
        print(json.dumps(post_result, indent=2))
        video_id = post_result.get("video_id")
        
        # Test 2: Get video analytics
        print("\n[TEST 2] Getting video analytics...")
        analytics = await tiktok.get_video_analytics(video_id)
        print("✓ Analytics retrieved")
        print(json.dumps(analytics, indent=2))
        
        # Test 3: Edit video
        print("\n[TEST 3] Editing video...")
        edit_result = await tiktok.edit_video(video_id, {
            "caption": "🚀 Updated caption with more emojis! 🔥💯",
            "hashtags": ["updated", "viral"]
        })
        print("✓ Video edited")
        print(json.dumps(edit_result, indent=2))
        
        # Test 4: Get trending sounds
        print("\n[TEST 4] Getting trending sounds...")
        sounds = await tiktok.get_trending_sounds(5)
        print("✓ Trending sounds retrieved")
        print(json.dumps(sounds, indent=2))
        
        # Test 5: Get trending hashtags
        print("\n[TEST 5] Getting trending hashtags...")
        hashtags = await tiktok.get_trending_hashtags(5)
        print("✓ Trending hashtags retrieved")
        print(json.dumps(hashtags, indent=2))
        
        # Test 6: Moderate comments
        print("\n[TEST 6] Getting comments...")
        comments = await tiktok.moderate_comments(video_id)
        print("✓ Comments retrieved")
        print(json.dumps(comments, indent=2))
        
        # Test 7: Schedule post
        print("\n[TEST 7] Scheduling post...")
        scheduled = await tiktok.schedule_post({
            "caption": "Scheduled for tomorrow!",
            "hashtags": ["scheduled"]
        }, "2026-04-09T14:00:00Z")
        print("✓ Post scheduled")
        print(json.dumps(scheduled, indent=2))
        
        # Test 8: Get channel analytics
        print("\n[TEST 8] Getting channel analytics...")
        channel_analytics = await tiktok.get_channel_analytics(30)
        print("✓ Channel analytics retrieved")
        print(json.dumps(channel_analytics, indent=2))
        
        # Test 9: Delete video
        print("\n[TEST 9] Deleting video...")
        delete_result = await tiktok.delete_video(video_id)
        print("✓ Video deleted")
        print(json.dumps(delete_result, indent=2))
        
        print("\n" + "="*60)
        print("All tests completed successfully! ✓")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        raise


if __name__ == "__main__":
    # Run manual tests
    asyncio.run(run_manual_tests())
    
    # To run pytest tests:
    # pytest backend/test_tiktok_integration.py -v
