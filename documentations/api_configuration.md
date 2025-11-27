# API Configuration Guide

## Overview

All API endpoints in the Expense Tracker frontend use a centralized configuration system to ensure consistency and easy maintenance. This document explains how the API configuration works.

## Configuration Files

### 1. Environment Variables

API base URLs are defined in environment-specific files:

#### Development (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
VITE_APP_NAME=Expense Tracker
```

#### Production (`.env.production`)
```env
VITE_API_BASE_URL=https://api.expensetracker.com/api/v1
VITE_APP_NAME=Expense Tracker
```

**Note:** The `/api/v1` prefix is included in the base URL to match the backend API structure.

### 2. API Configuration (`src/config/api.config.js`)

This file contains all API endpoint definitions and constants:

```javascript
import { API_ENDPOINTS } from '@/config/api.config'

// Example usage:
API_ENDPOINTS.AUTH.LOGIN           // '/auth/login'
API_ENDPOINTS.WALLETS.BASE         // '/wallets'
API_ENDPOINTS.WALLETS.BY_ID('123') // '/wallets/123'
```

#### Available Endpoint Groups:

**Authentication:**
- `API_ENDPOINTS.AUTH.REGISTER` → `/auth/register`
- `API_ENDPOINTS.AUTH.LOGIN` → `/auth/login`
- `API_ENDPOINTS.AUTH.REFRESH` → `/auth/refresh`

**User:**
- `API_ENDPOINTS.USER.ME` → `/me`

**Wallets:**
- `API_ENDPOINTS.WALLETS.BASE` → `/wallets`
- `API_ENDPOINTS.WALLETS.BY_ID(id)` → `/wallets/{id}`

**Categories:**
- `API_ENDPOINTS.CATEGORIES.BASE` → `/categories`
- `API_ENDPOINTS.CATEGORIES.BY_ID(id)` → `/categories/{id}`
- `API_ENDPOINTS.CATEGORIES.BY_TYPE(type)` → `/categories?type={type}`

**Transactions:**
- `API_ENDPOINTS.TRANSACTIONS.BASE` → `/transactions`
- `API_ENDPOINTS.TRANSACTIONS.BY_ID(id)` → `/transactions/{id}`

**Dashboard:**
- `API_ENDPOINTS.DASHBOARD.SUMMARY` → `/dashboard/summary`
- `API_ENDPOINTS.DASHBOARD.SUMMARY_BY_WALLET(id)` → `/dashboard/summary?walletId={id}`

#### Other Constants:

```javascript
// HTTP Methods
HTTP_METHODS.GET
HTTP_METHODS.POST
HTTP_METHODS.PUT
HTTP_METHODS.DELETE

// HTTP Status Codes
HTTP_STATUS.OK                     // 200
HTTP_STATUS.CREATED                // 201
HTTP_STATUS.BAD_REQUEST           // 400
HTTP_STATUS.UNAUTHORIZED          // 401
// ... etc

// Request timeout
REQUEST_TIMEOUT                    // 30000ms (30 seconds)

// Supported currencies
SUPPORTED_CURRENCIES              // ['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR']

// Transaction types
TRANSACTION_TYPES.INCOME
TRANSACTION_TYPES.EXPENSE

// Category types
CATEGORY_TYPES.INCOME
CATEGORY_TYPES.EXPENSE
```

## How to Use

### In Services

Services should import and use `API_ENDPOINTS` instead of hardcoded strings:

**✅ GOOD:**
```javascript
import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async getAllWallets() {
    const response = await api.get(API_ENDPOINTS.WALLETS.BASE)
    return response.data
  },

  async getWalletById(id) {
    const response = await api.get(API_ENDPOINTS.WALLETS.BY_ID(id))
    return response.data
  }
}
```

**❌ BAD:**
```javascript
// Don't hardcode endpoints
const response = await api.get('/wallets')
const response = await api.get(`/wallets/${id}`)
```

### In Components

Components should use services, not call the API directly:

**✅ GOOD:**
```javascript
import walletService from '@/services/wallet.service'

const wallets = await walletService.getAllWallets()
```

**❌ BAD:**
```javascript
// Don't use api directly in components
import api from '@/services/api'
const response = await api.get('/wallets')
```

## Complete Request Flow

```
Component
    ↓
Composable (optional)
    ↓
Service (uses API_ENDPOINTS from api.config.js)
    ↓
API Instance (uses API_BASE_URL from .env)
    ↓
Backend (http://localhost:8081/api/v1/wallets)
```

## Environment Setup

### Development

1. Ensure `.env.development` exists with correct base URL
2. Run `npm run dev`
3. API calls will point to `http://localhost:8081/api/v1`

### Production

1. Ensure `.env.production` exists with correct base URL
2. Run `npm run build`
3. API calls will point to `https://api.expensetracker.com/api/v1`

## Adding New Endpoints

When adding new endpoints:

1. **Update `src/config/api.config.js`:**
```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints

  NEW_FEATURE: {
    BASE: '/new-feature',
    BY_ID: (id) => `/new-feature/${id}`,
  }
}
```

2. **Create service:**
```javascript
// src/services/new-feature.service.js
import api from './api'
import { API_ENDPOINTS } from '@/config/api.config'

export default {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.NEW_FEATURE.BASE)
    return response.data
  }
}
```

3. **Use in components via composables or directly**

## Benefits

✅ **Centralized Configuration** - All endpoints in one place
✅ **Type Safety** - Functions for parameterized endpoints
✅ **Easy Maintenance** - Update once, applies everywhere
✅ **Environment Flexibility** - Easy switching between dev/prod
✅ **Consistency** - Prevents typos and inconsistencies
✅ **Documentation** - Clear overview of all available endpoints

## Troubleshooting

### API calls returning 404

Check that:
1. `.env.development` has the correct base URL with `/api/v1` prefix
2. Dev server was restarted after changing `.env` files
3. Backend is running on `http://localhost:8081`

### CORS errors

Ensure backend CORS settings allow `http://localhost:5173` in development

### Request timeout

Adjust `REQUEST_TIMEOUT` in `api.config.js` if needed (default: 30 seconds)

## Related Documentation

- [API Endpoints](./api_endpoints.md) - Complete API reference
- [Backend API Documentation](../../backend/README.md) - Backend setup
- [Swagger UI](http://localhost:8081/swagger-ui.html) - Interactive API testing
