"""
Multi-Platform Ad Campaign Manager
Orchestrates advertising campaigns across Google Ads, Facebook Ads, TikTok Ads, 
LinkedIn Ads, Pinterest Ads, Amazon Ads, and YouTube Ads
"""

import os
import json
import uuid
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timezone
from enum import Enum
import logging
import asyncio
import aiohttp

logger = logging.getLogger(__name__)


class AdPlatform(Enum):
    """Supported ad platforms"""
    GOOGLE_ADS = "google_ads"
    FACEBOOK_ADS = "facebook_ads"
    TIKTOK_ADS = "tiktok_ads"
    LINKEDIN_ADS = "linkedin_ads"
    PINTEREST_ADS = "pinterest_ads"
    AMAZON_ADS = "amazon_ads"
    YOUTUBE_ADS = "youtube_ads"


class CampaignStatus(Enum):
    """Campaign status states"""
    DRAFT = "draft"
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"


class MultiPlatformAdCampaignManager:
    """Manage advertising campaigns across all platforms"""
    
    def __init__(self):
        self.db = None
        self.api_keys = {}
        self.platform_managers = {}
    
    async def set_db(self, database):
        """Set database connection"""
        self.db = database
        
        # Initialize platform managers
        self.platform_managers = {
            AdPlatform.GOOGLE_ADS: GoogleAdsManager(),
            AdPlatform.FACEBOOK_ADS: FacebookAdsManager(),
            AdPlatform.TIKTOK_ADS: TikTokAdsManager(),
            AdPlatform.LINKEDIN_ADS: LinkedInAdsManager(),
            AdPlatform.PINTEREST_ADS: PinterestAdsManager(),
            AdPlatform.AMAZON_ADS: AmazonAdsManager(),
            AdPlatform.YOUTUBE_ADS: YouTubeAdsManager()
        }
    
    async def create_campaign(self,
                              product_id: str,
                              platforms: List[str],
                              budget: float,
                              daily_budget: float,
                              duration_days: int = 30,
                              target_audience: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Create and launch advertising campaigns across multiple platforms
        
        Args:
            product_id: Product to advertise
            platforms: List of platform names (google_ads, facebook_ads, etc)
            budget: Total campaign budget
            daily_budget: Daily budget per platform
            duration_days: Campaign duration
            target_audience: Audience targeting parameters
            
        Returns:
            Campaign creation result with platform-specific campaign IDs
        """
        
        try:
            if not self.db:
                return {"error": "Database not configured"}
            
            # Get product
            product = await self.db.products.find_one(
                {"id": product_id},
                {"_id": 0}
            )
            
            if not product:
                return {"error": f"Product {product_id} not found"}
            
            # Create campaign record
            campaign_id = str(uuid.uuid4())
            campaign_record = {
                "campaign_id": campaign_id,
                "product_id": product_id,
                "product_title": product.get("title"),
                "platforms": platforms,
                "total_budget": budget,
                "daily_budget": daily_budget,
                "duration_days": duration_days,
                "status": CampaignStatus.PENDING.value,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "started_at": None,
                "ended_at": None,
                "target_audience": target_audience or {},
                "platform_campaigns": {},
                "total_spend": 0.0,
                "total_impressions": 0,
                "total_clicks": 0,
                "total_conversions": 0,
                "total_revenue": 0.0,
                "roi": 0.0
            }
            
            # Generate ad creative
            ad_creative = await self._generate_ad_creative(product)
            campaign_record["ad_creative"] = ad_creative
            
            # Launch campaigns on each platform
            results = {}
            for platform in platforms:
                try:
                    platform_enum = AdPlatform[platform.upper().replace("_", "")]
                    manager = self.platform_managers.get(platform_enum)
                    
                    if not manager:
                        results[platform] = {"status": "error", "message": "Platform not supported"}
                        continue
                    
                    platform_result = await manager.create_campaign(
                        product=product,
                        campaign_id=campaign_id,
                        daily_budget=daily_budget,
                        duration_days=duration_days,
                        ad_creative=ad_creative,
                        target_audience=target_audience
                    )
                    
                    results[platform] = platform_result
                    campaign_record["platform_campaigns"][platform] = platform_result
                
                except Exception as e:
                    logger.error(f"Failed to create campaign on {platform}: {str(e)}")
                    results[platform] = {"status": "error", "message": str(e)}
            
            # Save campaign
            await self.db.campaigns.insert_one(campaign_record)
            
            return {
                "campaign_id": campaign_id,
                "status": "created",
                "product_id": product_id,
                "platforms_created": results,
                "total_budget": budget,
                "daily_budget": daily_budget
            }
        
        except Exception as e:
            logger.error(f"Failed to create campaign: {str(e)}")
            return {"error": str(e)}
    
    async def get_campaign_performance(self, campaign_id: str) -> Dict[str, Any]:
        """Get performance metrics for a campaign"""
        
        try:
            if not self.db:
                return {"error": "Database not configured"}
            
            campaign = await self.db.campaigns.find_one(
                {"campaign_id": campaign_id},
                {"_id": 0}
            )
            
            if not campaign:
                return {"error": "Campaign not found"}
            
            # Aggregate performance from all platforms
            total_spend = 0.0
            total_impressions = 0
            total_clicks = 0
            total_conversions = 0
            platform_metrics = {}
            
            for platform, platform_campaign in campaign.get("platform_campaigns", {}).items():
                try:
                    platform_enum = AdPlatform[platform.upper().replace("_", "")]
                    manager = self.platform_managers.get(platform_enum)
                    
                    if manager and "platform_id" in platform_campaign:
                        metrics = await manager.get_campaign_metrics(
                            campaign_id=platform_campaign.get("platform_id"),
                            campaign_name=f"{campaign_id}_{platform}"
                        )
                        
                        platform_metrics[platform] = metrics
                        total_spend += metrics.get("spend", 0)
                        total_impressions += metrics.get("impressions", 0)
                        total_clicks += metrics.get("clicks", 0)
                        total_conversions += metrics.get("conversions", 0)
                
                except Exception as e:
                    logger.warning(f"Failed to fetch metrics for {platform}: {str(e)}")
            
            # Calculate aggregates
            ctr = (total_clicks / max(total_impressions, 1)) * 100
            cpc = total_spend / max(total_clicks, 1)
            conversion_rate = (total_conversions / max(total_clicks, 1)) * 100
            cost_per_conversion = total_spend / max(total_conversions, 1)
            
            product = await self.db.products.find_one(
                {"id": campaign.get("product_id")},
                {"_id": 0}
            )
            
            roi = 0.0
            if cost_per_conversion > 0 and product:
                profit_per_sale = product.get("price", 0) - product.get("cost", 0)
                roi = ((profit_per_sale - cost_per_conversion) / max(cost_per_conversion, 1)) * 100
            
            return {
                "campaign_id": campaign_id,
                "product_id": campaign.get("product_id"),
                "product_title": campaign.get("product_title"),
                "status": campaign.get("status"),
                "created_at": campaign.get("created_at"),
                "total_budget": campaign.get("total_budget"),
                "platform_count": len(campaign.get("platform_campaigns", {})),
                "aggregated_metrics": {
                    "total_spend": total_spend,
                    "total_impressions": total_impressions,
                    "total_clicks": total_clicks,
                    "total_conversions": total_conversions,
                    "ctr_percent": ctr,
                    "cpc": cpc,
                    "conversion_rate_percent": conversion_rate,
                    "cost_per_conversion": cost_per_conversion,
                    "estimated_roi_percent": roi,
                    "efficiency_score": self._calculate_efficiency_score(ctr, conversion_rate, roi)
                },
                "platform_metrics": platform_metrics
            }
        
        except Exception as e:
            logger.error(f"Failed to get campaign performance: {str(e)}")
            return {"error": str(e)}
    
    async def pause_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """Pause a campaign across all platforms"""
        
        try:
            if not self.db:
                return {"error": "Database not configured"}
            
            campaign = await self.db.campaigns.find_one(
                {"campaign_id": campaign_id},
                {"_id": 0}
            )
            
            if not campaign:
                return {"error": "Campaign not found"}
            
            results = {}
            
            # Pause on each platform
            for platform, platform_campaign in campaign.get("platform_campaigns", {}).items():
                try:
                    platform_enum = AdPlatform[platform.upper().replace("_", "")]
                    manager = self.platform_managers.get(platform_enum)
                    
                    if manager and "platform_id" in platform_campaign:
                        result = await manager.pause_campaign(
                            campaign_id=platform_campaign.get("platform_id")
                        )
                        results[platform] = result
                except Exception as e:
                    results[platform] = {"status": "error", "message": str(e)}
            
            # Update campaign status
            await self.db.campaigns.update_one(
                {"campaign_id": campaign_id},
                {"$set": {"status": CampaignStatus.PAUSED.value}}
            )
            
            return {
                "campaign_id": campaign_id,
                "status": "paused",
                "platform_results": results
            }
        
        except Exception as e:
            logger.error(f"Failed to pause campaign: {str(e)}")
            return {"error": str(e)}
    
    async def optimize_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """Optimize campaign performance by adjusting bids/budgets"""
        
        try:
            if not self.db:
                return {"error": "Database not configured"}
            
            performance = await self.get_campaign_performance(campaign_id)
            
            if "error" in performance:
                return performance
            
            campaign = await self.db.campaigns.find_one(
                {"campaign_id": campaign_id},
                {"_id": 0}
            )
            
            metrics = performance.get("aggregated_metrics", {})
            recommendations = []
            
            # Analyze performance and generate recommendations
            ctr = metrics.get("ctr_percent", 0)
            conversion_rate = metrics.get("conversion_rate_percent", 0)
            total_spend = metrics.get("total_spend", 0)
            
            # CTR analysis
            if ctr < 2.0:
                recommendations.append({
                    "type": "creative",
                    "action": "Refresh ad creative - CTR below 2%",
                    "expected_impact": "Increase CTR by 30-50%"
                })
            
            # Conversion rate analysis
            if conversion_rate < 1.0:
                recommendations.append({
                    "type": "audience",
                    "action": "Refine audience targeting - Conversion rate below 1%",
                    "expected_impact": "Increase conversion rate by 20-40%"
                })
            
            # Budget allocation
            if total_spend > 0:
                platform_metrics = performance.get("platform_metrics", {})
                best_performer = max(
                    platform_metrics.items(),
                    key=lambda x: x[1].get("roi", 0),
                    default=(None, {})
                )
                
                if best_performer[0]:
                    recommendations.append({
                        "type": "budget",
                        "action": f"Increase budget to {best_performer[0]} - Best ROI platform",
                        "expected_impact": f"Increase overall ROI by 10-20%"
                    })
            
            return {
                "campaign_id": campaign_id,
                "current_metrics": metrics,
                "recommendations": recommendations,
                "optimization_score": self._calculate_optimization_score(metrics)
            }
        
        except Exception as e:
            logger.error(f"Failed to optimize campaign: {str(e)}")
            return {"error": str(e)}
    
    async def list_campaigns(self,
                             product_id: Optional[str] = None,
                             status: Optional[str] = None,
                             limit: int = 20) -> List[Dict[str, Any]]:
        """List campaigns"""
        
        try:
            if not self.db:
                return []
            
            query = {}
            if product_id:
                query["product_id"] = product_id
            if status:
                query["status"] = status
            
            campaigns = await self.db.campaigns.find(
                query,
                {"_id": 0}
            ).sort("created_at", -1).to_list(limit)
            
            return campaigns
        
        except Exception as e:
            logger.error(f"Failed to list campaigns: {str(e)}")
            return []
    
    async def _generate_ad_creative(self, product: Dict[str, Any]) -> Dict[str, str]:
        """Generate ad creative for the product"""
        
        return {
            "headline_short": product.get("title", "")[:30],
            "headline_long": product.get("title", ""),
            "description": product.get("description", "")[:120],
            "cta": "Shop Now",
            "images": product.get("images", [])[:5],
            "video_url": None,
            "estimated_ctr": 2.5,
            "estimated_conversion_rate": 1.2
        }
    
    def _calculate_efficiency_score(self,
                                   ctr: float,
                                   conversion_rate: float,
                                   roi: float) -> float:
        """Calculate overall campaign efficiency 0-100"""
        
        score = 0
        
        # CTR component (max 30 points)
        if ctr >= 5.0:
            score += 30
        elif ctr >= 3.0:
            score += 20
        elif ctr >= 2.0:
            score += 10
        
        # Conversion rate component (max 40 points)
        if conversion_rate >= 3.0:
            score += 40
        elif conversion_rate >= 2.0:
            score += 25
        elif conversion_rate >= 1.0:
            score += 15
        
        # ROI component (max 30 points)
        if roi >= 200:
            score += 30
        elif roi >= 100:
            score += 20
        elif roi >= 0:
            score += 10
        
        return min(score, 100)
    
    def _calculate_optimization_score(self, metrics: Dict[str, Any]) -> float:
        """Calculate how much margin for optimization exists"""
        
        score = 100
        
        ctr = metrics.get("ctr_percent", 0)
        if ctr >= 3.0:
            score -= 10
        elif ctr >= 2.0:
            score -= 20
        
        conversion_rate = metrics.get("conversion_rate_percent", 0)
        if conversion_rate >= 2.0:
            score -= 10
        elif conversion_rate >= 1.0:
            score -= 20
        
        return max(score, 0)


# Platform-specific managers


class GoogleAdsManager:
    """Google Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        """Create Google Ads campaign"""
        # Mock implementation - replace with real Google Ads API calls
        return {
            "status": "created",
            "platform_id": f"google_{uuid.uuid4()}",
            "platform": "google_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        """Get campaign metrics"""
        return {
            "spend": 150.0,
            "impressions": 5000,
            "clicks": 125,
            "conversions": 15,
            "roi": 180.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        """Pause campaign"""
        return {"status": "paused"}


class FacebookAdsManager:
    """Facebook Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        return {
            "status": "created",
            "platform_id": f"fb_{uuid.uuid4()}",
            "platform": "facebook_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        return {
            "spend": 200.0,
            "impressions": 8000,
            "clicks": 180,
            "conversions": 22,
            "roi": 150.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        return {"status": "paused"}


class TikTokAdsManager:
    """TikTok Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        return {
            "status": "created",
            "platform_id": f"tiktok_{uuid.uuid4()}",
            "platform": "tiktok_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        return {
            "spend": 100.0,
            "impressions": 12000,
            "clicks": 240,
            "conversions": 28,
            "roi": 220.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        return {"status": "paused"}


class LinkedInAdsManager:
    """LinkedIn Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        return {
            "status": "created",
            "platform_id": f"li_{uuid.uuid4()}",
            "platform": "linkedin_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        return {
            "spend": 250.0,
            "impressions": 3000,
            "clicks": 90,
            "conversions": 9,
            "roi": 120.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        return {"status": "paused"}


class PinterestAdsManager:
    """Pinterest Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        return {
            "status": "created",
            "platform_id": f"pin_{uuid.uuid4()}",
            "platform": "pinterest_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        return {
            "spend": 120.0,
            "impressions": 6000,
            "clicks": 150,
            "conversions": 18,
            "roi": 160.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        return {"status": "paused"}


class AmazonAdsManager:
    """Amazon Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        return {
            "status": "created",
            "platform_id": f"amz_{uuid.uuid4()}",
            "platform": "amazon_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        return {
            "spend": 180.0,
            "impressions": 9000,
            "clicks": 270,
            "conversions": 40,
            "roi": 280.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        return {"status": "paused"}


class YouTubeAdsManager:
    """YouTube Ads API interface"""
    
    async def create_campaign(self, **kwargs) -> Dict[str, Any]:
        return {
            "status": "created",
            "platform_id": f"yt_{uuid.uuid4()}",
            "platform": "youtube_ads"
        }
    
    async def get_campaign_metrics(self, **kwargs) -> Dict[str, Any]:
        return {
            "spend": 170.0,
            "impressions": 15000,
            "clicks": 300,
            "conversions": 35,
            "roi": 200.0
        }
    
    async def pause_campaign(self, **kwargs) -> Dict[str, Any]:
        return {"status": "paused"}


async def get_campaign_manager() -> MultiPlatformAdCampaignManager:
    """Get or create campaign manager"""
    return MultiPlatformAdCampaignManager()
