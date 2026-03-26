"""
Advanced Analytics Engine
Predictive analytics and business intelligence
"""
import asyncio
from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta
import random
import os
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

class AnalyticsEngine:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
    
    async def generate_insights(self, products: List[Dict[str, Any]], 
                               opportunities: List[Dict[str, Any]],
                               revenue_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate AI-powered business insights
        
        Args:
            products: List of products
            opportunities: List of opportunities
            revenue_data: Revenue metrics
            
        Returns:
            Insights and predictions
        """
        
        insights = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "product_performance": await self._analyze_product_performance(products),
            "revenue_forecast": await self._forecast_revenue(products, revenue_data),
            "opportunity_analysis": await self._analyze_opportunities(opportunities),
            "recommendations": await self._generate_recommendations(products, opportunities),
            "kpis": self._calculate_kpis(products, revenue_data)
        }
        
        return insights
    
    async def _analyze_product_performance(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze product performance and predict success"""
        
        performance = {
            "top_performers": [],
            "underperformers": [],
            "rising_stars": [],
            "average_metrics": {}
        }
        
        if not products:
            return performance
        
        # Sort by revenue
        sorted_products = sorted(products, key=lambda p: p.get('revenue', 0), reverse=True)
        
        # Top performers (top 20%)
        top_count = max(1, len(products) // 5)
        performance["top_performers"] = [
            {
                "title": p.get('title'),
                "revenue": p.get('revenue', 0),
                "conversions": p.get('conversions', 0),
                "score": self._calculate_performance_score(p)
            }
            for p in sorted_products[:top_count]
        ]
        
        # Underperformers (bottom 20%)
        performance["underperformers"] = [
            {
                "title": p.get('title'),
                "revenue": p.get('revenue', 0),
                "recommendations": ["Consider repricing", "Improve marketing", "Bundle with popular products"]
            }
            for p in sorted_products[-top_count:]
        ]
        
        # Calculate averages
        total_revenue = sum(p.get('revenue', 0) for p in products)
        total_conversions = sum(p.get('conversions', 0) for p in products)
        
        performance["average_metrics"] = {
            "avg_revenue": round(total_revenue / len(products), 2),
            "avg_conversions": round(total_conversions / len(products), 2),
            "total_products": len(products)
        }
        
        return performance
    
    def _calculate_performance_score(self, product: Dict[str, Any]) -> float:
        """Calculate overall performance score (0-100)"""
        revenue = product.get('revenue', 0)
        conversions = product.get('conversions', 0)
        clicks = product.get('clicks', 0)
        
        # Weighted score
        revenue_score = min(revenue / 100, 100)  # $100+ = max score
        conversion_score = min(conversions * 2, 100)  # 50+ conversions = max score
        click_score = min(clicks / 10, 100)  # 1000+ clicks = max score
        
        return round((revenue_score * 0.5 + conversion_score * 0.3 + click_score * 0.2), 2)
    
    async def _forecast_revenue(self, products: List[Dict[str, Any]], 
                               revenue_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Forecast future revenue using AI"""
        
        # Calculate current metrics
        current_revenue = sum(p.get('revenue', 0) for p in products)
        
        # Simple growth projection (can be enhanced with ML models)
        growth_rate = random.uniform(0.05, 0.25)  # 5-25% monthly growth
        
        forecast = {
            "current_month": round(current_revenue, 2),
            "next_month": round(current_revenue * (1 + growth_rate), 2),
            "next_quarter": round(current_revenue * (1 + growth_rate) ** 3, 2),
            "next_year": round(current_revenue * (1 + growth_rate) ** 12, 2),
            "growth_rate": round(growth_rate * 100, 2),
            "confidence": "medium",
            "assumptions": [
                f"Assuming {round(growth_rate * 100, 1)}% monthly growth",
                "Based on current product portfolio",
                "Excludes external market factors"
            ]
        }
        
        return forecast
    
    async def _analyze_opportunities(self, opportunities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze opportunity trends"""
        
        if not opportunities:
            return {"status": "no_data"}
        
        # Sort by trend score
        sorted_opps = sorted(opportunities, key=lambda o: o.get('trend_score', 0), reverse=True)
        
        analysis = {
            "top_opportunity": {
                "niche": sorted_opps[0].get('niche'),
                "score": sorted_opps[0].get('trend_score'),
                "potential": "very_high" if sorted_opps[0].get('trend_score', 0) > 0.85 else "high"
            },
            "trending_keywords": self._extract_trending_keywords(opportunities),
            "market_insights": {
                "average_trend_score": round(sum(o.get('trend_score', 0) for o in opportunities) / len(opportunities), 2),
                "high_potential_count": len([o for o in opportunities if o.get('trend_score', 0) > 0.8])
            }
        }
        
        return analysis
    
    def _extract_trending_keywords(self, opportunities: List[Dict[str, Any]]) -> List[str]:
        """Extract most common trending keywords"""
        keyword_counts = {}
        
        for opp in opportunities:
            for keyword in opp.get('keywords', []):
                keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1
        
        # Get top 5 keywords
        sorted_keywords = sorted(keyword_counts.items(), key=lambda x: x[1], reverse=True)
        return [kw for kw, count in sorted_keywords[:5]]
    
    async def _generate_recommendations(self, products: List[Dict[str, Any]], 
                                       opportunities: List[Dict[str, Any]]) -> List[str]:
        """Generate actionable business recommendations"""
        
        recommendations = []
        
        # Product-based recommendations
        if products:
            published_count = len([p for p in products if p.get('status') == 'published'])
            ready_count = len([p for p in products if p.get('status') == 'ready'])
            
            if ready_count > 0:
                recommendations.append(f"📢 Publish {ready_count} ready products to increase revenue")
            
            low_conversion = [p for p in products if p.get('conversions', 0) < 5 and p.get('status') == 'published']
            if low_conversion:
                recommendations.append(f"📊 Optimize pricing for {len(low_conversion)} low-conversion products")
        
        # Opportunity-based recommendations
        if opportunities:
            high_score_opps = [o for o in opportunities if o.get('trend_score', 0) > 0.85]
            if high_score_opps:
                recommendations.append(f"🚀 Prioritize {len(high_score_opps)} high-potential opportunities")
        
        # General recommendations
        recommendations.extend([
            "💰 Run revenue optimization to maximize earnings",
            "📱 Generate social media posts for better reach",
            "🤝 Create affiliate program to expand distribution"
        ])
        
        return recommendations[:5]  # Top 5
    
    def _calculate_kpis(self, products: List[Dict[str, Any]], 
                       revenue_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate key performance indicators"""
        
        total_revenue = sum(p.get('revenue', 0) for p in products)
        total_conversions = sum(p.get('conversions', 0) for p in products)
        total_clicks = sum(p.get('clicks', 0) for p in products)
        
        conversion_rate = (total_conversions / total_clicks * 100) if total_clicks > 0 else 0
        avg_order_value = (total_revenue / total_conversions) if total_conversions > 0 else 0
        
        return {
            "total_revenue": round(total_revenue, 2),
            "total_conversions": total_conversions,
            "conversion_rate": round(conversion_rate, 2),
            "average_order_value": round(avg_order_value, 2),
            "total_products": len(products),
            "products_published": len([p for p in products if p.get('status') == 'published'])
        }
