# Complete System Architecture & Endpoint Reference

## System Overview

CEO Empire is a fully autonomous AI-powered product generation and sales system with:
- ✅ **AI Services** - OpenAI, Anthropic Claude, DALL-E integration
- ✅ **Email System** - SendGrid for notifications and marketing
- ✅ **Payment Processing** - Stripe for direct product sales
- ✅ **Database** - MongoDB for persistent data storage
- ✅ **Security** - Fernet encryption for API keys
- ✅ **Monitoring** - Health checks and statistics

## Complete Endpoint List (16 Total)

### Part 1: Key Management (2 endpoints)
```
POST   /api/keys/store                 - Store API keys securely
GET    /api/keys/status                - Check configured keys
```

### Part 2: AI Services (5 endpoints)
```
POST   /api/ai/generate-product        - Generate product description (OpenAI)
POST   /api/ai/find-opportunities      - Find market opportunities (Claude)
POST   /api/ai/generate-image          - Generate product image (DALL-E)
POST   /api/ai/generate-full-product   - Complete workflow (all combined)
```

### Part 3: Email & Notifications (6 endpoints)
```
POST   /api/email/send                 - Send direct email
POST   /api/email/send-template        - Send templated email
POST   /api/email/send-product-notification - Send product email
POST   /api/notifications              - Create notification
GET    /api/notifications/{user_id}    - Retrieve notifications
POST   /api/notifications/{id}/read    - Mark as read
```

### Part 4: Payments (4 endpoints)
```
POST   /api/payments/create-checkout   - Create Stripe checkout
POST   /api/payments/webhook           - Handle Stripe webhooks
GET    /api/payments/{product_id}/stats    - Product sales stats
GET    /api/payments/all-stats         - Overall sales stats
```

### Additional Endpoints (Not listed above)
- Dashboard stats
- Product CRUD (create, read, update)
- Opportunities CRUD
- AI Tasks management
- Revenue metrics
- Health check

## Complete Flow: From Idea to Sale

```
┌─────────────────────────────────────────────────────────┐
│  STEP 1: Discover Opportunity                          │
│  POST /api/ai/find-opportunities                        │
│  Input: Niche, market size, keywords                    │
│  Output: Market analysis, challenges, action items      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 2: Generate Full Product                         │
│  POST /api/ai/generate-full-product                     │
│  Input: Concept, keywords, generate_image=true         │
│  Output: Title, description, image, saved to DB         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 3: Send Notification Email                        │
│  POST /api/email/send-product-notification              │
│  Input: product_id, customer_email                      │
│  Output: Email sent with product details                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 4: Create Dashboard Notification                 │
│  POST /api/notifications                                │
│  Input: Event: product_ready                            │
│  Output: Notification stored for user                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 5: Create Checkout Session                        │
│  POST /api/payments/create-checkout                     │
│  Input: product_id, customer_email, quantity            │
│  Output: Stripe checkout URL + session ID               │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 6: Customer Pays (Stripe handles)                │
│  Stripe Checkout Page (external)                        │
│  Input: Credit card, email                              │
│  Output: Payment confirmed or failed                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 7: Webhook Notification                          │
│  POST /api/payments/webhook                             │
│  Event: checkout.session.completed                      │
│  Actions:                                               │
│  - Update payment record to "succeeded"                │
│  - Increment product conversions/revenue                │
│  - Send confirmation email to customer                 │
│  - Record in notifications                             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  STEP 8: Dashboard View Sales                           │
│  GET /api/payments/all-stats                            │
│  GET /api/payments/{product_id}/stats                   │
│  Output: Revenue, sales count, performance metrics      │
└─────────────────────────────────────────────────────────┘
```

## Frontend Integration Points

### 1. Settings Page
```javascript
// Add API keys via modal
const keys = {
  openai_key: "sk-...",
  anthropic_key: "sk-ant-...",
  dalle_key: "sk-...",
  sendgrid_key: "SG.5nF...",
  stripe_key: "sk_live_...",
  gumroad_key: "...",
  mongodb_url: "mongodb+srv://..."
};

// Send to backend
POST /api/keys/store → Encrypted storage
```

### 2. Product Generator Page
```javascript
// User enters concept
const concept = "Email marketing course with AI copywriting";

// Generate AI product
POST /api/ai/generate-full-product → Product + Image + DB save

// Show product details and buttons:
// - Edit / Adjust Details
// - Preview
// - Publish to Marketplace
// - Send Test Email
// - Create Checkout Link
```

### 3. Dashboard Page
```javascript
// Get overall stats
GET /api/dashboard/stats → {
  total_products: 24,
  products_today: 3,
  total_revenue: 4250.00,
  revenue_today: 125.00,
  pending_tasks: 2,
  active_opportunities: 8
}

// Get payment stats
GET /api/payments/all-stats → {
  total_revenue: 4250.00,
  total_sales: 87,
  average_order_value: 48.85,
  today_revenue: 125.00,
  today_sales: 3
}
```

### 4. Notifications
```javascript
// Show real-time notifications
GET /api/notifications/{user_id} → [
  {
    notification_id: "...",
    type: "product_ready",
    title: "New Product Ready",
    message: "Your AI product is ready to sell",
    read: false,
    data: { product_id: "..." }
  }
]

// Mark as read
POST /api/notifications/{id}/read
```

## Request/Response Examples

### Complete Product Generation Workflow

**Request:**
```bash
curl -X POST http://localhost:8000/api/ai/generate-full-product \
  -H "Content-Type: application/json" \
  -d '{
    "concept": "AI-powered email marketing automation platform",
    "keywords": ["email", "marketing", "AI", "automation"],
    "generate_image": true,
    "save_to_db": true
  }'
```

**Response:**
```json
{
  "product": {
    "title": "EmailGenius Pro - AI Email Marketing Suite",
    "description": "Automate your email marketing with AI-generated templates...",
    "keywords": ["email marketing", "AI", "automation", "copywriting"],
    "price_range": "$49-$199",
    "target_audience": "E-commerce businesses and marketing agencies"
  },
  "image": {
    "image_url": "https://oaidalleapiprodscus.blob.core...",
    "prompt_used": "Professional email marketing dashboard...",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "database_id": "507f1f77bcf86cd799439011",
  "status": "success"
}
```

### Create Payment Checkout

**Request:**
```bash
curl -X POST http://localhost:8000/api/payments/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "507f1f77bcf86cd799439011",
    "customer_email": "customer@example.com",
    "quantity": 1
  }'
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/pay/cs_test_...",
  "session_id": "cs_test_...",
  "payment_status": "pending"
}
```

### Get All Payment Statistics

**Request:**
```bash
curl http://localhost:8000/api/payments/all-stats
```

**Response:**
```json
{
  "total_revenue": 12450.75,
  "total_sales": 247,
  "products_with_sales": 18,
  "average_order_value": 50.43,
  "today_revenue": 425.00,
  "today_sales": 8,
  "currency": "usd"
}
```

## Database Collections

The system uses MongoDB with these collections:

### products
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "keywords": ["string"],
  "price": number,
  "image_url": "string",
  "status": "draft|ready|published",
  "revenue": number,
  "conversions": number,
  "created_at": "ISO timestamp"
}
```

### notifications
```json
{
  "notification_id": "uuid",
  "recipient_id": "string",
  "type": "product_ready|opportunity_found|task_completed|revenue_update",
  "title": "string",
  "message": "string",
  "read": boolean,
  "created_at": "ISO timestamp"
}
```

### payments
```json
{
  "payment_id": "uuid",
  "product_id": "string",
  "customer_email": "string",
  "amount_cents": number,
  "currency": "usd",
  "status": "pending|succeeded|failed",
  "stripe_session_id": "string",
  "created_at": "ISO timestamp",
  "completed_at": "ISO timestamp (optional)"
}
```

## API Key Configuration

### Required Keys (8 total)

| Key | Provider | Used For | Category |
|-----|----------|----------|----------|
| openai_key | OpenAI | Product generation, text | AI |
| anthropic_key | Anthropic | Opportunity analysis | AI |
| dalle_key | OpenAI | Image generation | AI |
| sendgrid_key | SendGrid | Email notifications | Email |
| stripe_key | Stripe | Payment processing | Platform |
| gumroad_key | Gumroad | Product distribution | Platform |
| gumroad_secret | Gumroad | API authentication | Platform |
| mongodb_url | MongoDB | Data persistence | Database |

### Setup Order

1. **Frontend Settings Page** - User pastes keys
2. **POST /api/keys/store** - Keys stored encrypted in backend
3. **GET /api/keys/status** - Check which keys are configured
4. **Endpoints use keys** - KeysManager retrieves as needed

## Error Handling

All endpoints follow standard error patterns:

```json
{
  "detail": "Error message description"
}
```

### Common Errors

| Status | Meaning | Solution |
|--------|---------|----------|
| 400 | Bad Request (missing key) | Configure API key in Settings |
| 404 | Not Found (product/order) | Verify product ID |
| 500 | Server Error (API call) | Check API key validity |
| 500 | Import Error | Install SDK (pip install X) |
| 500 | Database Error | Check MongoDB connection |

## Performance Characteristics

| Operation | Time | Bottleneck |
|-----------|------|-----------|
| Product Gen | 3-5s | OpenAI API |
| Opportunity Find | 4-7s | Claude API |
| Image Gen | 30s | DALL-E API |
| Full Workflow | 50s | Image generation |
| Email Send | 2-3s | SendGrid API |
| Notification Create | <100ms | Database |
| Checkout Create | 1-2s | Stripe API |
| Webhook Process | <500ms | Database update |

## Recommended Async Implementation

For long operations, use FastAPI BackgroundTasks:

```python
async def generate_product_background(
    request: FullProductGenerationRequest,
    background_tasks: BackgroundTasks
):
    # Immediately return task ID
    task_id = str(uuid.uuid4())
    
    # Run in background
    background_tasks.add_task(
        generate_full_product_worker,
        request,
        task_id
    )
    
    return {"task_id": task_id, "status": "processing"}
```

## Frontend Test Checklist

- [ ] Settings page adds all 8 API keys
- [ ] Keys are stored in localStorage
- [ ] POST /api/keys/store sends keys to backend
- [ ] GET /api/keys/status shows all keys configured
- [ ] Product generator creates products with AI
- [ ] Email notifications arrive after products
- [ ] Stripe checkout works end-to-end
- [ ] Payment stats update dashboard
- [ ] Webhook updates product revenue
- [ ] Notifications show in dashboard

## Deployment Steps

1. **Set Environment Variables:**
   ```bash
   export MONGO_URL="mongodb+srv://..."
   export CORS_ORIGINS="http://localhost:3000"
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Backend Server:**
   ```bash
   python server.py
   ```

4. **Test Endpoints:**
   ```bash
   python test_ai_endpoints.py
   python test_email_notifications.py
   python test_stripe_payments.py
   ```

5. **Frontend Initialization:**
   - Update API URL to backend server
   - Add API keys via Settings page
   - Test product generation workflow

## Next Optimization Areas

1. **Gumroad Integration** - Ship directly to Gumroad marketplace
2. **Autonomous Scheduling** - Generate products on schedule
3. **Multi-seller Support** - White-label for resellers
4. **Analytics Dashboard** - Real-time trends & insights
5. **Marketplace Publishing** - Amazon KDP, Udemy integration
6. **Email Sequences** - Automated follow-ups and upsells
7. **A/B Testing** - Split test product descriptions
8. **Content Library** - Store and reuse generated content

## System Status

- ✅ Database: MongoDB connected
- ✅ API Keys: Manager with encryption
- ✅ AI Integration: OpenAI, Anthropic, DALL-E
- ✅ Email System: SendGrid configured
- ✅ Payments: Stripe integrated
- ✅ Notifications: Database + in-app
- 🔄 Autonomous Scheduling: Ready for implementation
- 🔄 Marketplace Publishing: Ready for integration
