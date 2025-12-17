# Backend Integration Guide

**Last Updated:** November 27, 2025

---

## ✅ Integration Status

**Frontend:** ✅ Ready and Running on http://localhost:5173/
**Backend:** ✅ Running on http://localhost:8081
**Integration:** ✅ Complete

---

## 🔗 API Configuration

### Environment Variables

**Development (.env.development):**
```env
VITE_API_BASE_URL=http://localhost:8081
```

**Production (.env.production):**
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

### Axios Configuration

Located in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

**Features:**
- ✅ Automatic JWT token injection
- ✅ Global error handling
- ✅ Auto logout on 401 errors
- ✅ Error message extraction from backend

---

## 🔐 Authentication Flow

### Backend Response Format (Expected)

**Login/Register Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "uuid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Frontend Handling

1. **Token Storage:** Saved to `localStorage.token`
2. **User Storage:** Saved to `localStorage.user` (JSON)
3. **Auto Injection:** Token added to all API requests as `Authorization: Bearer {token}`
4. **Auto Logout:** On 401 response, clears storage and redirects to `/login`

---

## 💰 Wallet Management Integration

### Backend Response Format (Expected)

**Wallet Object:**
```json
{
  "id": "uuid",
  "name": "Main Wallet",
  "currency": "IDR",
  "initialBalance": 1000000.0,
  "currentBalance": 1500000.0,
  "createdAt": "2025-11-27T10:00:00Z",
  "updatedAt": "2025-11-27T10:00:00Z"
}
```

### API Endpoints Mapping

| Frontend Service Method | Backend Endpoint | Method | Request Body |
|------------------------|------------------|--------|--------------|
| `getAllWallets()` | `/wallets` | GET | - |
| `getWalletById(id)` | `/wallets/{id}` | GET | - |
| `createWallet(data)` | `/wallets` | POST | `{name, currency, initialBalance}` |
| `updateWallet(id, data)` | `/wallets/{id}` | PUT | `{name, currency, initialBalance}` |
| `deleteWallet(id)` | `/wallets/{id}` | DELETE | - |

### Frontend Usage Example

```javascript
import { useWallet } from '@/composables/useWallet'

const { wallets, loadWallets, handleCreateWallet } = useWallet()

// Load wallets
await loadWallets()

// Create wallet
await handleCreateWallet({
  name: 'My Wallet',
  currency: 'IDR',
  initialBalance: 1000000
})
```

---

## 🌍 Currency Support

### Supported Currencies

| Code | Name | Symbol | Locale | Decimals |
|------|------|--------|--------|----------|
| IDR | Indonesian Rupiah | Rp | id-ID | 2 |
| USD | US Dollar | $ | en-US | 2 |
| EUR | Euro | € | de-DE | 2 |
| GBP | British Pound | £ | en-GB | 2 |
| JPY | Japanese Yen | ¥ | ja-JP | 0 |
| SGD | Singapore Dollar | S$ | en-SG | 2 |
| MYR | Malaysian Ringgit | RM | ms-MY | 2 |

### Currency Formatting

Frontend automatically formats currency based on locale:

```javascript
import { formatCurrency } from '@/utils/currency'

formatCurrency(1000000, 'IDR') // "Rp 1.000.000,00"
formatCurrency(1000, 'USD')    // "$1,000.00"
formatCurrency(1000, 'JPY')    // "¥1,000"
```

---

## 🔒 Business Rules Implementation

### Free User Wallet Limitation

**Backend Rule:** Free users can only create 1 wallet

**Frontend Implementation:**
```javascript
// In wallet store
const canCreateWallet = computed(() => {
  const isPremium = authStore.user?.subscriptionPlan === 'PREMIUM'
  return isPremium || walletCount.value < 1
})
```

**UI Behavior:**
- If user has 1 wallet (free tier):
  - "Create Wallet" button is hidden
  - Shows message: "Free users can only have 1 wallet. Upgrade to Premium"

- If user tries to create via API:
  - Backend returns 400 error
  - Frontend displays toast: "Free users can only create 1 wallet..."

---

## 🚨 Error Handling

### Backend Error Format (Expected)

```json
{
  "timestamp": "2025-11-27T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Wallet name must not be empty",
  "path": "/wallets",
  "correlationId": "abc-123-def",
  "validationErrors": {
    "name": "must not be blank"
  }
}
```

### Frontend Error Handling

**In API Interceptor (src/services/api.js):**
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message
    const formattedError = {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      correlationId: error.response?.data?.correlationId,
      validationErrors: error.response?.data?.validationErrors,
    }

    // Handle 401 - Auto logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }

    return Promise.reject(formattedError)
  }
)
```

**In Composables:**
```javascript
try {
  await walletStore.createWallet(walletData)
  uiStore.showToast({ message: 'Wallet created!', type: 'success' })
} catch (error) {
  uiStore.showToast({ message: error.message, type: 'error' })
}
```

---

## 🧪 Testing Integration

### Manual Testing Steps

1. **Start Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   # Should run on http://localhost:8081
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Running on http://localhost:5173
   ```

3. **Test Authentication:**
   - Register: POST to `/auth/register`
   - Login: POST to `/auth/login`
   - Check token in localStorage
   - Check Authorization header in Network tab

4. **Test Wallet CRUD:**
   - List: GET `/wallets`
   - Create: POST `/wallets`
   - Update: PUT `/wallets/{id}`
   - Delete: DELETE `/wallets/{id}`

### Using Browser DevTools

**Check API Calls:**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR
4. Perform actions in the app
5. Inspect Request/Response

**Check Token:**
1. Open DevTools Console
2. Run: `localStorage.getItem('token')`
3. Should show JWT token

**Check User Data:**
1. Open DevTools Console
2. Run: `JSON.parse(localStorage.getItem('user'))`
3. Should show user object

---

## 🔍 Troubleshooting

### Issue: CORS Errors

**Symptoms:** Browser console shows CORS policy errors

**Solution:** Backend must allow CORS from `http://localhost:5173`

**Backend Configuration (Spring Boot):**
```java
@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Issue: 401 Unauthorized

**Symptoms:** All requests return 401

**Possible Causes:**
1. Token expired
2. Token not being sent
3. Backend JWT validation failing

**Solutions:**
1. Check token in localStorage
2. Check Network tab for Authorization header
3. Verify backend JWT secret matches
4. Try logging out and logging in again

### Issue: Network Error / Backend Not Responding

**Symptoms:** "Network Error" or "Failed to fetch"

**Solutions:**
1. Verify backend is running: `curl http://localhost:8081/actuator/health`
2. Check backend port is 8081
3. Verify `.env.development` has correct URL
4. Restart both frontend and backend

### Issue: Wallet Limit Not Working

**Symptoms:** Free users can create multiple wallets

**Possible Causes:**
1. Backend not enforcing limit
2. User subscriptionPlan not set correctly

**Solutions:**
1. Check user object in localStorage
2. Verify backend sends subscriptionPlan in auth response
3. Check backend wallet creation logic

---

## 📊 API Request/Response Examples

### Create Wallet Request

**Frontend Code:**
```javascript
await handleCreateWallet({
  name: 'My Savings',
  currency: 'USD',
  initialBalance: 5000
})
```

**HTTP Request:**
```http
POST http://localhost:8081/wallets
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "My Savings",
  "currency": "USD",
  "initialBalance": 5000
}
```

**Expected Backend Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "My Savings",
  "currency": "USD",
  "initialBalance": 5000.0,
  "currentBalance": 5000.0,
  "createdAt": "2025-11-27T10:30:00Z",
  "updatedAt": "2025-11-27T10:30:00Z"
}
```

---

## ✅ Integration Checklist

- [x] Backend running on http://localhost:8081
- [x] Frontend running on http://localhost:5173
- [x] CORS configured on backend
- [x] Authentication endpoints working
- [x] Wallet CRUD endpoints working
- [x] JWT token auto-injection working
- [x] Error handling working
- [x] 401 auto-logout working
- [x] Currency formatting working
- [x] Free user limitation working
- [x] Toast notifications working

---

## 📚 Reference Documentation

- **API Endpoints:** `documentations/api_endpoints.md`
- **Frontend Plan:** `plan/frontend_plan.md`
- **Phase 2 Checklist:** `plan/phase_2_wallet_management.md`
- **Project Status:** `PROJECT_STATUS.md`

---

**Integration Complete:** November 27, 2025
**Verified By:** Claude Code
