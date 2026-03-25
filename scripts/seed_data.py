#!/usr/bin/env python3
"""
Seed script to populate the AI Empire dashboard with sample data
"""
import asyncio
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
import random
import os
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent / "backend"
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    """Seed the database with sample data"""
    print("🌱 Starting to seed database...")
    
    # Clear existing data
    await db.products.delete_many({})
    await db.opportunities.delete_many({})
    await db.ai_tasks.delete_many({})
    await db.revenue_metrics.delete_many({})
    print("✅ Cleared existing data")
    
    # Sample products
    products = [
        {
            "id": "prod-001",
            "title": "The Ultimate Guide to AI Automation",
            "description": "A comprehensive eBook covering AI automation strategies for businesses",
            "product_type": "ebook",
            "content": "Full eBook content here...",
            "cover_image": None,
            "status": "published",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat(),
            "revenue": 1247.50,
            "clicks": 342,
            "conversions": 25,
            "price": 49.99,
            "tags": ["AI", "automation", "business"],
            "marketplace_links": [
                {"platform": "Amazon KDP", "url": "https://amazon.com/dp/prod-001", "status": "ready"},
                {"platform": "Udemy", "url": "https://udemy.com/course/ai-automation-guide", "status": "ready"},
                {"platform": "Shopify", "url": "https://mystore.shopify.com/products/prod-001", "status": "ready"}
            ]
        },
        {
            "id": "prod-002",
            "title": "Social Media Marketing Masterclass 2025",
            "description": "Complete course on modern social media marketing strategies",
            "product_type": "course",
            "content": "Course modules and videos...",
            "cover_image": None,
            "status": "published",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=5)).isoformat(),
            "revenue": 2890.00,
            "clicks": 567,
            "conversions": 58,
            "price": 49.99,
            "tags": ["marketing", "social media", "course"],
            "marketplace_links": [
                {"platform": "Udemy", "url": "https://udemy.com/course/social-media-masterclass", "status": "ready"},
                {"platform": "Shopify", "url": "https://mystore.shopify.com/products/prod-002", "status": "ready"}
            ]
        },
        {
            "id": "prod-003",
            "title": "Productivity Planner Pro 2025",
            "description": "Professional daily planner with goal tracking and habit builder",
            "product_type": "planner",
            "content": "PDF planner with 365 pages...",
            "cover_image": None,
            "status": "ready",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "revenue": 0.0,
            "clicks": 0,
            "conversions": 0,
            "price": 19.99,
            "tags": ["productivity", "planner", "goals"],
            "marketplace_links": [
                {"platform": "Amazon KDP", "url": "https://amazon.com/dp/prod-003", "status": "ready"},
                {"platform": "Shopify", "url": "https://mystore.shopify.com/products/prod-003", "status": "ready"}
            ]
        },
        {
            "id": "prod-004",
            "title": "Business Presentation Templates Bundle",
            "description": "50+ professional PowerPoint and Google Slides templates",
            "product_type": "template",
            "content": "Template files...",
            "cover_image": None,
            "status": "published",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=12)).isoformat(),
            "revenue": 567.80,
            "clicks": 234,
            "conversions": 19,
            "price": 29.99,
            "tags": ["templates", "business", "presentations"],
            "marketplace_links": [
                {"platform": "Shopify", "url": "https://mystore.shopify.com/products/prod-004", "status": "ready"}
            ]
        },
        {
            "id": "prod-005",
            "title": "Mindfulness & Meditation Guide",
            "description": "21-day program to master mindfulness and meditation",
            "product_type": "ebook",
            "content": "eBook content with exercises...",
            "cover_image": None,
            "status": "draft",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "revenue": 0.0,
            "clicks": 0,
            "conversions": 0,
            "price": 24.99,
            "tags": ["mindfulness", "meditation", "wellness"],
            "marketplace_links": [
                {"platform": "Amazon KDP", "url": "https://amazon.com/dp/prod-005", "status": "ready"}
            ]
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✅ Created {len(products)} products")
    
    # Sample opportunities
    opportunities = [
        {
            "id": "opp-001",
            "niche": "AI-Powered Productivity Tools",
            "trend_score": 0.92,
            "keywords": ["AI productivity", "automation", "workflow"],
            "status": "identified",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "suggested_products": ["AI Task Manager App", "Automation Guide"],
            "market_size": "Large",
            "competition_level": "Medium"
        },
        {
            "id": "opp-002",
            "niche": "Sustainable Living Guides",
            "trend_score": 0.87,
            "keywords": ["sustainability", "eco-friendly", "green living"],
            "status": "identified",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=3)).isoformat(),
            "suggested_products": ["Zero Waste Guide", "Eco Home Planner"],
            "market_size": "Growing",
            "competition_level": "Low"
        },
        {
            "id": "opp-003",
            "niche": "Remote Work Excellence",
            "trend_score": 0.85,
            "keywords": ["remote work", "digital nomad", "work from home"],
            "status": "in_progress",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=6)).isoformat(),
            "suggested_products": ["Remote Work Toolkit", "Virtual Team Course"],
            "market_size": "Large",
            "competition_level": "High"
        },
        {
            "id": "opp-004",
            "niche": "Personal Finance for Millennials",
            "trend_score": 0.81,
            "keywords": ["finance", "investing", "budgeting"],
            "status": "identified",
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=8)).isoformat(),
            "suggested_products": ["Budget Planner", "Investment Guide"],
            "market_size": "Very Large",
            "competition_level": "High"
        }
    ]
    
    await db.opportunities.insert_many(opportunities)
    print(f"✅ Created {len(opportunities)} opportunities")
    
    # Sample AI tasks
    ai_tasks = [
        {
            "id": "task-001",
            "task_type": "generate_book",
            "ai_team": "book_writer",
            "status": "completed",
            "input_data": {"niche": "AI Automation", "keywords": ["AI", "automation"]},
            "output_data": {"product_id": "prod-001", "title": "The Ultimate Guide to AI Automation"},
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=3)).isoformat(),
            "completed_at": (datetime.now(timezone.utc) - timedelta(hours=2)).isoformat(),
            "error_message": None
        },
        {
            "id": "task-002",
            "task_type": "scout_opportunity",
            "ai_team": "opportunity_scout",
            "status": "completed",
            "input_data": {"sources": ["social media", "marketplaces"]},
            "output_data": {"opportunities_found": 4},
            "created_at": (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat(),
            "completed_at": datetime.now(timezone.utc).isoformat(),
            "error_message": None
        },
        {
            "id": "task-003",
            "task_type": "optimize_pricing",
            "ai_team": "revenue_optimizer",
            "status": "in_progress",
            "input_data": {"product_ids": ["prod-001", "prod-002"]},
            "output_data": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "completed_at": None,
            "error_message": None
        },
        {
            "id": "task-004",
            "task_type": "generate_course",
            "ai_team": "course_creator",
            "status": "pending",
            "input_data": {"topic": "Social Media Marketing", "duration": "5 hours"},
            "output_data": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "completed_at": None,
            "error_message": None
        }
    ]
    
    await db.ai_tasks.insert_many(ai_tasks)
    print(f"✅ Created {len(ai_tasks)} AI tasks")
    
    print("🎉 Database seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
