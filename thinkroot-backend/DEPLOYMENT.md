# Deployment & API Integration Guide

## 🚀 Deployment Options

### Option 1: Local Development (Instant)

```bash
cd /Users/abhinavanagarajan/repos/GitHub/defy-backend-fast-api-
pip install -r requirements.txt
python main.py
```

Access at: `http://localhost:8000`

---

### Option 2: Railway (Recommended for MVP)

**1. Create Railway Account**
- Sign up at [railway.app](https://railway.app)

**2. Deploy**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd /Users/abhinavanagarajan/repos/GitHub/defy-backend-fast-api-
railway init

# Deploy
railway up
```

**3. Get your URL**
```bash
railway domains
# Returns: your-app.railway.app
```

---

### Option 3: Heroku

**1. Create Heroku Account** & install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

**2. Add Procfile**
```bash
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile
```

**3. Deploy**
```bash
heroku create your-app-name
git push heroku main
heroku open
```

---

### Option 4: AWS Lambda + API Gateway

See [AWS FastAPI Lambda Guide](https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html)

---

## 🔗 ThinkRoot Frontend Integration

### Environment Setup

In ThinkRoot (or your frontend):

```javascript
// .env or config.js
const API_CONFIG = {
  DEVELOPMENT: "http://localhost:8000",
  PRODUCTION: "https://your-app.railway.app"  // or your deployed URL
};

export const API_BASE = process.env.NODE_ENV === "production" 
  ? API_CONFIG.PRODUCTION 
  : API_CONFIG.DEVELOPMENT;
```

### Example API Calls

```javascript
// src/services/api.js
export const apiClient = {
  // Auth
  async login(walletAddress) {
    return fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress })
    }).then(r => r.json());
  },

  // Onboarding
  async completeOnboarding() {
    return fetch(`${API_BASE}/onboarding/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kycStatus: "verified" })
    }).then(r => r.json());
  },

  // Wallet
  async getBalance() {
    return fetch(`${API_BASE}/wallet/balance`)
      .then(r => r.json());
  },

  // Policies
  async purchaseCoverage(durationHours) {
    return fetch(`${API_BASE}/policy/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durationHours })
    }).then(r => r.json());
  },

  // Claims
  async submitClaim(description) {
    return fetch(`${API_BASE}/claims/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description })
    }).then(r => r.json());
  },

  // History
  async getTransactionHistory(filter = "") {
    const query = filter ? `?filter=${filter}` : "";
    return fetch(`${API_BASE}/history${query}`)
      .then(r => r.json());
  },

  // Reputation
  async getReputation() {
    return fetch(`${API_BASE}/reputation`)
      .then(r => r.json());
  },

  // Home
  async getHomeOverview() {
    return fetch(`${API_BASE}/api/home`)
      .then(r => r.json());
  },

  // Health check
  async healthCheck() {
    return fetch(`${API_BASE}/api/health`)
      .then(r => r.json());
  }
};
```

### React Hook Example

```javascript
// hooks/useApi.js
import { useState, useEffect } from "react";
import { apiClient } from "@/services/api";

export function usePolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getPolicies()
      .then(setPolicies)
      .finally(() => setLoading(false));
  }, []);

  return { policies, loading };
}
```

---

## 🧪 Testing Checklist

### Before Going Live

- [ ] **Health Check**: `GET /api/health` returns 200
- [ ] **CORS Working**: Frontend can call backend without errors
- [ ] **Auth Flow**: Login → Token generation works
- [ ] **Complete Flow**: Onboarding → Purchase → Claim cycle works
- [ ] **Response Times**: APIs respond in < 100ms
- [ ] **Error Handling**: 404/400 errors return proper messages
- [ ] **Balance Updates**: Transactions reflect correctly
- [ ] **Notifications**: Claims trigger notifications

### Postman Testing Script

```bash
# Run all endpoints
newman run ParaCipher_MVP_Backend.postman_collection.json

# Export report
newman run ParaCipher_MVP_Backend.postman_collection.json \
  --reporters cli,html \
  --reporter-html-export report.html
```

---

## 📊 Monitoring & Logs

### Check Health
```bash
curl https://your-app.railway.app/api/health
```

### View Logs (Railway)
```bash
railway logs
```

### View Logs (Heroku)
```bash
heroku logs --tail
```

---

## 🔄 Updating the Backend

### After Making Code Changes

```bash
# Option 1: Railway
cd repo && git add . && git commit -m "Update" && git push

# Option 2: Heroku
git add . && git commit -m "Update" && git push heroku main

# Option 3: Local
python main.py  # Restart (uvicorn auto-reloads with reload=True)
```

---

## 🛡️ Environment Variables

The backend reads from `.env`:

```env
ENVIRONMENT=development
SECRET_KEY=mock-secret-key-for-development-only
JWT_EXPIRY=24
```

For production, set in your deployment platform:

**Railway**:
```bash
railway variables:set ENVIRONMENT=production
railway variables:set SECRET_KEY=your-secret-key
```

**Heroku**:
```bash
heroku config:set ENVIRONMENT=production
heroku config:set SECRET_KEY=your-secret-key
```

---

## 📈 Performance Tips

1. **Use Redis** (future): Cache active policies, balance checks
2. **Database Indexing** (future): Index `user_id`, `policy_id`
3. **Connection Pooling** (future): Use SQLAlchemy connection pools
4. **CDN** (future): Serve static OpenAPI schema from CloudFront/Cloudflare
5. **Rate Limiting**: Add per-user rate limits with FastAPI middleware

---

## 🐛 Troubleshooting

### "Connection Refused"
```
Problem: Backend not running
Solution: Start with `python main.py`
```

### "CORS Error"
```
Problem: Frontend can't access backend
Solution: Check ALLOWED_ORIGINS in core/config.py is set to ["*"]
```

### "404 Not Found"
```
Problem: Endpoint doesn't exist
Solution: Check route in routers/, verify path spelling
```

### "Balance Below Cost"
```
Problem: User doesn't have enough balance to purchase
Solution: Call POST /wallet/fund to add credits
```

---

## 📞 Support

- FastAPI Docs: https://fastapi.tiangolo.com/
- Railway Docs: https://docs.railway.app/
- Heroku Docs: https://devcenter.heroku.com/

---

**Ready to deploy!** Pick your platform and push code. 🚀
