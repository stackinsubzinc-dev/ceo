from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Enums
class ProductType(str, Enum):
    EBOOK = "ebook"
    COURSE = "course"
    TEMPLATE = "template"
    PLANNER = "planner"
    MINI_APP = "mini_app"

class ProductStatus(str, Enum):
    DRAFT = "draft"
    READY = "ready"
    PUBLISHED = "published"
    RETIRED = "retired"

class OpportunityStatus(str, Enum):
    IDENTIFIED = "identified"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"

class AITaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

class AITeam(str, Enum):
    OPPORTUNITY_SCOUT = "opportunity_scout"
    BOOK_WRITER = "book_writer"
    COURSE_CREATOR = "course_creator"
    PRODUCT_CREATOR = "product_creator"
    REVENUE_OPTIMIZER = "revenue_optimizer"
    SOCIAL_MEDIA = "social_media"
    SALES_LAUNCH = "sales_launch"
    AFFILIATE_MANAGER = "affiliate_manager"
    MICRO_TASKFORCE = "micro_taskforce"


# Define Models
class MarketplaceLink(BaseModel):
    platform: str
    url: str
    status: str = "ready"

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    product_type: ProductType
    content: Optional[str] = None
    cover_image: Optional[str] = None
    status: ProductStatus = ProductStatus.DRAFT
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    revenue: float = 0.0
    clicks: int = 0
    conversions: int = 0
    marketplace_links: List[MarketplaceLink] = []
    tags: List[str] = []
    price: float = 0.0

class ProductCreate(BaseModel):
    title: str
    description: str
    product_type: ProductType
    content: Optional[str] = None
    cover_image: Optional[str] = None
    price: float = 9.99
    tags: List[str] = []

class Opportunity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    niche: str
    trend_score: float
    keywords: List[str]
    status: OpportunityStatus = OpportunityStatus.IDENTIFIED
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    suggested_products: List[str] = []
    market_size: Optional[str] = None
    competition_level: Optional[str] = None

class OpportunityCreate(BaseModel):
    niche: str
    trend_score: float
    keywords: List[str]
    suggested_products: List[str] = []
    market_size: Optional[str] = None
    competition_level: Optional[str] = None

class AITask(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_type: str
    ai_team: AITeam
    status: AITaskStatus = AITaskStatus.PENDING
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class AITaskCreate(BaseModel):
    task_type: str
    ai_team: AITeam
    input_data: Dict[str, Any]

class RevenueMetric(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    total_revenue: float = 0.0
    total_conversions: int = 0
    total_clicks: int = 0
    top_products: List[Dict[str, Any]] = []
    revenue_by_type: Dict[str, float] = {}

class DashboardStats(BaseModel):
    total_products: int
    products_today: int
    total_revenue: float
    revenue_today: float
    pending_tasks: int
    active_opportunities: int


# API Routes
@api_router.get("/")
async def root():
    return {"message": "CEO AI Empire - Autonomous Product Generation System"}


# Dashboard Stats
@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Get overall dashboard statistics"""
    try:
        # Count products
        total_products = await db.products.count_documents({})
        
        # Products created today
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        products_today = await db.products.count_documents({
            "created_at": {"$gte": today_start.isoformat()}
        })
        
        # Calculate revenue
        pipeline = [
            {"$group": {"_id": None, "total": {"$sum": "$revenue"}}}
        ]
        revenue_result = await db.products.aggregate(pipeline).to_list(1)
        total_revenue = revenue_result[0]["total"] if revenue_result else 0.0
        
        # Revenue today
        revenue_today_pipeline = [
            {"$match": {"created_at": {"$gte": today_start.isoformat()}}},
            {"$group": {"_id": None, "total": {"$sum": "$revenue"}}}
        ]
        revenue_today_result = await db.products.aggregate(revenue_today_pipeline).to_list(1)
        revenue_today = revenue_today_result[0]["total"] if revenue_today_result else 0.0
        
        # Pending tasks
        pending_tasks = await db.ai_tasks.count_documents({"status": "pending"})
        
        # Active opportunities
        active_opportunities = await db.opportunities.count_documents({"status": "identified"})
        
        return DashboardStats(
            total_products=total_products,
            products_today=products_today,
            total_revenue=total_revenue,
            revenue_today=revenue_today,
            pending_tasks=pending_tasks,
            active_opportunities=active_opportunities
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Products CRUD
@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate):
    """Create a new product"""
    try:
        product = Product(**product_input.model_dump())
        
        # Generate mock marketplace links
        product.marketplace_links = [
            MarketplaceLink(platform="Amazon KDP", url=f"https://amazon.com/dp/{product.id[:8]}", status="ready"),
            MarketplaceLink(platform="Udemy", url=f"https://udemy.com/course/{product.title.lower().replace(' ', '-')}", status="ready"),
            MarketplaceLink(platform="Shopify", url=f"https://mystore.shopify.com/products/{product.id[:8]}", status="ready"),
        ]
        
        doc = product.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['marketplace_links'] = [link.model_dump() for link in product.marketplace_links]
        
        await db.products.insert_one(doc)
        return product
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/products", response_model=List[Product])
async def get_products(limit: int = 50, status: Optional[str] = None):
    """Get all products with optional filtering"""
    try:
        query = {}
        if status:
            query["status"] = status
        
        products = await db.products.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
        
        # Convert ISO strings back to datetime
        for product in products:
            if isinstance(product['created_at'], str):
                product['created_at'] = datetime.fromisoformat(product['created_at'])
        
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    try:
        product = await db.products.find_one({"id": product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if isinstance(product['created_at'], str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
        
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/products/{product_id}/status")
async def update_product_status(product_id: str, status: ProductStatus):
    """Update product status (draft/ready/published/retired)"""
    try:
        result = await db.products.update_one(
            {"id": product_id},
            {"$set": {"status": status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return {"message": "Status updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Opportunities CRUD
@api_router.post("/opportunities", response_model=Opportunity)
async def create_opportunity(opportunity_input: OpportunityCreate):
    """Create a new opportunity"""
    try:
        opportunity = Opportunity(**opportunity_input.model_dump())
        
        doc = opportunity.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.opportunities.insert_one(doc)
        return opportunity
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/opportunities", response_model=List[Opportunity])
async def get_opportunities(limit: int = 20):
    """Get all opportunities"""
    try:
        opportunities = await db.opportunities.find({}, {"_id": 0}).sort("trend_score", -1).limit(limit).to_list(limit)
        
        for opp in opportunities:
            if isinstance(opp['created_at'], str):
                opp['created_at'] = datetime.fromisoformat(opp['created_at'])
        
        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# AI Tasks CRUD
@api_router.post("/ai/tasks", response_model=AITask)
async def create_ai_task(task_input: AITaskCreate):
    """Create a new AI task"""
    try:
        task = AITask(**task_input.model_dump())
        
        doc = task.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        if doc.get('completed_at'):
            doc['completed_at'] = doc['completed_at'].isoformat()
        
        await db.ai_tasks.insert_one(doc)
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/ai/tasks", response_model=List[AITask])
async def get_ai_tasks(limit: int = 50, status: Optional[str] = None):
    """Get all AI tasks with optional status filtering"""
    try:
        query = {}
        if status:
            query["status"] = status
        
        tasks = await db.ai_tasks.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
        
        for task in tasks:
            if isinstance(task['created_at'], str):
                task['created_at'] = datetime.fromisoformat(task['created_at'])
            if task.get('completed_at') and isinstance(task['completed_at'], str):
                task['completed_at'] = datetime.fromisoformat(task['completed_at'])
        
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Revenue Metrics
@api_router.get("/metrics/revenue", response_model=List[RevenueMetric])
async def get_revenue_metrics(days: int = 7):
    """Get revenue metrics for the past N days"""
    try:
        metrics = await db.revenue_metrics.find({}, {"_id": 0}).sort("date", -1).limit(days).to_list(days)
        
        for metric in metrics:
            if isinstance(metric['date'], str):
                metric['date'] = datetime.fromisoformat(metric['date'])
        
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/metrics/revenue")
async def record_revenue_metric(metric: RevenueMetric):
    """Record a new revenue metric"""
    try:
        doc = metric.model_dump()
        doc['date'] = doc['date'].isoformat()
        
        await db.revenue_metrics.insert_one(doc)
        return {"message": "Revenue metric recorded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
