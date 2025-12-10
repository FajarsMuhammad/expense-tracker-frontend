/**
 * English (EN) Locale Messages
 */

export default {
  common: {
    app: {
      name: 'MoneyTrack',
      tagline: 'Track Your Expenses'
    },
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      create: 'Create',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      add: 'Add',
      remove: 'Remove',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      clear: 'Clear',
      view: 'View',
      download: 'Download'
    },
    actions: {
      loading: 'Loading...',
      saving: 'Saving...',
      deleting: 'Deleting...',
      processing: 'Processing...',
      uploading: 'Uploading...',
      downloading: 'Downloading...'
    },
    states: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      failed: 'Failed'
    },
    locale: {
      title: 'Language',
      switchLanguage: 'Switch Language',
      selectLanguage: 'Select Language'
    },
    pagination: {
      showing: 'Showing {from} to {to} of {total} entries',
      noResults: 'No results',
      page: 'Page',
      of: 'of'
    },
    empty: {
      noData: 'No data',
      noResults: 'No results found',
      tryAgain: 'Try again'
    },
    theme: {
      toggle: 'Toggle Theme',
      light: 'Light',
      dark: 'Dark'
    },
    modal: {
      close: 'Close'
    },
    time: {
      justNow: 'Just now',
      minutesAgo: '{count} minute ago | {count} minutes ago',
      hoursAgo: '{count} hour ago | {count} hours ago',
      daysAgo: '{count} day ago | {count} days ago',
      weeksAgo: '{count} week ago | {count} weeks ago',
      monthsAgo: '{count} month ago | {count} months ago',
      yearsAgo: '{count} year ago | {count} years ago'
    }
  },
  navigation: {
    sidebar: {
      dashboard: 'Dashboard',
      wallets: 'Wallets',
      transactions: 'Transactions',
      categories: 'Categories',
      debts: 'Debts',
      reports: 'Reports',
      profile: 'Profile',
      premium: 'Premium'
    },
    menu: {
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Log out'
    }
  },
  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Login to your account',
      appName: 'Expense Tracker',
      appTagline: 'Securely manage your expenses',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign in',
      noAccount: "Don't have an account?",
      createAccount: 'Create account',
      orContinueWith: 'Or continue with',
      loginWithGoogle: 'Login with Google',
      loginWithApple: 'Login with Apple',
      loginWithFacebook: 'Login with Facebook',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required'
    },
    register: {
      title: 'Create Account',
      trialBadge: 'Get 14-Day FREE Premium Trial',
      name: 'Full Name',
      namePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      passwordPlaceholder: 'Minimum 6 characters',
      passwordHint: 'Password must be at least 6 characters',
      registerButton: 'Register',
      trialBenefitsTitle: "What you'll get for 14 days:",
      benefit1: 'Unlimited wallets & debt tracking',
      benefit2: 'Financial reports & analytics',
      benefit3: 'Excel & PDF export',
      benefit4: 'No credit card required',
      hasAccount: 'Already have an account?',
      loginHere: 'Login here',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters'
    }
  },
  dashboard: {
    title: 'Dashboard',
    walletBalance: 'Wallet Balance',
    todayIncome: "Today's Income",
    todayExpense: "Today's Expense",
    netToday: 'Net Today',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    noTransactions: 'No transactions yet',
    uncategorized: 'Uncategorized',
    walletFilter: {
      label: 'Filter by Wallet',
      allWallets: 'All Wallets',
      searchPlaceholder: 'Search wallets...',
      noWalletsFound: 'No wallets found'
    }
  },
  wallets: {
    title: 'Wallets',
    subtitle: 'Manage your financial accounts and balances',
    add: 'Add',
    wallet: 'Wallet',
    currentBalance: 'Current Balance',
    edit: 'Edit',
    delete: 'Delete',
    empty: {
      title: 'No Wallets Yet',
      description: 'Create your first wallet to start tracking your expenses',
      createFirst: 'Create Your First Wallet'
    },
    deleteConfirm: {
      title: 'Delete Wallet',
      message: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel'
    },
    form: {
      name: 'Wallet Name',
      namePlaceholder: 'e.g., Cash Wallet, Bank Account',
      currency: 'Currency',
      selectCurrency: 'Select currency',
      initialBalance: 'Initial Balance',
      balance: 'Balance',
      balancePlaceholder: '0',
      initialBalanceHint: 'Optional: Leave blank for 0 balance',
      balanceHint: 'Update wallet balance',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      nameRequired: 'Wallet name is required',
      currencyRequired: 'Currency is required'
    }
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'Track your income and expenses',
    add: 'Add',
    filters: 'Filters',
    active: 'active',
    showing: 'Showing {count} of {total} transactions',
    income: 'Income',
    expense: 'Expense',
    empty: {
      title: 'No Transactions',
      description: 'Start tracking your finances by creating your first transaction',
      create: 'Create Transaction'
    },
    loadMore: 'Load More',
    loading: 'Loading...',
    endOfList: "You've reached the end of the list",
    deleteConfirm: {
      title: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction? This action cannot be undone and will affect your wallet balance.',
      confirm: 'Delete'
    }
  },
  categories: {
    title: 'Categories',
    subtitle: 'Organize your transactions with custom categories',
    add: 'Add',
    tabs: {
      all: 'All',
      income: 'Income',
      expense: 'Expense'
    },
    empty: {
      title: 'No Categories',
      description: 'Create your first custom category to organize your transactions',
      create: 'Create Category'
    },
    list: {
      incomeCategories: 'Income Categories',
      expenseCategories: 'Expense Categories',
      default: 'Default'
    },
    deleteConfirm: {
      title: 'Delete Category',
      message: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
      confirm: 'Delete'
    },
    form: {
      name: 'Category Name',
      namePlaceholder: 'e.g., Freelance, Groceries, Transportation',
      type: 'Type',
      selectType: 'Select type',
      typeIncome: 'Income',
      typeExpense: 'Expense',
      typeHint: 'Category type cannot be changed after creation',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      nameRequired: 'Category name is required',
      typeRequired: 'Please select a type'
    }
  },
  debts: {
    title: 'Debts',
    subtitle: 'Manage your payables and receivables',
    add: 'Add',
    summary: {
      youOwe: 'You Owe',
      owedToYou: 'Owed to You',
      netPosition: 'Net Position',
      overdue: 'Overdue'
    },
    filters: {
      show: 'Show',
      hide: 'Hide',
      type: 'Type',
      status: 'Status',
      overdue: 'Overdue Only',
      apply: 'Apply',
      reset: 'Reset'
    },
    types: {
      payable: 'Payable',
      receivable: 'Receivable',
      youOwe: 'You Owe',
      owedToYou: 'Owed to You',
      youOweMoney: 'You owe money',
      youAreOwedMoney: 'You are owed money'
    },
    status: {
      pending: 'Pending',
      partial: 'Partial',
      paid: 'Paid'
    },
    card: {
      totalAmount: 'Total Amount',
      remaining: 'Remaining',
      due: 'Due',
      payment: 'payment',
      payments: 'payments',
      edit: 'Edit',
      delete: 'Delete'
    },
    empty: {
      title: 'No Debts',
      description: 'Start tracking your payables and receivables',
      create: 'Create Debt'
    },
    deleteConfirm: {
      title: 'Delete Debt',
      message: 'Are you sure you want to delete debt for {name}? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel'
    },
    form: {
      debtType: 'Debt Type',
      counterpartyName: 'Counterparty Name',
      counterpartyPlaceholder: 'Enter person or company name',
      totalAmount: 'Total Amount',
      dueDate: 'Due Date',
      note: 'Note',
      noteOptional: '(Optional)',
      notePlaceholder: 'Add any additional details about this debt...',
      charactersCount: '{count}/500 characters',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      typeRequired: 'Please select a debt type',
      counterpartyRequired: 'Counterparty name is required',
      amountRequired: 'Amount must be greater than 0',
      dueDateRequired: 'Due date is required'
    },
    paymentHistory: {
      empty: {
        title: 'No payments yet',
        description: 'Add a payment to start tracking this debt'
      },
      edit: 'Edit',
      delete: 'Delete',
      timeAgo: {
        justNow: 'Just now',
        minuteAgo: '{count} minute ago',
        minutesAgo: '{count} minutes ago',
        hourAgo: '{count} hour ago',
        hoursAgo: '{count} hours ago',
        dayAgo: '{count} day ago',
        daysAgo: '{count} days ago'
      }
    }
  },
  reports: {
    title: 'Financial Reports',
    subtitle: 'View your financial summary and export data',
    summary: {
      totalIncome: 'Total Income',
      totalExpense: 'Total Expense',
      netBalance: 'Net Balance',
      transactions: 'Transactions'
    },
    categoryBreakdown: {
      title: 'Category Breakdown',
      showLess: 'Show Less',
      showAll: 'Show All {count} Categories'
    },
    trend: {
      title: 'Income vs Expense Trend',
      date: 'Date',
      income: 'Income',
      expense: 'Expense',
      balance: 'Balance',
      showing: 'Showing {current} of {total} entries'
    },
    granularity: {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    },
    empty: {
      title: 'No Data Available',
      description: 'Select a date range to view your financial reports'
    }
  },
  profile: {
    title: 'Profile',
    subtitle: 'Manage your account information and preferences',
    accountInfo: {
      title: 'Account Information',
      userId: 'User ID',
      name: 'Name',
      email: 'Email',
      language: 'Language/Region',
      memberSince: 'Member Since',
      editProfile: 'Edit Profile'
    },
    subscription: {
      title: 'Subscription Details',
      plan: 'Plan',
      premiumActive: 'Premium Active',
      premiumMessage: 'Enjoy unlimited access to all premium features',
      trialMessage: 'Your trial will end in {days} days',
      trialEndsOn: 'Your trial will end on {date}',
      started: 'Started',
      trialEnds: 'Trial Ends',
      expires: 'Expires',
      upgradeToPremium: 'Upgrade to Premium'
    },
    form: {
      name: 'Name',
      namePlaceholder: 'Enter your name',
      email: 'Email',
      locale: 'Language/Region',
      selectLocale: 'Select language',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      nameRequired: 'Name is required',
      emailRequired: 'Email is required'
    },
    loading: 'Loading...',
    retry: 'Retry'
  },
  premium: {
    title: 'Premium',
    status: {
      premiumActive: 'Premium Active',
      trialActive: 'Trial Period Active',
      validUntil: 'Valid until: {date}',
      daysRemaining: '{count} days remaining',
      enjoyPremium: 'Enjoy all premium features for free!',
      processing: 'Processing...',
      loading: 'Loading...',
      subscribeNow: 'Subscribe Now - IDR 25,000/month'
    },
    trialBanner: {
      title: 'Premium Trial Active',
      daysRemaining: '{count} day | {count} days',
      day: 'day',
      days: 'days',
      remaining: 'remaining',
      until: 'until {date}',
      enjoying: 'Enjoying unlimited wallets, reports & Excel/PDF export!',
      subscribeButton: 'Subscribe Now - IDR 25,000/month',
      progressUsed: '{percent}% of trial used'
    },
    hero: {
      title: 'Upgrade to Premium',
      subtitle: 'Unlock unlimited features and take control of your finances like never before',
      price: 'IDR 25,000',
      perMonth: 'per month',
      subscribeToPremium: 'Subscribe to Premium',
      onlyPerMonth: 'Only IDR 25,000/month · Cancel anytime'
    },
    trial: {
      title: 'Did you know?',
      description: 'New users automatically get a 14-day FREE trial of all Premium features when they register! Experience unlimited wallets, advanced reports, and Excel/PDF export before deciding to subscribe.'
    },
    comparison: {
      title: 'Feature Comparison',
      feature: 'Feature',
      free: 'Free',
      premium: 'Premium',
      wallets: 'Wallets',
      categories: 'Categories',
      exportFormat: 'Export Format',
      dateRange: 'Date Range',
      advancedReports: 'Advanced Reports',
      cloudBackup: 'Cloud Backup',
      prioritySupport: 'Priority Support',
      unlimited: 'Unlimited',
      csvLimited: 'CSV (100 records)',
      csvExcelPdf: 'CSV, Excel, PDF (10,000 records)',
      days90: '90 days',
      days365: '365 days',
      upgradeToPremium: 'Upgrade to Premium'
    },
    features: {
      unlimitedWallets: {
        title: 'Unlimited Wallets',
        description: 'Create as many wallets as you need to organize your personal, business, and savings finances separately.'
      },
      advancedAnalytics: {
        title: 'Advanced Analytics',
        description: 'Get detailed insights with custom reports, spending patterns, and financial forecasting tools.'
      },
      unlimitedCategories: {
        title: 'Unlimited Categories',
        description: 'Create custom categories and subcategories to track every aspect of your spending habits.'
      },
      prioritySupport: {
        title: 'Priority Support',
        description: 'Get help when you need it with dedicated priority support and faster response times.'
      },
      dataExport: {
        title: 'Data Export',
        description: 'Export your financial data in multiple formats (CSV, PDF, Excel) for your records and analysis.'
      },
      cloudBackup: {
        title: 'Cloud Backup',
        description: 'Automatic cloud backup to keep your financial data safe and accessible from anywhere.'
      }
    },
    cta: {
      title: 'Ready to upgrade?',
      descriptionTrial: 'Subscribe now to continue enjoying premium features after your trial ends',
      descriptionFree: 'Join thousands of users who are taking control of their finances with Premium',
      getStarted: 'Get Started with Premium'
    },
    upgradeModal: {
      defaultTitle: 'Premium Feature',
      defaultMessage: 'This feature is available for Premium users only.',
      defaultFeatures: [
        'Unlimited wallets & debts',
        'Financial reports & analytics',
        'Trend charts & insights',
        'Category breakdown analysis',
        'Excel & PDF export',
        'Priority support'
      ],
      upgradeButton: 'Upgrade to Premium',
      maybeLater: 'Maybe Later',
      pricing: 'Only <span class="font-bold">IDR 25,000/month</span> · Cancel anytime'
    }
  }
}
