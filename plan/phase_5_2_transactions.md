Phase 5: Transaction Management - Implementation Plan

 Executive Summary

 Complete implementation of Transaction Management system for the Expense Tracker Vue 3
 application. This builds on Phases 1-4 (Auth, Wallets, Dashboard, Categories) and provides
 full CRUD functionality for income and expense transactions with advanced filtering and
 pagination.

 Timeline: 1-2 weeks (10 days)
 Files to Create: 13 new files
 Files to Modify: 2 existing files

 ---
 Current State Analysis

 ✅ What Exists

 - Transaction API endpoints configured in api.config.js
 - Dashboard displays recent transactions (read-only) via RecentTransactions.vue
 - Transaction types defined (INCOME, EXPENSE)
 - Weekly trend chart consumes transaction data
 - Link to /transactions exists but route not implemented

 ❌ What's Missing

 - Transaction store (Pinia state management)
 - Transaction service (API integration)
 - Transaction composable (business logic)
 - Transaction CRUD components
 - Transaction views (List, Create, Edit)
 - Router configuration for transaction routes
 - Sidebar navigation item

 ---
 Architecture & Data Flow

 ┌─────────────────────────────────────────────┐
 │  View Layer                                 │
 │  - TransactionListView                      │
 │  - TransactionCreateView                    │
 │  - TransactionEditView                      │
 └──────────────────┬──────────────────────────┘
                    │
 ┌──────────────────▼──────────────────────────┐
 │  Composable Layer                           │
 │  - useTransaction.js                        │
 │  - Business logic, validation, toasts       │
 └──────────────────┬──────────────────────────┘
                    │
 ┌──────────────────▼──────────────────────────┐
 │  Store Layer (Pinia)                        │
 │  - transaction.js                           │
 │  - State: transactions, pagination, filters │
 │  - Actions: CRUD, pagination, filtering     │
 └──────────────────┬──────────────────────────┘
                    │
 ┌──────────────────▼──────────────────────────┐
 │  Service Layer                              │
 │  - transaction.service.js                   │
 │  - API calls, query string building         │
 └──────────────────┬──────────────────────────┘
                    │
 ┌──────────────────▼──────────────────────────┐
 │  Backend API                                │
 │  - GET/POST/PUT/DELETE /api/v1/transactions │
 └─────────────────────────────────────────────┘

 ---
 Implementation Breakdown

 1. Service Layer

 File: src/services/transaction.service.js

 Methods:
 export default {
   // GET /api/v1/transactions?walletId=xxx&categoryId=xxx&type=INCOME&from=2025-01-01&to=2025
 -12-31&page=0&size=20
   async getAllTransactions(params) {
     // Build query string from params object
     // Returns paginated response
   },

   // GET /api/v1/transactions/:id
   async getTransactionById(id) {
     // Returns single transaction
   },

   // POST /api/v1/transactions
   async createTransaction(data) {
     // Body: { walletId, categoryId, type, amount, note, date }
     // Returns created transaction
   },

   // PUT /api/v1/transactions/:id
   async updateTransaction(id, data) {
     // Body: same as create
     // Returns updated transaction
   },

   // DELETE /api/v1/transactions/:id
   async deleteTransaction(id) {
     // Returns nothing (204)
   }
 }

 Query String Building:
 - Use URLSearchParams for clean query construction
 - Support filters: walletId, categoryId, type, from, to
 - Support pagination: page, size
 - Defaults: page=0, size=20

 ---
 2. Store Layer

 File: src/stores/transaction.js

 State:
 {
   transactions: [],           // Current page of transactions
   currentTransaction: null,   // For detail/edit view
   loading: false,
   error: null,

   // Pagination
   pagination: {
     page: 0,
     size: 20,
     totalElements: 0,
     totalPages: 0,
     first: true,
     last: false
   },

   // Filters
   filters: {
     walletId: null,
     categoryId: null,
     type: null,        // 'INCOME' | 'EXPENSE' | null
     dateFrom: null,    // ISO date string
     dateTo: null       // ISO date string
   }
 }

 Actions:
 - fetchTransactions(params, append = false) - Get paginated list (append for load more)
 - loadMoreTransactions() - Load next page and append to current list
 - fetchTransactionById(id) - Get single transaction
 - createTransaction(data) - Create new
 - updateTransaction(id, data) - Update existing
 - deleteTransaction(id) - Delete
 - setFilters(newFilters) - Update filter state and reset to page 0
 - resetFilters() - Clear all filters and reset to page 0

 Computed Properties:
 - hasTransactions - Boolean
 - totalTransactions - From pagination
 - currentPage, totalPages
 - hasMore - Boolean (true if not on last page)
 - incomeTotal, expenseTotal - Sums for all loaded transactions

 ---
 3. Composable Layer

 File: src/composables/useTransaction.js

 Purpose: Business logic wrapper (follows useWallet.js, useCategory.js pattern)

 Functions:
 - loadTransactions() - Load first page with current filters
 - loadMoreTransactions() - Load next page and append to list
 - loadTransaction(id) - Load single transaction
 - handleCreateTransaction(data) - Create with validation & toast
 - handleUpdateTransaction(id, data) - Update with validation & toast
 - handleDeleteTransaction(id) - Delete with confirmation & toast
 - applyFilters(newFilters) - Apply filters, reset to page 0, and reload
 - resetFilters() - Clear filters, reset to page 0, and reload

 Validation:
 - Required: walletId, categoryId, type, amount > 0, date
 - Optional: note (max 500 chars)
 - Amount must be positive number
 - Date cannot be in the future

 Error Handling:
 - Toast notifications for all operations
 - Router navigation on success
 - Error propagation for view-level handling

 ---
 4. Component Layer

 4.1 TransactionForm.vue

 File: src/components/transaction/TransactionForm.vue

 Props:
 - transaction (Object, default: null) - For edit mode
 - loading (Boolean, default: false)
 - wallets (Array, required) - Available wallets
 - categories (Array, required) - Available categories

 Emits: ['submit', 'cancel']

 Form Fields:
 1. Type Toggle - INCOME/EXPENSE radio buttons (emerald/rose colors)
 2. Wallet Selector - Dropdown showing name + currency
 3. Category Selector - Filtered by selected type
 4. Amount Input - Number, step=0.01, min=0.01
 5. Date Input - HTML5 date picker, max=today
 6. Note - Textarea, optional, maxlength=500
 7. Submit/Cancel Buttons

 Key Features:
 - Dynamic category filtering based on type
 - Type change resets category if invalid
 - Pre-population in edit mode
 - Type disabled in edit mode
 - Validation: all required fields, amount > 0
 - Dark mode support

 Pattern Reference: Follow WalletForm.vue and CategoryForm.vue

 ---
 4.2 TransactionCard.vue

 File: src/components/transaction/TransactionCard.vue

 Props:
 - transaction (Object, required)

 Emits: ['edit', 'delete']

 Display:
 - Type badge (INCOME/EXPENSE with color)
 - Category badge (using CategoryBadge component)
 - Amount (+ for income, - for expense, color-coded)
 - Date (formatted with dayjs)
 - Note (truncated to 100 chars if long)
 - Wallet name
 - Edit/Delete buttons (only shown on hover)

 Design:
 - AppCard base with hover effects
 - Similar to RecentTransactions.vue item styling
 - Dark mode support
 - Responsive (stack on mobile)

 ---
 4.3 TransactionList.vue

 File: src/components/transaction/TransactionList.vue

 Props:
 - transactions (Array, required)
 - loading (Boolean)
 - pagination (Object) - page, size, totalElements, totalPages
 - hasMore (Boolean) - Indicates if more transactions available

 Emits:
 - ['edit', 'delete', 'load-more']

 Features:
 - Summary header (Total X transactions loaded)
 - Loading skeleton (AppSkeleton)
 - Empty state (AppEmpty)
 - Grid of TransactionCards
 - Load More Button at bottom (shows when hasMore is true)
   - "Load More" button (primary variant)
   - Shows loading spinner when loading
   - Disabled when no more transactions
 - Income/Expense totals for loaded transactions

 ---
 4.4 TransactionFilters.vue

 File: src/components/transaction/TransactionFilters.vue

 Props:
 - wallets (Array, required)
 - categories (Array, required)
 - filters (Object, required)

 Emits: ['apply', 'reset']

 Filter Controls:
 1. Wallet Dropdown - "All Wallets" + wallet list
 2. Type Dropdown - "All Types", "Income", "Expense"
 3. Category Dropdown - Filtered by type, "All Categories" option
 4. Date From - Date input
 5. Date To - Date input
 6. Apply Filters Button - Primary button
 7. Reset Filters Button - Secondary button

 Features:
 - Category list updates when type changes
 - Clear visual indication of active filters
 - Filter count badge
 - Responsive (full width on mobile)

 Pattern Reference: Similar to WalletFilter.vue but expanded

 ---
 5. View Layer

 5.1 TransactionListView.vue

 File: src/views/transaction/TransactionListView.vue

 Layout:
 - AppLayout wrapper
 - Header: "Transactions" title + "Add Transaction" button
 - Desktop: Single-column layout with filters at top
   - Filters section (full width, collapsible)
   - TransactionList below filters
 - Mobile: Same layout, filters collapsed by default
 - Delete confirmation modal (AppModal)

 Data Loading Sequence:
 1. Load wallets (from wallet store)
 2. Load categories (from category store)
 3. Load transactions (after dependencies loaded)

 State Management:
 - Subscribe to transaction store
 - Subscribe to wallet store (for filter options)
 - Subscribe to category store (for filter options)

 ---
 5.2 TransactionCreateView.vue

 File: src/views/transaction/TransactionCreateView.vue

 Simple Layout:
 - AppLayout wrapper
 - Title: "Create Transaction"
 - AppCard containing TransactionForm
 - Form submission → handleCreateTransaction → navigate to list

 Data Loading:
 - Load wallets on mount
 - Load categories on mount

 Pattern: Exactly follows WalletCreateView.vue structure

 ---
 5.3 TransactionEditView.vue

 File: src/views/transaction/TransactionEditView.vue

 Layout:
 - AppLayout wrapper
 - Title: "Edit Transaction"
 - Loading skeleton while loading
 - AppCard with pre-populated TransactionForm

 Data Loading:
 1. Load transaction by route.params.id
 2. Load wallets
 3. Load categories
 4. Show skeleton until all loaded

 Pattern: Exactly follows WalletEditView.vue structure

 ---
 6. Router Configuration

 File to Modify: src/router/index.js

 Add Routes:
 {
   path: '/transactions',
   name: 'TransactionList',
   component: () => import('@/views/transaction/TransactionListView.vue'),
   meta: { requiresAuth: true },
 },
 {
   path: '/transactions/create',
   name: 'TransactionCreate',
   component: () => import('@/views/transaction/TransactionCreateView.vue'),
   meta: { requiresAuth: true },
 },
 {
   path: '/transactions/:id/edit',
   name: 'TransactionEdit',
   component: () => import('@/views/transaction/TransactionEditView.vue'),
   meta: { requiresAuth: true },
 },

 ---
 7. Navigation Integration

 File to Modify: src/components/layout/AppSidebar.vue

 Add to navItems array (after Categories):
 {
   path: '/transactions',
   label: 'Transactions',
   icon: (props) => h('svg', {
     ...props,
     fill: 'none',
     stroke: 'currentColor',
     viewBox: '0 0 24 24'
   }, [
     h('path', {
       'stroke-linecap': 'round',
       'stroke-linejoin': 'round',
       'stroke-width': '2',
       d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 
 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
     })
   ])
 }

 Icon: Clipboard list icon (matches transaction management theme)

 ---
 8. Implementation Phases

 Phase 1: Foundation (Days 1-2)

 Files to Create:
 - src/services/transaction.service.js
 - src/stores/transaction.js
 - src/composables/useTransaction.js

 Tasks:
 - Implement all service methods
 - Create store with state, actions, computed
 - Create composable with business logic
 - Test CRUD operations via console/debugging

 Testing: Verify API calls work, state updates correctly

 ---
 Phase 2: Core Components (Days 3-4)

 Files to Create:
 - src/components/transaction/TransactionForm.vue
 - src/components/transaction/TransactionCard.vue

 Tasks:
 - Build form with all fields and validation
 - Create card component matching design system
 - Test form validation
 - Test edit mode pre-population

 Testing: Form submits correctly, validation works, dark mode renders

 ---
 Phase 3: List Components (Days 5-6)

 Files to Create:
 - src/components/transaction/TransactionList.vue
 - src/components/transaction/TransactionFilters.vue

 Tasks:
 - Build list with pagination
 - Build filters with dynamic category filtering
 - Wire up pagination events
 - Wire up filter events

 Testing: Load more works, filters apply correctly, empty states

 ---
 Phase 4: Views (Days 7-8)

 Files to Create:
 - src/views/transaction/TransactionListView.vue
 - src/views/transaction/TransactionCreateView.vue
 - src/views/transaction/TransactionEditView.vue

 Tasks:
 - Build list view with filters sidebar
 - Build create view
 - Build edit view
 - Connect to router
 - Add sidebar navigation

 Files to Modify:
 - src/router/index.js - Add routes
 - src/components/layout/AppSidebar.vue - Add nav item

 Testing: Navigation works, all CRUD flows complete

 ---
 Phase 5: Polish & Testing (Days 9-10)

 Tasks:
 - Responsive design review (mobile/tablet)
 - Loading states verification
 - Toast notifications testing
 - Error handling edge cases
 - Cross-browser testing
 - Accessibility review
 - Performance optimization

 Testing Checklist:
 - Create transaction works
 - Edit transaction pre-populates correctly
 - Delete transaction shows confirmation
 - Filters apply and reset correctly
 - Pagination navigates correctly
 - Page size change reloads data
 - Type change filters categories
 - Date range validation works
 - Amount validation (positive only)
 - Toast notifications appear for all actions
 - Loading skeletons show during API calls
 - Empty state shows when no transactions
 - Dark mode works on all components
 - Mobile responsive layout works
 - Sidebar navigation highlights active
 - Form validation prevents invalid submissions

 ---
 Files Summary

 Files to Create (13 total)

 Services:
 1. src/services/transaction.service.js

 Stores:
 2. src/stores/transaction.js

 Composables:
 3. src/composables/useTransaction.js

 Components:
 4. src/components/transaction/TransactionForm.vue
 5. src/components/transaction/TransactionCard.vue
 6. src/components/transaction/TransactionList.vue
 7. src/components/transaction/TransactionFilters.vue

 Views:
 8. src/views/transaction/TransactionListView.vue
 9. src/views/transaction/TransactionCreateView.vue
 10. src/views/transaction/TransactionEditView.vue

 Files to Modify (2 total)

 11. src/router/index.js - Add transaction routes
 12. src/components/layout/AppSidebar.vue - Add Transactions nav item

 ---
 Key Features

 1. Full Transaction CRUD - Create, read, update, delete transactions
 2. Advanced Filtering - By wallet, category, type, date range
 3. Load More Pagination - Simple button-based pagination that appends results
 4. Type-Based Categorization - Income/Expense with color coding
 5. Category Integration - CategoryBadge component reuse
 6. Wallet Integration - Filter and select from user's wallets
 7. Date Management - Date pickers with validation
 8. Responsive Design - Mobile-first approach
 9. Dark Mode Support - All components styled for dark mode
 10. Toast Notifications - Success/error feedback for all operations
 11. Loading States - Skeletons during API calls
 12. Empty States - When no transactions exist
 13. Form Validation - Client-side validation before submission
 14. Dedicated Create Page - No quick-add modal, follows wallet/category pattern

 ---
 Design System Consistency

 This implementation maintains alignment with existing patterns:

 Colors:
 - Income: bg-income (emerald #10b981)
 - Expense: bg-expense (rose #f43f5e)
 - Primary: Lavender gradient
 - Neutral: Dark mode compatible grays

 Typography:
 - Headings: font-display font-bold
 - Body: font-sans
 - Muted text: .text-muted utility

 Spacing:
 - Cards: px-6 py-4
 - Gaps: gap-4, gap-6
 - Margins: mb-6 for sections

 Borders:
 - Radius: rounded-2xl (primary), rounded-xl (secondary)
 - Borders: border-neutral-200 dark:border-dark-border

 Shadows:
 - Elevated: shadow-soft-xl
 - Hover: hover:shadow-glow-primary

 Animations:
 - Duration: duration-300
 - Easing: ease-out, ease-in
 - Transforms: scale-110, translate-y-[-2px]

 ---
 Critical Reference Files

 Study these files before implementation to maintain consistency:

 Store Pattern:
 - src/stores/wallet.js - State structure, actions, computed properties

 Composable Pattern:
 - src/composables/useWallet.js - Business logic, toast integration, error handling
 - src/composables/useCategory.js - Duplicate name validation pattern

 Form Pattern:
 - src/components/wallet/WalletForm.vue - Form structure, validation, edit mode
 - src/components/category/CategoryForm.vue - Type selector, disabled fields

 List View Pattern:
 - src/views/wallet/WalletListView.vue - Layout, modals, empty states
 - src/views/category/CategoryView.vue - Tabs, filtering

 Display Pattern:
 - src/components/dashboard/RecentTransactions.vue - Transaction display styling
 - src/components/wallet/WalletCard.vue - Card hover effects, actions

 Service Pattern:
 - src/services/wallet.service.js - API method structure
 - src/services/category.service.js - Query parameter handling

 ---
 API Response Structures (from api_endpoints.md)

 Single Transaction:
 {
   "id": "uuid",
   "walletId": "uuid",
   "walletName": "Main Wallet",
   "categoryId": "uuid",
   "categoryName": "Food",
   "type": "EXPENSE",
   "amount": 50000.0,
   "note": "Lunch at restaurant",
   "date": "2025-11-24T12:00:00Z",
   "createdAt": "2025-11-24T12:00:00Z",
   "updatedAt": "2025-11-24T12:00:00Z"
 }

 Paginated List:
 {
   "content": [...transactions],
   "pageable": {
     "pageNumber": 0,
     "pageSize": 20
   },
   "totalElements": 100,
   "totalPages": 5,
   "last": false,
   "first": true
 }

 Create/Update Payload:
 {
   "walletId": "uuid",
   "categoryId": "uuid",
   "type": "EXPENSE",
   "amount": 50000.0,
   "note": "Optional note",
   "date": "2025-11-24T12:00:00.000Z"
 }

 ---
 Implementation Complete Checklist

 After full implementation, verify:

 Core Functionality:
 - All service methods implemented and tested
 - Store state management works correctly
 - Composable business logic handles all cases
 - All components render correctly

 CRUD Operations:
 - Create transaction form submits successfully
 - Transaction list displays with pagination
 - Edit transaction loads and updates correctly
 - Delete transaction with confirmation works

 Filtering & Pagination:
 - Wallet filter works
 - Category filter works (filtered by type)
 - Type filter works (INCOME/EXPENSE)
 - Date range filter works
 - Reset filters clears all and reloads from page 0
 - Load More button appears when more data available
 - Load More appends transactions to existing list
 - Load More button hidden when no more data
 - Applying new filters resets list to page 0

 UI/UX:
 - Loading states show during API calls
 - Empty state displays when no data
 - Toast notifications for all operations
 - Form validation prevents invalid input
 - Error messages display correctly
 - Success messages display correctly

 Design:
 - Dark mode works on all components
 - Mobile responsive (filters collapsible)
 - Tablet responsive
 - Desktop single-column with filters at top
 - Color coding (income/expense) consistent
 - Hover effects work
 - Animations smooth
 - Load More button styling matches design system

 Integration:
 - Sidebar navigation shows Transactions
 - Active route highlights in sidebar
 - Routes protected by auth guard
 - RecentTransactions link to /transactions works
 - Wallet store integration works
 - Category store integration works

 Edge Cases:
 - No wallets - disable create
 - No categories - disable create
 - Type change resets invalid category
 - Date in future prevented
 - Negative amount prevented
 - Empty required fields prevented
 - Long notes truncated in display

 ---
 Next Phase

 After Phase 5 completion, the application will have:
 - Complete transaction management
 - All MVP features delivered
 - Ready for Phase 6: Polish & Enhancement (responsive design, accessibility, final testing)

 ---
 End of Plan