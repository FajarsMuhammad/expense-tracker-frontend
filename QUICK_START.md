# Quick Start Guide - Expense Tracker Frontend

**Ready to Use:** ✅ YES
**Backend Required:** ✅ YES (http://localhost:8081)
**Current Status:** Phase 2 Complete - Wallet Management Ready

---

## 🚀 Start the Application

### 1. Start Backend (Required)
```bash
# In your backend directory
cd ../backend
./mvnw spring-boot:run

# Backend should run on: http://localhost:8081
```

### 2. Start Frontend
```bash
# In this directory
npm run dev

# Frontend runs on: http://localhost:5173/
```

### 3. Access Application
Open browser: **http://localhost:5173/**

---

## 👤 First-Time Setup

### Create Account
1. Go to http://localhost:5173/register
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123 (min 6 characters)
3. Click "Register"
4. Auto-redirect to dashboard

### Login
1. Go to http://localhost:5173/login
2. Enter email and password
3. Click "Login"
4. Redirect to dashboard

---

## 💰 Using Wallet Management

### View Wallets
- Click "Wallets" in sidebar
- Or navigate to: http://localhost:5173/wallets

### Create Wallet
1. Click "Create Wallet" button
2. Fill in:
   - **Name:** e.g., "My Cash Wallet"
   - **Currency:** Select from 7 options (IDR, USD, EUR, GBP, JPY, SGD, MYR)
   - **Initial Balance:** e.g., 1000000 (optional, defaults to 0)
3. Click "Create Wallet"
4. Redirects to wallet list

**Note:** Free users can only create 1 wallet. Premium users unlimited.

### Edit Wallet
1. From wallet list, click "Edit" button on a wallet
2. Update name, currency, or balance
3. Click "Update Wallet"
4. Saves and redirects to list

### Delete Wallet
1. From wallet list, click "Delete" button
2. Confirm deletion in modal
3. Click "Delete" to confirm
4. Wallet removed from list

---

## 🌍 Supported Currencies

| Currency | Code | Example Balance |
|----------|------|----------------|
| Indonesian Rupiah | IDR | Rp 1.000.000,00 |
| US Dollar | USD | $1,000.00 |
| Euro | EUR | €1.000,00 |
| British Pound | GBP | £1,000.00 |
| Japanese Yen | JPY | ¥1,000 |
| Singapore Dollar | SGD | S$1,000.00 |
| Malaysian Ringgit | MYR | RM1,000.00 |

---

## 🧪 Testing the App

### Test Scenario 1: Basic Flow
```
1. Register new account
2. Login
3. Create a wallet (IDR, 1,000,000)
4. View wallet in list
5. Edit wallet name
6. Delete wallet
7. Logout
```

### Test Scenario 2: Multiple Currencies
```
1. Login
2. Create wallet with USD
3. Check formatting: $1,000.00
4. Create another with EUR (if premium)
5. Check formatting: €1.000,00
```

### Test Scenario 3: Free User Limit
```
1. Login (as free user)
2. Create 1 wallet
3. Try to create second wallet
4. Should see: "Create Wallet" button disabled
5. Message: "Free users can only have 1 wallet"
```

---

## 📱 Available Pages

| Page | URL | Access | Description |
|------|-----|--------|-------------|
| Login | `/login` | Guest | User login |
| Register | `/register` | Guest | User registration |
| Dashboard | `/dashboard` | Protected | Dashboard (placeholder) |
| Wallet List | `/wallets` | Protected | List all wallets |
| Create Wallet | `/wallets/create` | Protected | Create new wallet |
| Edit Wallet | `/wallets/:id/edit` | Protected | Edit wallet |

**Protected:** Requires login. Auto-redirect to `/login` if not authenticated.
**Guest:** Only accessible when not logged in. Redirect to `/dashboard` if already logged in.

---

## 🔧 Troubleshooting

### Problem: Can't access app
**Solution:**
```bash
# Check if dev server is running
# Should see: Local: http://localhost:5173/

# If not running:
npm run dev
```

### Problem: Login fails
**Possible Causes:**
1. Backend not running
2. Wrong credentials
3. User not registered

**Solution:**
```bash
# Check backend is running
curl http://localhost:8081/actuator/health

# Should return: {"status":"UP"}
```

### Problem: Can't create wallet
**Possible Causes:**
1. Free user already has 1 wallet
2. Validation error (empty name, no currency)
3. Backend error

**Solution:**
1. Check you're not exceeding free limit
2. Fill all required fields
3. Check browser console for errors (F12)

### Problem: Currency not formatting
**Solution:**
- Refresh the page
- Check browser supports Intl.NumberFormat
- Clear browser cache

### Problem: 401 Unauthorized
**Solution:**
```bash
# Token might be expired
# Logout and login again

# Click "Logout" in header
# Login again with credentials
```

---

## 🎨 UI Components Reference

### Buttons
```vue
<AppButton variant="primary">Primary</AppButton>
<AppButton variant="secondary">Secondary</AppButton>
<AppButton variant="danger">Delete</AppButton>
<AppButton :loading="true">Loading...</AppButton>
```

### Inputs
```vue
<AppInput
  v-model="value"
  label="Name"
  :error="error"
  required
/>
```

### Cards
```vue
<AppCard>
  <template #header>Title</template>
  Content here
  <template #footer>Footer</template>
</AppCard>
```

### Modals
```vue
<AppModal v-model="showModal" title="Confirm">
  Modal content
  <template #footer>
    <AppButton>Confirm</AppButton>
  </template>
</AppModal>
```

---

## 📊 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🔍 Browser DevTools Tips

### Check API Calls
1. Open DevTools (F12)
2. Go to "Network" tab
3. Filter by "Fetch/XHR"
4. Perform action (create wallet)
5. See request/response

### Check Token
```javascript
// In Console tab
localStorage.getItem('token')
// Shows: "eyJhbGciOiJIUzI1NiIs..."
```

### Check User Data
```javascript
// In Console tab
JSON.parse(localStorage.getItem('user'))
// Shows: {id: "...", email: "...", name: "..."}
```

### Clear Storage (Logout Manually)
```javascript
// In Console tab
localStorage.clear()
// Then refresh page
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `PROJECT_STATUS.md` | Complete status & features |
| `INTEGRATION_GUIDE.md` | Backend integration details |
| `PHASE_2_SUMMARY.md` | Phase 2 implementation summary |
| `QUICK_START.md` | This file - quick reference |
| `plan/phase_2_wallet_management.md` | Detailed phase 2 plan |
| `documentations/api_endpoints.md` | API reference |

---

## ✅ Pre-Flight Checklist

Before using the app, ensure:

- [ ] Node.js installed (v18+)
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running on port 8081
- [ ] Frontend running on port 5173
- [ ] Browser opened to http://localhost:5173/
- [ ] No CORS errors in console

---

## 🎯 Quick Navigation

**From Dashboard:**
- Click "Wallets" → Wallet List
- Click "Logout" → Logout and go to login

**From Wallet List:**
- Click "+ Create Wallet" → Create new wallet
- Click "Edit" on wallet card → Edit that wallet
- Click "Delete" on wallet card → Delete confirmation

**From Create/Edit:**
- Fill form → Click "Create/Update Wallet" → Save
- Click "Cancel" → Back to wallet list

---

## 💡 Tips & Tricks

### Keyboard Shortcuts
- **ESC** - Close modal
- **F5** - Refresh (stays logged in)
- **F12** - Open DevTools

### Best Practices
1. **Always test with backend running**
2. **Check console for errors** (F12)
3. **Use different currencies** to see formatting
4. **Test free user limit** by creating 1 wallet
5. **Test delete confirmation** - it's permanent!

### Common Workflows

**Daily Use:**
```
1. Login
2. View wallets
3. Check balances
4. Create/Edit as needed
5. Logout when done
```

**Testing:**
```
1. Register test user
2. Create wallet (each currency)
3. Edit wallet
4. Delete wallet
5. Check empty state
```

---

## 🚨 Important Notes

### Data Persistence
- **Backend:** All data stored in backend database
- **Frontend:** Only token and user info in localStorage
- **Deleting wallet:** Permanent! No undo.

### Security
- **JWT tokens** used for authentication
- **Auto logout** on 401 errors
- **Protected routes** require valid token
- **Tokens expire** - need to re-login

### Limitations
- **Free users:** Max 1 wallet
- **Premium users:** Unlimited wallets
- **Currencies:** 7 supported (cannot add custom)

---

## 🆘 Getting Help

### Check These First
1. Browser console (F12) for errors
2. Network tab for failed API calls
3. Backend logs for server errors
4. `INTEGRATION_GUIDE.md` for API issues

### Common Error Messages

**"Free users can only create 1 wallet"**
- You already have a wallet
- Delete existing or upgrade to premium

**"Wallet name is required"**
- Fill in the wallet name field

**"Please select a currency"**
- Choose a currency from dropdown

**"Failed to load wallets"**
- Backend might be down
- Check backend is running on port 8081

---

## ✨ What's Working

- ✅ User registration
- ✅ User login/logout
- ✅ Session persistence
- ✅ Route protection
- ✅ Wallet CRUD (Create, Read, Update, Delete)
- ✅ 7 currency support
- ✅ Currency formatting
- ✅ Free user limitation
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Responsive design

---

## 🔜 Coming Soon

**Phase 3: Dashboard**
- Summary cards (income, expense, balance)
- Weekly trend chart
- Recent transactions
- Wallet filter

**Phase 4: Categories**
- Manage expense/income categories
- Default categories
- Custom categories

---

**Need More Help?**
- Check `PROJECT_STATUS.md` for full documentation
- See `INTEGRATION_GUIDE.md` for API details
- Read `plan/phase_2_wallet_management.md` for implementation details

**Happy Tracking! 💰**
