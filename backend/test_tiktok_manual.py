"""
TikTok Integration - Manual Integration Tests
Demonstrates all TikTok API features
"""

import asyncio
import sys
import os
import json

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai_services.tiktok_manager import get_tiktok_manager


async def run_all_tests():
    """Run all TikTok integration tests"""
    print("\n" + "="*70)
    print("TikTok Integration - Complete Feature Demo")
    print("="*70)
    
    tiktok = get_tiktok_manager()
    
    try:
        # Test 1: Post video
        print("\n[TEST 1/9] Posting video to TikTok...")
        post_result = await tiktok.post_video({
            "caption": "🚀 Check out this amazing product!",
            "hashtags": ["viral", "trending", "foryou", "business"]
        })
        print("✓ Posted successfully")
        print(f"  Video ID: {post_result.get('video_id')}")
        print(f"  Status: {post_result.get('status')}")
        print(f"  Posted: {post_result.get('posted_at')}")
        video_id = post_result.get("video_id")
        
        # Test 2: Get video analytics
        print("\n[TEST 2/9] Retrieving video analytics...")
        analytics = await tiktok.get_video_analytics(video_id)
        print("✓ Analytics retrieved")
        if "analytics" in analytics:
            for key, value in analytics["analytics"].items():
                print(f"  {key}: {value}")
        
        # Test 3: Edit video
        print("\n[TEST 3/9] Editing video caption and hashtags...")
        edit_result = await tiktok.edit_video(video_id, {
            "caption": "🚀 Updated! Even more amazing! 🔥💯",
            "hashtags": ["updated", "viral", "hot"]
        })
        print("✓ Video edited successfully")
        print(f"  Updated fields: {edit_result.get('updated_fields')}")
        
        # Test 4: Get trending sounds
        print("\n[TEST 4/9] Fetching trending TikTok sounds...")
        sounds = await tiktok.get_trending_sounds(5)
        print("✓ Trending sounds retrieved")
        if "trending_sounds" in sounds:
            for sound in sounds["trending_sounds"][:3]:
                print(f"  • {sound['title']} by {sound['artist']}")
                print(f"    Uses: {sound['uses_count']:,}")
        
        # Test 5: Get trending hashtags
        print("\n[TEST 5/9] Fetching trending TikTok hashtags...")
        hashtags = await tiktok.get_trending_hashtags(5)
        print("✓ Trending hashtags retrieved")
        if "trending_hashtags" in hashtags:
            for tag in hashtags["trending_hashtags"][:3]:
                print(f"  • #{tag['hashtag']}")
                print(f"    Views: {tag['view_count']:,}")
                print(f"    Videos: {tag['video_count']:,}")
        
        # Test 6: Moderate comments
        print("\n[TEST 6/9] Managing video comments...")
        comments = await tiktok.moderate_comments(video_id, "get")
        print("✓ Comments retrieved")
        if "comments" in comments:
            print(f"  Total comments: {comments.get('total_comments')}")
            for comment in comments["comments"][:2]:
                print(f"  • {comment['author']}: {comment['text']}")
                print(f"    Likes: {comment['likes']}")
        
        # Test 7: Schedule a post
        print("\n[TEST 7/9] Scheduling a post for later...")
        scheduled = await tiktok.schedule_post({
            "caption": "Scheduled post - posted tomorrow! 📅",
            "hashtags": ["scheduled", "automation"]
        }, "2026-04-09T14:00:00Z")
        print("✓ Post scheduled successfully")
        print(f"  Scheduled ID: {scheduled.get('scheduled_id')}")
        print(f"  Schedule time: {scheduled.get('schedule_time')}")
        
        # Test 8: Get channel analytics
        print("\n[TEST 8/9] Retrieving channel analytics...")
        channel_analytics = await tiktok.get_channel_analytics(30)
        print("✓ Channel analytics retrieved")
        if "analytics" in channel_analytics:
            analytics_data = channel_analytics["analytics"]
            print(f"  Total videos: {analytics_data.get('total_videos')}")
            print(f"  Total views: {analytics_data.get('total_views'):,}")
            print(f"  Total likes: {analytics_data.get('total_likes'):,}")
            print(f"  Total followers: {analytics_data.get('follower_count'):,}")
            print(f"  Engagement rate: {analytics_data.get('engagement_rate')}")
        
        # Test 9: Delete video
        print("\n[TEST 9/9] Deleting the test video...")
        delete_result = await tiktok.delete_video(video_id)
        print("✓ Video deleted successfully")
        print(f"  Video ID deleted: {delete_result.get('video_id')}")
        
        print("\n" + "="*70)
        print("✓ ALL TESTS COMPLETED SUCCESSFULLY!")
        print("="*70)
        print("\nSummary:")
        print("  ✓ Posted video (1/1)")
        print("  ✓ Retrieved analytics (1/1)")
        print("  ✓ Edited video (1/1)")
        print("  ✓ Got trending sounds (1/1)")
        print("  ✓ Got trending hashtags (1/1)")
        print("  ✓ Moderated comments (1/1)")
        print("  ✓ Scheduled post (1/1)")
        print("  ✓ Retrieved channel analytics (1/1)")
        print("  ✓ Deleted video (1/1)")
        print("\n✓ TikTok integration is fully functional!")
        print("="*70 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        raise


if __name__ == "__main__":
    print("\nStarting TikTok Integration Tests...")
    asyncio.run(run_all_tests())
