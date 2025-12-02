# Milestone 3: Debt Management System

**Status:** 🔴 Not Started
**Priority:** High
**Estimated Duration:** 2-3 weeks
**Dependencies:** Phase 1 (Auth), Phase 2 (Wallets), Phase 3 (Dashboard), Phase 4 (Categories), Phase 5 (Transactions)

---

## 📋 Executive Summary

Implement a comprehensive Debt Management system that allows users to track both payables (money they owe) and receivables (money owed to them). The feature includes payment history tracking, status management, overdue alerts, and full CRUD operations with dashboard integration.

### Business Value
- **Financial Clarity**: Clear distinction between money owed and money to collect
- **Payment Tracking**: Complete history of payments with timeline
- **Proactive Alerts**: Overdue notifications to prevent missed payments
- **Net Position**: Instant visibility of overall debt position
- **Dashboard Integration**: Quick access to debt metrics from main view

---

## 🎯 Feature Overview

### Core Capabilities
1. **Dual Debt Types**
   - PAYABLE: Money you owe to others (liabilities)
   - RECEIVABLE: Money owed to you (assets)

2. **Status Lifecycle**
   - OPEN → PARTIAL → PAID
   - Automatic status updates based on payments

3. **Payment Management**
   - Add partial payments
   - Track payment history timeline
   - Mark as fully paid

4. **Smart Filtering**
   - Filter by type (Payable/Receivable)
   - Filter by status (Open/Partial/Paid)
   - Filter by overdue status
   - Combined filter support

5. **Dashboard Integration**
   - Total payables vs receivables
   - Net debt position
   - Overdue debt alerts
   - Quick navigation to debts

---

## 📊 Data Model

### Debt Entity
```typescript
{
  id: string                    // UUID
  type: 'PAYABLE' | 'RECEIVABLE' // Debt type
  counterpartyName: string      // Person/entity name
  totalAmount: number           // Original debt amount
  remainingAmount: number       // Amount still owed
  paidAmount: number            // Total paid so far
  dueDate: Date                 // Due date
  status: 'OPEN' | 'PARTIAL' | 'PAID'  // Current status
  isOverdue: boolean            // Calculated based on dueDate
  note: string                  // Optional description
  paymentCount: number          // Number of payments made
  payments: Payment[]           // Payment history
  createdAt: Date
  updatedAt: Date
}
```

### Payment Entity
```typescript
{
  id: string          // UUID
  debtId: string      // Parent debt ID
  amount: number      // Payment amount
  paidAt: Date        // Payment date/time
  note: string        // Optional note
}
```

---

## 🏗️ Architecture

### Layer Structure
```
Views (Pages)
    ↓
Composables (Business Logic)
    ↓
Stores (State Management)
    ↓
Services (API Communication)
    ↓
Backend API
```

### File Organization
```
src/
├── config/
│   └── api.config.js          [MODIFY] Add debt endpoints
├── services/
│   └── debt.service.js        [NEW] API communication
├── stores/
│   └── debt.js                [NEW] State management
├── composables/
│   └── useDebt.js             [NEW] Business logic
├── router/
│   └── index.js               [MODIFY] Add debt routes
├── components/
│   ├── debt/                  [NEW FOLDER]
│   │   ├── DebtCard.vue
│   │   ├── DebtList.vue
│   │   ├── DebtForm.vue
│   │   ├── DebtFilters.vue
│   │   ├── DebtStatusBadge.vue
│   │   ├── DebtProgressBar.vue
│   │   ├── PaymentHistory.vue
│   │   ├── PaymentForm.vue
│   │   └── DebtSummaryCard.vue
│   ├── layout/
│   │   └── AppSidebar.vue     [MODIFY] Add navigation
│   └── dashboard/
│       └── (DebtSummaryCard)  [OPTIONAL LOCATION]
├── views/
│   ├── debt/                  [NEW FOLDER]
│   │   ├── DebtListView.vue
│   │   ├── DebtCreateView.vue
│   │   ├── DebtEditView.vue
│   │   └── DebtDetailView.vue
│   └── dashboard/
│       └── DashboardView.vue  [MODIFY] Add debt summary
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation (Week 1, Days 1-2)

#### API Configuration
- [ ] Add `DEBTS` endpoints to `src/config/api.config.js`
  - [ ] BASE: `/debts`
  - [ ] BY_ID: `/debts/:id`
  - [ ] PAYMENTS: `/debts/:id/payments`
  - [ ] MARK_PAID: `/debts/:id/mark-paid`
- [ ] Add `DEBT_STATUS` constants (OPEN, PARTIAL, PAID)
- [ ] Add `DEBT_TYPE` constants (PAYABLE, RECEIVABLE)

#### Service Layer - `src/services/debt.service.js`
- [ ] Create debt.service.js file
- [ ] Implement `getAllDebts(params)` with filters
  - [ ] Support type filter
  - [ ] Support status filter
  - [ ] Support overdue filter
  - [ ] Support pagination (page, size)
- [ ] Implement `getDebtById(id)`
- [ ] Implement `createDebt(debtData)`
- [ ] Implement `updateDebt(id, debtData)`
- [ ] Implement `deleteDebt(id)`
- [ ] Implement `addPayment(debtId, paymentData)`
- [ ] Implement `markAsPaid(debtId)`
- [ ] Add proper error handling
- [ ] Add JSDoc documentation

#### Store Layer - `src/stores/debt.js`
- [ ] Create debt.js store file
- [ ] Define state:
  - [ ] `debts` array
  - [ ] `currentDebt` object
  - [ ] `loading` boolean
  - [ ] `error` object
  - [ ] `pagination` object (page, size, totalElements, totalPages)
  - [ ] `filters` object (type, status, overdue)
- [ ] Implement computed properties:
  - [ ] `hasDebts`
  - [ ] `totalDebts`
  - [ ] `hasMore`
  - [ ] `overdueDebts`
  - [ ] `totalPayable`
  - [ ] `totalReceivable`
  - [ ] `netPosition`
- [ ] Implement actions:
  - [ ] `fetchDebts(params, append)`
  - [ ] `loadMoreDebts()`
  - [ ] `fetchDebtById(id)`
  - [ ] `createDebt(debtData)`
  - [ ] `updateDebt(id, debtData)`
  - [ ] `deleteDebt(id)`
  - [ ] `addPaymentToDebt(id, paymentData)`
  - [ ] `markDebtAsPaid(id)`
  - [ ] `setFilters(newFilters)`
  - [ ] `resetFilters()`

#### Composable Layer - `src/composables/useDebt.js`
- [ ] Create useDebt.js composable file
- [ ] Import and setup stores (debt, ui)
- [ ] Setup storeToRefs for reactive state
- [ ] Implement `loadDebts()` with error handling
- [ ] Implement `loadDebt(id)` with error handling
- [ ] Implement `handleCreateDebt(data)` with:
  - [ ] Client-side validation
  - [ ] Success toast
  - [ ] Navigation to list
- [ ] Implement `handleUpdateDebt(id, data)` with:
  - [ ] Client-side validation
  - [ ] Success toast
  - [ ] Navigation to list
- [ ] Implement `handleDeleteDebt(id)` with:
  - [ ] Confirmation
  - [ ] Success toast
  - [ ] List refresh
- [ ] Implement `handleAddPayment(debtId, data)` with:
  - [ ] Amount validation (<=remaining)
  - [ ] Date validation
  - [ ] Success toast
  - [ ] Detail view refresh
- [ ] Implement `handleMarkAsPaid(debtId)` with:
  - [ ] Confirmation
  - [ ] Success toast
  - [ ] Status update
- [ ] Implement `applyFilters(filters)`
- [ ] Implement `resetFilters()`

#### Routing - `src/router/index.js`
- [ ] Add `/debts` route → DebtListView
- [ ] Add `/debts/create` route → DebtCreateView
- [ ] Add `/debts/:id` route → DebtDetailView
- [ ] Add `/debts/:id/edit` route → DebtEditView
- [ ] Set `requiresAuth: true` on all routes
- [ ] Use lazy loading for all debt views

---

### Phase 2: Basic UI Components (Week 1, Days 3-4)

#### DebtStatusBadge Component
- [ ] Create `src/components/debt/DebtStatusBadge.vue`
- [ ] Define props: `status`, `isOverdue`
- [ ] Implement status color mapping:
  - [ ] OPEN → Blue badge
  - [ ] PARTIAL → Orange badge
  - [ ] PAID → Green badge
- [ ] Add overdue indicator (red exclamation)
- [ ] Support dark mode
- [ ] Add hover tooltips

#### DebtProgressBar Component
- [ ] Create `src/components/debt/DebtProgressBar.vue`
- [ ] Define props: `paidAmount`, `totalAmount`
- [ ] Calculate percentage
- [ ] Implement animated progress bar
- [ ] Add color gradient (red→orange→yellow→green)
- [ ] Display formatted amounts
- [ ] Display percentage label
- [ ] Support dark mode

#### DebtCard Component
- [ ] Create `src/components/debt/DebtCard.vue`
- [ ] Define props: `debt`
- [ ] Define events: `edit`, `delete`, `view`
- [ ] Display debt type badge (PAYABLE/RECEIVABLE)
- [ ] Display counterparty name (prominent)
- [ ] Display status badge
- [ ] Display overdue indicator (if applicable)
- [ ] Display amounts (total, remaining, paid)
- [ ] Add DebtProgressBar integration
- [ ] Display due date with formatting
- [ ] Add hover actions (edit, delete buttons)
- [ ] Implement responsive design
- [ ] Support dark mode
- [ ] Add click handler to view details

#### DebtList Component
- [ ] Create `src/components/debt/DebtList.vue`
- [ ] Define props: `debts`, `loading`, `hasMore`
- [ ] Define events: `edit`, `delete`, `view`, `load-more`
- [ ] Implement grid layout (1/2/3 columns responsive)
- [ ] Add AppSkeleton for loading state
- [ ] Add AppEmpty for no results
- [ ] Add "Load More" button for pagination
- [ ] Pass through events from DebtCard
- [ ] Support dark mode

---

### Phase 3: List View & Filtering (Week 1, Day 5 - Week 2, Day 1)

#### DebtFilters Component
- [ ] Create `src/components/debt/DebtFilters.vue`
- [ ] Define props: `filters`
- [ ] Define events: `apply`, `reset`
- [ ] Implement type filter tabs/dropdown (All/PAYABLE/RECEIVABLE)
- [ ] Implement status dropdown (All/OPEN/PARTIAL/PAID)
- [ ] Implement overdue toggle switch
- [ ] Add "Apply Filters" button
- [ ] Add "Reset Filters" button
- [ ] Show active filter count
- [ ] Implement responsive layout
- [ ] Support dark mode

#### DebtListView
- [ ] Create `src/views/debt/DebtListView.vue`
- [ ] Add page header with title
- [ ] Add "Add Debt" button
- [ ] Implement collapsible filters section
- [ ] Display active filter count badge
- [ ] Add debt summary stats (optional):
  - [ ] Total payables
  - [ ] Total receivables
  - [ ] Net position
  - [ ] Overdue count
- [ ] Integrate DebtFilters component
- [ ] Integrate DebtList component
- [ ] Implement AppConfirmDialog for delete
- [ ] Handle filter changes
- [ ] Handle load more pagination
- [ ] Handle edit action → navigate to edit view
- [ ] Handle delete action → confirm and delete
- [ ] Handle view action → navigate to detail view
- [ ] Load debts on mount
- [ ] Implement responsive design
- [ ] Support dark mode

---

### Phase 4: Create & Edit Views (Week 2, Days 2-3)

#### DebtForm Component
- [ ] Create `src/components/debt/DebtForm.vue`
- [ ] Define props: `debt` (optional), `loading`
- [ ] Define events: `submit`, `cancel`
- [ ] Implement form fields:
  - [ ] Type selection (PAYABLE/RECEIVABLE) - radio or toggle
  - [ ] Counterparty name input
  - [ ] Total amount input
  - [ ] Due date picker
  - [ ] Note textarea
- [ ] Implement validation:
  - [ ] Type: required
  - [ ] Counterparty name: required, not blank
  - [ ] Total amount: required, > 0
  - [ ] Due date: required, >= today
  - [ ] Note: optional, max 500 chars
- [ ] Show validation errors inline
- [ ] Detect edit mode via props
- [ ] Pre-populate form in edit mode
- [ ] Add submit button with loading state
- [ ] Add cancel button
- [ ] Implement responsive layout
- [ ] Support dark mode

#### DebtCreateView
- [ ] Create `src/views/debt/DebtCreateView.vue`
- [ ] Add page header with back button
- [ ] Set title: "Create Debt"
- [ ] Integrate DebtForm component
- [ ] Handle submit → call handleCreateDebt
- [ ] Handle cancel → navigate back
- [ ] Implement responsive design
- [ ] Support dark mode

#### DebtEditView
- [ ] Create `src/views/debt/DebtEditView.vue`
- [ ] Add page header with back button
- [ ] Set title: "Edit Debt"
- [ ] Load debt by route.params.id on mount
- [ ] Show AppSkeleton while loading
- [ ] Integrate DebtForm component with debt prop
- [ ] Handle submit → call handleUpdateDebt
- [ ] Handle cancel → navigate back
- [ ] Handle not found → show error
- [ ] Implement responsive design
- [ ] Support dark mode

---

### Phase 5: Detail View & Payment Management (Week 2, Days 4-5)

#### PaymentHistory Component
- [ ] Create `src/components/debt/PaymentHistory.vue`
- [ ] Define props: `payments`
- [ ] Display payments in reverse chronological order
- [ ] Implement timeline visual:
  - [ ] Payment number indicator
  - [ ] Connecting lines
  - [ ] Icons for each payment
- [ ] Display for each payment:
  - [ ] Amount (prominent, formatted)
  - [ ] Date/time (formatted)
  - [ ] Note (if any)
  - [ ] Payment number
- [ ] Add empty state for no payments
- [ ] Implement responsive design
- [ ] Support dark mode

#### PaymentForm Component
- [ ] Create `src/components/debt/PaymentForm.vue`
- [ ] Define props: `debt`, `loading`
- [ ] Define events: `submit`, `cancel`
- [ ] Implement form fields:
  - [ ] Amount input (with max: remainingAmount)
  - [ ] Paid at datetime picker (max: now)
  - [ ] Note textarea
- [ ] Implement validation:
  - [ ] Amount: required, > 0, <= remainingAmount
  - [ ] Paid at: required, <= now
  - [ ] Note: optional, max 200 chars
- [ ] Show validation errors inline
- [ ] Show remaining amount info
- [ ] Add submit button with loading state
- [ ] Add cancel button
- [ ] Implement responsive layout
- [ ] Support dark mode

#### DebtDetailView
- [ ] Create `src/views/debt/DebtDetailView.vue`
- [ ] Add page header with:
  - [ ] Back button
  - [ ] Edit button
  - [ ] Delete button
- [ ] Load debt by route.params.id on mount
- [ ] Show AppSkeleton while loading
- [ ] Implement debt summary section:
  - [ ] Counterparty name (large, prominent)
  - [ ] Debt type badge (PAYABLE/RECEIVABLE)
  - [ ] Status badge
  - [ ] Overdue indicator (if applicable)
  - [ ] Total amount
  - [ ] Remaining amount (highlighted)
  - [ ] Paid amount
  - [ ] DebtProgressBar integration
- [ ] Implement debt information section:
  - [ ] Due date with formatting
  - [ ] Days until due / days overdue
  - [ ] Payment count
  - [ ] Note
  - [ ] Created date
  - [ ] Updated date
- [ ] Implement payment history section:
  - [ ] Section header
  - [ ] PaymentHistory component integration
  - [ ] "Add Payment" button
- [ ] Implement "Add Payment" modal:
  - [ ] AppModal wrapper
  - [ ] PaymentForm integration
  - [ ] Handle submit → call handleAddPayment
  - [ ] Close on success
- [ ] Implement "Mark as Paid" button:
  - [ ] Show only if status !== PAID
  - [ ] Confirmation dialog
  - [ ] Call handleMarkAsPaid
- [ ] Implement delete confirmation dialog
- [ ] Handle edit → navigate to edit view
- [ ] Handle delete → confirm and delete → navigate to list
- [ ] Implement responsive design
- [ ] Support dark mode

---

### Phase 6: Navigation & Dashboard Integration (Week 3, Days 1-2)

#### Navigation Integration
- [ ] Open `src/components/layout/AppSidebar.vue`
- [ ] Add "Debts" navigation item:
  - [ ] Label: "Debts"
  - [ ] Path: `/debts`
  - [ ] Icon: Money/receipt heroicon
  - [ ] Position: After Categories
- [ ] Test navigation active state
- [ ] Test mobile sidebar with new item

#### DebtSummaryCard Component
- [ ] Create `src/components/debt/DebtSummaryCard.vue` or `src/components/dashboard/DebtSummaryCard.vue`
- [ ] Define props: summary data object
- [ ] Display metrics:
  - [ ] Total Payables (red/warning color)
    - [ ] Label: "You Owe"
    - [ ] Amount formatted
  - [ ] Total Receivables (green/success color)
    - [ ] Label: "Owed to You"
    - [ ] Amount formatted
  - [ ] Net Position
    - [ ] Label: "Net Position"
    - [ ] Amount formatted
    - [ ] Color: green if positive, red if negative
  - [ ] Overdue Count
    - [ ] Alert badge
    - [ ] Count of overdue debts
    - [ ] Warning indicator
- [ ] Add "View All Debts" button
- [ ] Implement card layout matching other dashboard cards
- [ ] Implement responsive design
- [ ] Support dark mode

#### Dashboard Integration
- [ ] Open `src/views/dashboard/DashboardView.vue`
- [ ] Import useDebt composable
- [ ] Import DebtSummaryCard component
- [ ] Add debt summary loading on mount:
  - [ ] Call loadDebts or load summary
  - [ ] Calculate metrics (totalPayable, totalReceivable, netPosition, overdueCount)
- [ ] Add DebtSummaryCard to layout:
  - [ ] Position: After weekly trend or recent transactions
  - [ ] Adjust grid layout if needed
- [ ] Pass summary data to DebtSummaryCard
- [ ] Test loading states
- [ ] Test with no debts scenario
- [ ] Test with overdue debts scenario

---

## 🎨 UI/UX Specifications

### Color Coding

#### Debt Types
- **PAYABLE** (Liabilities)
  - Primary: `bg-red-100 dark:bg-red-900/20`
  - Text: `text-red-700 dark:text-red-300`
  - Border: `border-red-300 dark:border-red-700`
  - Badge: Red background with "You Owe" label

- **RECEIVABLE** (Assets)
  - Primary: `bg-green-100 dark:bg-green-900/20`
  - Text: `text-green-700 dark:text-green-300`
  - Border: `border-green-300 dark:border-green-700`
  - Badge: Green background with "Owed to You" label

#### Status Colors
- **OPEN**
  - Badge: `bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300`
  - Label: "Open"

- **PARTIAL**
  - Badge: `bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300`
  - Label: "Partial"

- **PAID**
  - Badge: `bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300`
  - Label: "Paid"

#### Overdue Indicator
- Background: `bg-red-100 dark:bg-red-900/20`
- Text: `text-red-700 dark:text-red-300`
- Icon: Exclamation circle
- Label: "OVERDUE" or "X days overdue"

### Progress Bar Gradient
```css
/* Based on percentage */
0-33%:   from-red-400 to-orange-400
34-66%:  from-orange-400 to-yellow-400
67-99%:  from-yellow-400 to-green-400
100%:    from-green-400 to-green-600
```

### Typography
- Counterparty Name: `text-xl font-bold` (card), `text-3xl font-bold` (detail)
- Amounts: `text-2xl font-semibold` (primary), `text-lg` (secondary)
- Labels: `text-sm text-neutral-600 dark:text-neutral-400`
- Due Dates: `text-sm text-neutral-700 dark:text-neutral-300`

### Spacing & Layout
- Card padding: `p-6`
- Card gap: `gap-6`
- Grid gap: `gap-6`
- Section spacing: `mb-8`

---

## 🧪 Testing Scenarios

### Functional Tests

#### Create Debt
- [ ] Create payable debt with all fields
- [ ] Create receivable debt with all fields
- [ ] Create debt with minimum fields (no note)
- [ ] Validate required fields
- [ ] Validate amount > 0
- [ ] Validate due date >= today
- [ ] Verify toast notification
- [ ] Verify navigation to list
- [ ] Verify debt appears in list

#### Edit Debt
- [ ] Load debt data correctly
- [ ] Update counterparty name
- [ ] Update amount
- [ ] Update due date
- [ ] Update note
- [ ] Validate all fields
- [ ] Verify toast notification
- [ ] Verify changes in list
- [ ] Test cancel button

#### Delete Debt
- [ ] Delete debt without payments
- [ ] Delete debt with payments
- [ ] Confirm deletion dialog shows
- [ ] Cancel deletion
- [ ] Proceed with deletion
- [ ] Verify toast notification
- [ ] Verify removed from list

#### Add Payment
- [ ] Add first payment (OPEN → PARTIAL)
- [ ] Add multiple payments
- [ ] Add payment that settles debt (→ PAID)
- [ ] Validate amount > 0
- [ ] Validate amount <= remaining
- [ ] Validate paid date <= now
- [ ] Verify remaining amount updates
- [ ] Verify status updates
- [ ] Verify payment appears in history
- [ ] Verify toast notification

#### Mark as Paid
- [ ] Mark OPEN debt as paid
- [ ] Mark PARTIAL debt as paid
- [ ] Verify confirmation dialog
- [ ] Cancel marking as paid
- [ ] Proceed with marking as paid
- [ ] Verify status changes to PAID
- [ ] Verify remaining amount = 0
- [ ] Verify toast notification

#### Filtering
- [ ] Filter by type (PAYABLE only)
- [ ] Filter by type (RECEIVABLE only)
- [ ] Filter by status (OPEN only)
- [ ] Filter by status (PARTIAL only)
- [ ] Filter by status (PAID only)
- [ ] Filter by overdue (true)
- [ ] Combine multiple filters
- [ ] Reset filters
- [ ] Verify filter count badge

#### Pagination
- [ ] Load initial page
- [ ] Click "Load More"
- [ ] Verify new debts append
- [ ] Test until last page
- [ ] Verify "Load More" hides on last page

### UI/UX Tests

#### Responsive Design
- [ ] Test on mobile (320px - 767px)
  - [ ] List view single column
  - [ ] Filters collapse/expand
  - [ ] Cards stack vertically
  - [ ] Forms are usable
  - [ ] Navigation accessible
- [ ] Test on tablet (768px - 1023px)
  - [ ] List view two columns
  - [ ] Filters visible/collapsible
  - [ ] Cards fit properly
  - [ ] Detail view layout works
- [ ] Test on desktop (1024px+)
  - [ ] List view three columns
  - [ ] Filters always visible (optional)
  - [ ] All content visible
  - [ ] Optimal spacing

#### Dark Mode
- [ ] All components render correctly
- [ ] Colors maintain contrast
- [ ] Badges visible
- [ ] Progress bar visible
- [ ] Forms readable
- [ ] Status indicators clear

#### Loading States
- [ ] List view skeleton
- [ ] Detail view skeleton
- [ ] Form submission loading
- [ ] Button loading states
- [ ] Payment form loading

#### Empty States
- [ ] No debts message
- [ ] No payments message
- [ ] No search results message
- [ ] Filtered results empty

#### Error States
- [ ] Network error handling
- [ ] Validation errors display
- [ ] 404 debt not found
- [ ] Permission errors

### Accessibility Tests
- [ ] All buttons have aria-labels
- [ ] Forms have proper labels
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Screen reader compatible

### Performance Tests
- [ ] Initial load time
- [ ] Filter response time
- [ ] Pagination smooth
- [ ] No unnecessary re-renders

---

## ✅ Acceptance Criteria

### Must Have (MVP)
- [ ] Users can create payable and receivable debts
- [ ] Users can view list of all debts with filtering
- [ ] Users can add payments to debts
- [ ] Payment history is visible in detail view
- [ ] Status automatically updates (OPEN/PARTIAL/PAID)
- [ ] Overdue debts are clearly indicated
- [ ] Progress bar shows payment completion
- [ ] Users can mark debts as fully paid
- [ ] Users can edit and delete debts
- [ ] Debt summary appears on dashboard
- [ ] Navigation includes "Debts" menu item
- [ ] All views are responsive
- [ ] Dark mode fully supported

### Should Have (Enhancement)
- [ ] Export debts to CSV
- [ ] Debt reminders/notifications
- [ ] Recurring debts
- [ ] Attach documents to debts
- [ ] Multi-currency support
- [ ] Interest calculations

### Nice to Have (Future)
- [ ] Email/SMS notifications for due dates
- [ ] Integration with accounting software
- [ ] Debt analytics and reports
- [ ] Debt forecasting
- [ ] Split debts among multiple people

---

## 📦 Dependencies

### Prerequisites
- ✅ Phase 1: Authentication system (completed)
- ✅ Phase 2: Wallet management (completed)
- ✅ Phase 3: Dashboard (completed)
- ✅ Phase 4: Categories (completed)
- ✅ Phase 5: Transactions (completed)
- ✅ Backend API for debts (ready)

### External Dependencies
- Vue 3 (Composition API)
- Vue Router
- Pinia (state management)
- Axios (HTTP client)
- TailwindCSS
- Heroicons

### Internal Dependencies
- Common UI components (AppButton, AppModal, AppCard, etc.)
- Layout components (AppLayout, AppSidebar)
- UI store for toast notifications
- Date/currency formatting utilities

---

## 📈 Success Metrics

### Technical Metrics
- [ ] All 17 files created successfully
- [ ] Zero console errors
- [ ] All routes functional
- [ ] All API calls successful
- [ ] Loading states work correctly
- [ ] Error handling comprehensive

### User Experience Metrics
- [ ] List view loads in < 2s
- [ ] Detail view loads in < 1s
- [ ] Filters apply instantly
- [ ] Forms submit in < 1s
- [ ] No UI jank or layout shifts
- [ ] Touch targets >= 44x44px (mobile)

### Business Metrics
- [ ] Users can track debts end-to-end
- [ ] Payment history is clear and accurate
- [ ] Dashboard provides quick insights
- [ ] Net position calculation correct
- [ ] Overdue alerts are noticeable

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All unit tests pass (if applicable)
- [ ] All integration tests pass (if applicable)
- [ ] Manual testing complete
- [ ] Code review completed
- [ ] Documentation updated
- [ ] API endpoints verified
- [ ] Environment variables set

### Post-Deployment
- [ ] Monitor error logs
- [ ] Test production deployment
- [ ] Verify API connections
- [ ] Check responsive design on real devices
- [ ] Verify dark mode
- [ ] Test with real user data
- [ ] Collect user feedback

---

## 📝 Notes

### Design Decisions

**Why separate PAYABLE and RECEIVABLE?**
- Clearer business semantics
- Better reporting capabilities
- Matches accounting conventions
- Easier to understand for users
- Allows type-specific features in future (e.g., reminders)

**Why payment history instead of single payment?**
- Real-world debts are often paid in installments
- Provides audit trail
- Enables detailed reporting
- Better matches user behavior

**Why dashboard integration?**
- Debts are critical financial data
- Users need quick visibility
- Reduces navigation clicks
- Increases feature discovery

### Technical Decisions

**Why Pinia over Vuex?**
- Better TypeScript support
- Simpler API
- Composition API friendly
- Official Vue recommendation

**Why separate service layer?**
- Clean separation of concerns
- Easy to mock for testing
- Centralized API logic
- Reusable across composables

**Why composables pattern?**
- Reusable business logic
- Better than mixins
- Composition API native
- Easy to test

---

## 🔗 References

### Internal Documentation
- [Backend API Documentation](../../documentations/api_endpoints.md#debts)
- [Frontend Plan](../frontend_plan.md)
- [Phase 5 Documentation](../phase_5_polish_enhancement.md)

### Code References
- Transaction feature (similar patterns)
- Category feature (type filtering)
- Wallet feature (CRUD operations)
- Dashboard components (summary cards)

### External Resources
- [Vue 3 Documentation](https://vuejs.org)
- [Pinia Documentation](https://pinia.vuejs.org)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)

---

**Last Updated:** 2025-12-02
**Document Version:** 1.0
**Author:** Claude Code
**Status:** Ready for Implementation 🚀
