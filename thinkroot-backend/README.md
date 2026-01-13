# ParaCipher MVP Backend

**A production-style FastAPI mock backend for instant insurance, ready for ThinkRoot integration.**

---

## 🎯 Features

✅ **Stateless In-Memory Store** – No database required, deterministic mock data  
✅ **Complete REST API** – All 8 feature areas covered  
✅ **Time-Based Simulation** – Policies auto-expire, claims auto-approve  
✅ **SBT Score & Discounts** – Safety Passport integration  
✅ **Gasless Wallet Mock** – Smart contract-ready design  
✅ **Transaction History** – Complete audit trail  
✅ **Notifications** – Real-time alerts  
✅ **OpenAPI Schema** – Auto-generated interactive docs  
✅ **Postman Collection** – Ready to test  
✅ **CORS Enabled** – Works with any frontend  

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/abhinavanagarajan/repos/GitHub/defy-backend-fast-api-
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```

The server starts on `http://localhost:8000`

### 3. Access the API

- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

---

## 📚 API Endpoints Overview

### Authentication
- `POST /auth/login` – Mock login
- `POST /auth/logout` – Logout

### Onboarding
- `POST /onboarding/complete` – Complete KYC
- `GET /onboarding/status` – Check onboarding status

### Wallet
- `GET /wallet` – Get wallet info & active policies
- `GET /wallet/balance` – Get current balance
- `POST /wallet/fund` – Top up wallet (demo)

### Policies
- `POST /policy/purchase` – Purchase instant coverage
- `GET /policy` – Get all policies
- `GET /policy/active/current` – Get active policy
- `GET /policy/{policy_id}` – Get policy details

### Claims
- `POST /claims/simulate` – Simulate a claim (auto-approves)
- `GET /claims` – Get all claims
- `GET /claims/{claim_id}` – Get claim details

### Transaction History
- `GET /history` – Get all transactions
- `GET /history?filter=premium` – Filter by type
- `GET /history/type/{tx_type}` – Get by specific type

### Safety Passport (Reputation)
- `GET /reputation` – Get SBT score & metrics
- `POST /reputation/update` – Update reputation (demo)

### Settings & Health
- `GET /api/home` – Home screen overview
- `GET /api/health` – Health check
- `POST /api/settings/reset` – Reset demo state

---

## 📋 Example Workflows

### Workflow 1: Complete Onboarding → Purchase Coverage → Submit Claim

```bash
# 1. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "0xMOCK"}'

# Response:
# {"token": "mock-jwt-...", "userId": "user_001"}

# 2. Complete onboarding
curl -X POST http://localhost:8000/onboarding/complete \
  -H "Content-Type: application/json" \
  -d '{"kycStatus": "verified"}'

# 3. Purchase coverage (8 hours)
curl -X POST http://localhost:8000/policy/purchase \
  -H "Content-Type: application/json" \
  -d '{"durationHours": 8}'

# Response includes:
# - Premium: ₹160 base → ₹128 with SBT discount (20%)
# - Policy ID, NFT ID, coverage times
# - New balance: 1000 - 128 = 872

# 4. Simulate a claim
curl -X POST http://localhost:8000/claims/simulate \
  -H "Content-Type: application/json" \
  -d '{"description": "Speed detection during shift"}'

# Response:
# - Claim auto-approved
# - ₹5000 payout processed
# - New balance: 872 + 5000 = 5872
```

### Workflow 2: Check Home Overview & Reputation

```bash
# Get home screen
curl http://localhost:8000/api/home

# Response:
# {
#   "shiftStatus": "active",
#   "balance": 5872,
#   "activePolicy": {...},
#   "alerts": []
# }

# Get reputation score
curl http://localhost:8000/reputation

# Response:
# {
#   "sbtScore": 50,
#   "tierDiscount": 20,
#   "metrics": {...},
#   "badges": [{"name": "Silver", "icon": "⭐"}]
# }
```

---

## 🏗️ Project Structure

```
defy-backend-fast-api-/
├── main.py                          # FastAPI app entry point
├── requirements.txt                 # Python dependencies
├── .env                            # Environment config
├── ParaCipher_MVP_Backend.postman_collection.json
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings & config
│   │   └── mock_store.py          # In-memory database
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── policy.py
│   │   ├── claim.py
│   │   ├── transaction.py
│   │   ├── notification.py
│   │   └── common.py              # Request/response models
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py               # Authentication
│   │   ├── onboarding.py         # KYC & onboarding
│   │   ├── wallet.py             # Wallet operations
│   │   ├── policy.py             # Policy management
│   │   ├── claims.py             # Claims processing
│   │   ├── history.py            # Transaction history
│   │   ├── reputation.py         # SBT & reputation
│   │   └── settings.py           # Health & settings
│   └── utils/
│       ├── __init__.py
│       └── ids.py                # ID generators
└── README.md                       # This file
```

---

## 🔧 Mock Store Features

The `MockStore` class provides all data operations:

```python
# User operations
mock_store.get_user(user_id)
mock_store.update_user(user_id, data)
mock_store.update_balance(user_id, amount)

# Policy operations
mock_store.create_policy(user_id, duration_hours, premium)
mock_store.get_active_policy(user_id)  # Auto-expires if time passed
mock_store.get_user_policies(user_id)

# Claim operations
mock_store.create_claim(policy_id, description)
mock_store.approve_claim(claim_id, payout_amount)
mock_store.get_policy_claims(policy_id)

# Transaction tracking
mock_store.create_transaction(user_id, type, amount)
mock_store.get_user_transactions(user_id, filter)

# Notifications
mock_store.create_notification(user_id, title, message, type)
mock_store.get_user_notifications(user_id)

# Session management
mock_store.create_session(user_id, token)
mock_store.get_session(token)

# Reset for demos
mock_store.reset()
```

---

## 💰 Pricing & Discount Logic

**Base Premium**: ₹25 per hour

**SBT Discount**: 
- Score ≥ 50: **20% off**
- Score < 50: **No discount**

**Example**:
- 8-hour coverage: 8 × ₹25 = ₹200 base
- SBT score 50+: ₹200 × 0.8 = **₹160 (paid)**

---

## 🎭 Time-Based Simulation

Policies **auto-expire** when coverage period ends:

```python
# Coverage end time: 2026-01-13 18:00:00
# Current time: 2026-01-13 19:00:00
# Status automatically: "expired"
```

Claims **auto-approve** on submission (for demo):

```python
# POST /claims/simulate
# Status: "pending" → "paid" (instant)
# Payout: ₹5000 (fixed for demo)
```

---

## 🔐 Security Notes

⚠️ **This is a mock backend for MVP demo only.**

For production:
- Replace mock store with real PostgreSQL/MongoDB
- Implement proper JWT validation
- Add rate limiting
- Implement actual blockchain integration
- Add proper error handling & logging
- Use environment-based config for secrets

---

## 🧪 Testing with Postman

1. **Import Collection**:
   - Open Postman
   - Import `ParaCipher_MVP_Backend.postman_collection.json`

2. **Run Requests**:
   - Start with `/auth/login`
   - Then `/onboarding/complete`
   - Continue with purchase, claim, history flows

3. **Export Results**:
   - Use Postman's Collection Runner to document API behavior

---

## 🌐 Frontend Integration

### ThinkRoot Configuration

```javascript
const API_BASE = "http://localhost:8000";  // or your deployed URL

// Example fetch
async function purchaseCoverage(hours) {
  const response = await fetch(`${API_BASE}/policy/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ durationHours: hours })
  });
  return response.json();
}
```

### CORS Settings

Already enabled for all origins. Adjust in [app/core/config.py](app/core/config.py) if needed:

```python
ALLOWED_ORIGINS: list = ["*"]  # Change to specific domains for production
```

---

## 📦 Deployment

### Local Development

```bash
python main.py
# Runs on http://localhost:8000
```

### Docker (Optional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build & run:
```bash
docker build -t paracipher-backend .
docker run -p 8000:8000 paracipher-backend
```

### AWS Elastic Beanstalk / Heroku / Railway

Standard Python FastAPI deployment. Ensure `main.py` is the entry point.

---

## 📊 Data Flow Diagram

```
Frontend (ThinkRoot)
        │
        ├─POST /auth/login ──────────┐
        │                            │
        ├─POST /policy/purchase ────→ MockStore (In-Memory)
        │     ├─ Create policy          ├─ users
        │     ├─ Deduct balance         ├─ policies
        │     └─ Create transaction     ├─ claims
        │                              ├─ transactions
        ├─POST /claims/simulate ─────→ └─ notifications
        │     ├─ Auto-approve
        │     ├─ Payout
        │     └─ Notification
        │
        └─GET /reputation ──────────→ Auto-calculate SBT
```

---

## 🎯 Next Steps

### Phase 1: MVP Demo (Current)
✅ Stateless mock backend  
✅ Complete REST API  
✅ Postman testing  

### Phase 2: Production Ready
- [ ] Real database (PostgreSQL)
- [ ] Blockchain integration for SBTs
- [ ] Real wallet addresses & signatures
- [ ] Notification service (email, SMS, push)
- [ ] Analytics & logging
- [ ] Rate limiting & auth middleware
- [ ] CI/CD pipeline

### Phase 3: Scale
- [ ] Multi-tenant support
- [ ] Mobile SDK
- [ ] Admin dashboard
- [ ] Risk models & pricing engine

---

## 📞 Support

For issues or questions:
1. Check [FastAPI docs](https://fastapi.tiangolo.com/)
2. Review the OpenAPI schema at `/docs`
3. Inspect mock data in `app/core/mock_store.py`

---

## 📄 License

This mock backend is part of the ParaCipher MVP project. Use freely for demo and development.

---

**Built with ❤️ for instant insurance. Ready to scale.**
