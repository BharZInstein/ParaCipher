# API Specification & Schema

## Base URL

```
Local: http://localhost:8000
Deployed: https://your-app.railway.app
```

## Authentication

All endpoints use mock tokens for demo. In production, validate JWT signatures.

```
Header: Authorization: Bearer <token>
```

---

## Complete API Reference

### Authentication Endpoints

#### POST /auth/login
**Login with wallet address**

Request:
```json
{
  "walletAddress": "0x123..."
}
```

Response (200):
```json
{
  "token": "mock-jwt-...",
  "userId": "user_001"
}
```

---

#### POST /auth/logout
**Logout and invalidate token**

Query: `token=mock-jwt-...`

Response (200):
```json
{
  "message": "Logout successful"
}
```

---

### Onboarding Endpoints

#### POST /onboarding/complete
**Complete KYC onboarding**

Request:
```json
{
  "kycStatus": "verified"
}
```

Response (200):
```json
{
  "user": {
    "id": "user_001",
    "walletAddress": "0x...",
    "kycStatus": "verified",
    "sbtScore": 50,
    "balance": 1000,
    "createdAt": "2026-01-06T..."
  }
}
```

---

#### GET /onboarding/status
**Get onboarding status**

Response (200):
```json
{
  "userId": "user_001",
  "walletAddress": "0x...",
  "kycStatus": "verified",
  "isComplete": true
}
```

---

### Wallet Endpoints

#### GET /wallet
**Get wallet information**

Response (200):
```json
{
  "walletAddress": "0x...",
  "gasless": true,
  "activePolicies": ["policy_abc123", "policy_def456"]
}
```

---

#### GET /wallet/balance
**Get wallet balance**

Response (200):
```json
{
  "balance": 872,
  "currency": "INR"
}
```

---

#### POST /wallet/fund
**Fund wallet (demo)**

Query: `amount=500`

Response (200):
```json
{
  "previousBalance": 372,
  "fundedAmount": 500,
  "newBalance": 872
}
```

---

### Policy Endpoints

#### POST /policy/purchase
**Purchase instant coverage**

Request:
```json
{
  "durationHours": 8
}
```

Response (200):
```json
{
  "policy": {
    "id": "policy_abc123",
    "userId": "user_001",
    "durationHours": 8,
    "premiumPaid": 160,
    "status": "active",
    "nftId": "NFT-888",
    "coverageStart": "2026-01-13T14:30:00",
    "coverageEnd": "2026-01-13T22:30:00",
    "createdAt": "2026-01-13T14:30:00"
  },
  "premiumBreakdown": {
    "basePremium": 200,
    "discountRate": 20,
    "discountAmount": 40,
    "premiumPaid": 160
  },
  "newBalance": 712
}
```

Errors:
- 400: Insufficient balance
- 404: User not found

---

#### GET /policy
**Get all policies for user**

Response (200):
```json
{
  "policies": [
    {
      "id": "policy_abc123",
      "userId": "user_001",
      "durationHours": 8,
      "premiumPaid": 160,
      "status": "active",
      "nftId": "NFT-888",
      "coverageStart": "2026-01-13T14:30:00",
      "coverageEnd": "2026-01-13T22:30:00",
      "createdAt": "2026-01-13T14:30:00"
    }
  ],
  "count": 1
}
```

---

#### GET /policy/{policy_id}
**Get specific policy**

Response (200):
```json
{
  "id": "policy_abc123",
  "userId": "user_001",
  "durationHours": 8,
  "premiumPaid": 160,
  "status": "active",
  "nftId": "NFT-888",
  "coverageStart": "2026-01-13T14:30:00",
  "coverageEnd": "2026-01-13T22:30:00",
  "createdAt": "2026-01-13T14:30:00"
}
```

---

#### GET /policy/active/current
**Get active policy**

Response (200):
```json
{
  "policy": {
    "id": "policy_abc123",
    "status": "active",
    ...
  },
  "shiftStatus": "active"
}
```

Response (200, no active):
```json
{
  "policy": null,
  "shiftStatus": "inactive"
}
```

---

### Claims Endpoints

#### POST /claims/simulate
**Submit a claim (auto-approved for demo)**

Request:
```json
{
  "description": "Speed detection during shift"
}
```

Response (200):
```json
{
  "claim": {
    "id": "claim_xyz123",
    "policyId": "policy_abc123",
    "status": "paid",
    "description": "Speed detection during shift",
    "createdAt": "2026-01-13T14:35:00",
    "payoutAmount": 5000,
    "payoutTxHash": "0x...",
    "payoutDate": "2026-01-13T14:35:00"
  },
  "payoutAmount": 5000,
  "newBalance": 5712
}
```

Errors:
- 400: No active policy

---

#### GET /claims
**Get all claims**

Response (200):
```json
{
  "claims": [
    {
      "id": "claim_xyz123",
      "policyId": "policy_abc123",
      "status": "paid",
      "description": "...",
      "createdAt": "2026-01-13T14:35:00",
      "payoutAmount": 5000,
      "payoutTxHash": "0x...",
      "payoutDate": "2026-01-13T14:35:00"
    }
  ],
  "count": 1
}
```

---

#### GET /claims/{claim_id}
**Get specific claim**

Response (200):
```json
{
  "id": "claim_xyz123",
  "policyId": "policy_abc123",
  "status": "paid",
  "description": "Speed detection during shift",
  "createdAt": "2026-01-13T14:35:00",
  "payoutAmount": 5000,
  "payoutTxHash": "0x...",
  "payoutDate": "2026-01-13T14:35:00"
}
```

---

### History Endpoints

#### GET /history
**Get all transactions**

Query: `filter=premium|claim|topup` (optional)

Response (200):
```json
{
  "transactions": [
    {
      "id": "tx_abc123",
      "userId": "user_001",
      "type": "premium",
      "amount": 160,
      "status": "success",
      "timestamp": "2026-01-13T14:30:00",
      "referenceHash": "0x...",
      "referenceId": "policy_abc123"
    },
    {
      "id": "tx_xyz789",
      "userId": "user_001",
      "type": "claim",
      "amount": 5000,
      "status": "success",
      "timestamp": "2026-01-13T14:35:00",
      "referenceHash": "0x...",
      "referenceId": "claim_xyz123"
    }
  ],
  "count": 2,
  "filter": "all"
}
```

---

#### GET /history?filter=premium
**Get premium payments**

Response (200):
```json
{
  "transactions": [
    {
      "id": "tx_abc123",
      "type": "premium",
      "amount": 160,
      ...
    }
  ],
  "count": 1,
  "filter": "premium"
}
```

---

#### GET /history/type/{tx_type}
**Get transactions by type**

Response (200):
```json
{
  "transactions": [...],
  "type": "premium",
  "count": 1
}
```

---

### Reputation Endpoints

#### GET /reputation
**Get Safety Passport (SBT) data**

Response (200):
```json
{
  "sbtScore": 50,
  "tierDiscount": 20,
  "metrics": {
    "speedEvents": 0,
    "harshBraking": 0,
    "nightShifts": 0,
    "successfulClaims": 1,
    "totalPolicies": 1
  },
  "badges": [
    {
      "name": "Silver",
      "icon": "⭐"
    }
  ]
}
```

---

#### POST /reputation/update
**Update SBT score (demo)**

Response (200):
```json
{
  "message": "Reputation updated",
  "sbtScore": 55,
  "change": 5
}
```

---

### Settings & Health Endpoints

#### GET /api/home
**Get home screen overview**

Response (200):
```json
{
  "shiftStatus": "active",
  "balance": 5712,
  "activePolicy": {
    "id": "policy_abc123",
    "status": "active",
    ...
  },
  "alerts": []
}
```

---

#### GET /api/health
**Health check**

Response (200):
```json
{
  "status": "healthy",
  "service": "ParaCipher MVP Backend",
  "version": "1.0.0"
}
```

---

#### POST /api/settings/reset
**Reset demo state**

Response (200):
```json
{
  "message": "Demo state reset successfully",
  "newBalance": 1000
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Insufficient balance"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid token"
}
```

### 404 Not Found
```json
{
  "detail": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (validation error, insufficient balance) |
| 401 | Unauthorized (invalid token) |
| 404 | Not found (resource doesn't exist) |
| 500 | Server error |

---

## Data Types

### Policy Status
- `"active"` – Currently active, coverage in progress
- `"expired"` – Coverage period ended
- `"cancelled"` – User cancelled

### Claim Status
- `"pending"` – Awaiting review
- `"paid"` – Approved and paid
- `"rejected"` – Not approved
- `"appealing"` – Under appeal

### Transaction Type
- `"premium"` – Policy purchase
- `"claim"` – Claim payout
- `"topup"` – Wallet funding
- `"refund"` – Refund processed

### SBT Score Range
- 0–100
- Tier discount: 20% when score ≥ 50

---

## Rate Limits (Future)

Currently: No rate limiting (mock backend)

Recommended for production:
- 100 requests/minute per user
- 10,000 requests/minute per IP

---

## Webhooks (Future)

Recommended events to support:
- `claim.created`
- `claim.approved`
- `claim.rejected`
- `policy.expired`
- `sbt_score.updated`

---

**For the latest OpenAPI schema, visit `/docs` or `/openapi.json`**
