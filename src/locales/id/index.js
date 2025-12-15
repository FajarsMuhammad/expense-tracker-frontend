/**
 * Indonesian (ID) Locale Messages
 */

export default {
  common: {
    app: {
      name: 'MoneyTrack',
      tagline: 'Lacak Pengeluaran Anda'
    },
    toast: {
      // Generic messages
      success: 'Berhasil',
      error: 'Terjadi kesalahan',
      warning: 'Peringatan',
      info: 'Informasi',
      // Wallets
      walletLoadFailed: 'Gagal memuat dompet',
      walletCreated: 'Dompet berhasil dibuat!',
      walletUpdated: 'Dompet berhasil diperbarui!',
      walletDeleted: 'Dompet berhasil dihapus!',
      walletLimitReached: 'Pengguna gratis hanya dapat membuat 1 dompet. Upgrade ke Premium untuk dompet tanpa batas.',
      // Transactions
      transactionLoadFailed: 'Gagal memuat transaksi',
      transactionLoadMoreFailed: 'Gagal memuat lebih banyak transaksi',
      transactionCreated: 'Transaksi berhasil dibuat!',
      transactionUpdated: 'Transaksi berhasil diperbarui!',
      transactionDeleted: 'Transaksi berhasil dihapus!',
      selectWallet: 'Silakan pilih dompet',
      selectCategory: 'Silakan pilih kategori',
      selectTransactionType: 'Silakan pilih jenis transaksi',
      amountMustBePositive: 'Jumlah harus lebih besar dari 0',
      selectDate: 'Silakan pilih tanggal',
      dateCannotBeFuture: 'Tanggal transaksi tidak boleh di masa depan',
      filtersFailed: 'Gagal menerapkan filter',
      filtersResetFailed: 'Gagal mereset filter',
      // Categories
      categoryLoadFailed: 'Gagal memuat kategori',
      categoryCreated: 'Kategori berhasil dibuat!',
      categoryUpdated: 'Kategori berhasil diperbarui!',
      categoryDeleted: 'Kategori berhasil dihapus!',
      categoryDuplicateExists: 'Kategori {type} dengan nama ini sudah ada',
      categoryCannotDeleteDefault: 'Tidak dapat menghapus kategori default',
      // Debts
      debtLoadFailed: 'Gagal memuat utang',
      debtLoadMoreFailed: 'Gagal memuat lebih banyak utang',
      debtCreated: 'Utang berhasil dibuat!',
      debtUpdated: 'Utang berhasil diperbarui!',
      debtDeleted: 'Utang berhasil dihapus!',
      selectDebtType: 'Silakan pilih jenis utang',
      enterCounterpartyName: 'Silakan masukkan nama pihak terkait',
      selectDueDate: 'Silakan pilih tanggal jatuh tempo',
      dueDateCannotBePast: 'Tanggal jatuh tempo tidak boleh di masa lalu',
      paymentAmountMustBePositive: 'Jumlah pembayaran harus lebih besar dari 0',
      paymentExceedsRemaining: 'Jumlah pembayaran tidak boleh melebihi sisa ({amount})',
      selectPaymentDate: 'Silakan pilih tanggal pembayaran',
      paymentDateCannotBeFuture: 'Tanggal pembayaran tidak boleh di masa depan',
      paymentAdded: 'Pembayaran berhasil ditambahkan!',
      paymentUpdated: 'Pembayaran berhasil diperbarui!',
      paymentDeleted: 'Pembayaran berhasil dihapus!',
      debtAlreadyPaid: 'Utang sudah ditandai sebagai lunas',
      debtMarkedAsPaid: 'Utang ditandai sebagai lunas!',
      // Auth
      loginSuccessful: 'Login berhasil!',
      logoutSuccessful: 'Logout berhasil',
      registrationSuccessful: 'Pendaftaran berhasil!',
      trialStarted: 'Selamat datang! Uji coba PREMIUM 14 hari Anda telah dimulai 🎉',
      // Profile
      profileLoadFailed: 'Gagal memuat profil',
      profileUpdated: 'Profil berhasil diperbarui!',
      profileUpdateFailed: 'Gagal memperbarui profil',
      // Export
      invalidExportFormat: 'Format ekspor tidak valid',
      exportInProgress: 'Ekspor sedang berlangsung',
      startDateBeforeEndDate: 'Tanggal mulai harus sebelum tanggal akhir',
      transactionsExported: 'Transaksi berhasil diekspor sebagai {format}',
      debtsExported: 'Utang berhasil diekspor sebagai {format}',
      summaryExported: 'Ringkasan berhasil diekspor sebagai {format}',
      exportFailed: 'Gagal mengekspor',
      csvNotSupportedForSummary: 'Format CSV tidak didukung untuk ekspor ringkasan. Silakan gunakan Excel atau PDF.',
      exportQuotaCheckFailed: 'Gagal memeriksa kuota ekspor'
    },
    buttons: {
      save: 'Simpan',
      cancel: 'Batal',
      delete: 'Hapus',
      create: 'Buat',
      edit: 'Edit',
      close: 'Tutup',
      confirm: 'Konfirmasi',
      add: 'Tambah',
      remove: 'Hapus',
      search: 'Cari',
      filter: 'Filter',
      export: 'Ekspor',
      back: 'Kembali',
      next: 'Selanjutnya',
      previous: 'Sebelumnya',
      submit: 'Kirim',
      reset: 'Reset',
      clear: 'Bersihkan',
      view: 'Lihat',
      download: 'Unduh'
    },
    actions: {
      loading: 'Memuat...',
      saving: 'Menyimpan...',
      deleting: 'Menghapus...',
      processing: 'Memproses...',
      uploading: 'Mengunggah...',
      downloading: 'Mengunduh...'
    },
    states: {
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      pending: 'Menunggu',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
      failed: 'Gagal'
    },
    locale: {
      title: 'Bahasa',
      switchLanguage: 'Ganti Bahasa',
      selectLanguage: 'Pilih Bahasa'
    },
    pagination: {
      showing: 'Menampilkan {from} sampai {to} dari {total} data',
      noResults: 'Tidak ada hasil',
      page: 'Halaman',
      of: 'dari'
    },
    empty: {
      noData: 'Tidak ada data',
      noResults: 'Tidak ada hasil ditemukan',
      tryAgain: 'Coba lagi'
    },
    theme: {
      toggle: 'Ganti Tema',
      light: 'Terang',
      dark: 'Gelap'
    },
    modal: {
      close: 'Tutup'
    },
    time: {
      justNow: 'Baru saja',
      minutesAgo: '{count} menit yang lalu',
      hoursAgo: '{count} jam yang lalu',
      daysAgo: '{count} hari yang lalu',
      weeksAgo: '{count} minggu yang lalu',
      monthsAgo: '{count} bulan yang lalu',
      yearsAgo: '{count} tahun yang lalu'
    }
  },
  navigation: {
    sidebar: {
      dashboard: 'Dasbor',
      wallets: 'Dompet',
      transactions: 'Transaksi',
      categories: 'Kategori',
      debts: 'Utang Piutang',
      reports: 'Laporan',
      profile: 'Profil',
      premium: 'Premium'
    },
    menu: {
      profile: 'Profil',
      settings: 'Pengaturan',
      logout: 'Keluar'
    }
  },
  auth: {
    login: {
      title: 'Selamat Datang Kembali',
      subtitle: 'Masuk ke akun Anda',
      appName: 'Expense Tracker',
      appTagline: 'Kelola pengeluaran Anda dengan aman',
      email: 'Email',
      emailPlaceholder: "anda{'@'}example.com",
      password: 'Kata Sandi',
      passwordPlaceholder: 'Masukkan kata sandi Anda',
      rememberMe: 'Ingat saya',
      forgotPassword: 'Lupa kata sandi?',
      signIn: 'Masuk',
      noAccount: 'Belum punya akun?',
      createAccount: 'Buat akun',
      orContinueWith: 'Atau lanjutkan dengan',
      loginWithGoogle: 'Masuk dengan Google',
      loginWithApple: 'Masuk dengan Apple',
      loginWithFacebook: 'Masuk dengan Facebook',
      emailRequired: 'Email wajib diisi',
      passwordRequired: 'Kata sandi wajib diisi'
    },
    register: {
      title: 'Buat Akun',
      trialBadge: 'Dapatkan Uji Coba Premium 14 Hari GRATIS',
      name: 'Nama Lengkap',
      namePlaceholder: 'John Doe',
      email: 'Email',
      emailPlaceholder: "email{'@'}anda.com",
      password: 'Kata Sandi',
      passwordPlaceholder: 'Minimal 6 karakter',
      passwordHint: 'Kata sandi harus minimal 6 karakter',
      registerButton: 'Daftar',
      trialBenefitsTitle: 'Yang akan Anda dapatkan selama 14 hari:',
      benefit1: 'Dompet & pelacakan utang tanpa batas',
      benefit2: 'Laporan & analitik keuangan',
      benefit3: 'Ekspor Excel & PDF',
      benefit4: 'Tidak memerlukan kartu kredit',
      hasAccount: 'Sudah punya akun?',
      loginHere: 'Masuk di sini',
      nameRequired: 'Nama wajib diisi',
      emailRequired: 'Email wajib diisi',
      passwordRequired: 'Kata sandi wajib diisi',
      passwordMinLength: 'Kata sandi harus minimal 6 karakter'
    }
  },
  dashboard: {
    title: 'Dasbor',
    walletBalance: 'Saldo Dompet',
    todayIncome: 'Pemasukan Hari Ini',
    todayExpense: 'Pengeluaran Hari Ini',
    netToday: 'Bersih Hari Ini',
    recentTransactions: 'Transaksi Terbaru',
    viewAll: 'Lihat Semua',
    noTransactions: 'Belum ada transaksi',
    uncategorized: 'Tanpa Kategori',
    walletFilter: {
      label: 'Filter berdasarkan Dompet',
      allWallets: 'Semua Dompet',
      searchPlaceholder: 'Cari dompet...',
      noWalletsFound: 'Tidak ada dompet ditemukan'
    }
  },
  wallets: {
    title: 'Dompet',
    subtitle: 'Kelola akun keuangan dan saldo Anda',
    add: 'Tambah',
    wallet: 'Dompet',
    currentBalance: 'Saldo Saat Ini',
    edit: 'Ubah',
    delete: 'Hapus',
    create: {
      title: 'Buat Dompet',
      description: 'Tambahkan dompet baru untuk melacak keuangan Anda'
    },
    editForm: {
      title: 'Edit Dompet',
      description: 'Perbarui informasi dompet'
    },
    empty: {
      title: 'Belum Ada Dompet',
      description: 'Buat dompet pertama Anda untuk mulai melacak pengeluaran',
      createFirst: 'Buat Dompet Pertama Anda'
    },
    deleteConfirm: {
      title: 'Hapus Dompet',
      message: 'Apakah Anda yakin ingin menghapus "{name}"? Tindakan ini tidak dapat dibatalkan.',
      confirm: 'Hapus',
      cancel: 'Batal'
    },
    form: {
      name: 'Nama Dompet',
      namePlaceholder: 'Contoh: Dompet Tunai, Rekening Bank',
      currency: 'Mata Uang',
      selectCurrency: 'Pilih mata uang',
      initialBalance: 'Saldo Awal',
      balance: 'Saldo',
      balancePlaceholder: '0',
      initialBalanceHint: 'Opsional: Kosongkan untuk saldo 0',
      balanceHint: 'Perbarui saldo dompet',
      save: 'Simpan',
      saving: 'Menyimpan...',
      cancel: 'Batal',
      nameRequired: 'Nama dompet wajib diisi',
      currencyRequired: 'Mata uang wajib dipilih'
    }
  },
  transactions: {
    title: 'Transaksi',
    subtitle: 'Lacak pemasukan dan pengeluaran Anda',
    add: 'Tambah',
    filters: 'Filter',
    active: 'aktif',
    showing: 'Menampilkan {count} dari {total} transaksi',
    income: 'Pemasukan',
    expense: 'Pengeluaran',
    netBalance: 'Saldo Bersih',
    create: {
      title: 'Buat Transaksi',
      description: 'Tambahkan transaksi pemasukan atau pengeluaran baru'
    },
    edit: {
      title: 'Edit Transaksi',
      description: 'Perbarui informasi transaksi'
    },
    empty: {
      title: 'Tidak Ada Transaksi',
      description: 'Mulai lacak keuangan Anda dengan membuat transaksi pertama',
      create: 'Buat Transaksi'
    },
    loadMore: 'Muat Lebih Banyak',
    loading: 'Memuat...',
    endOfList: 'Anda telah mencapai akhir daftar',
    deleteConfirm: {
      title: 'Hapus Transaksi',
      message: 'Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi saldo dompet Anda.',
      confirm: 'Hapus'
    },
    form: {
      type: 'Tipe',
      typeCannotChange: 'Tipe transaksi tidak dapat diubah setelah dibuat',
      wallet: 'Dompet',
      walletPlaceholder: 'Cari dompet...',
      selectWallet: 'Pilih dompet',
      noWalletsFound: 'Tidak ada dompet ditemukan',
      category: 'Kategori',
      categoryPlaceholder: 'Cari kategori...',
      selectCategory: 'Pilih kategori',
      selectTypeFirst: 'Pilih tipe terlebih dahulu',
      noCategories: 'Tidak ada kategori',
      amount: 'Jumlah',
      date: 'Tanggal',
      note: 'Catatan',
      noteOptional: '(Opsional)',
      notePlaceholder: 'Tambahkan catatan tentang transaksi ini...',
      charactersCount: '{count}/500',
      save: 'Simpan',
      saving: 'Menyimpan...',
      cancel: 'Batal'
    }
  },
  categories: {
    title: 'Kategori',
    subtitle: 'Atur transaksi Anda dengan kategori kustom',
    add: 'Tambah',
    create: {
      title: 'Buat Kategori',
      description: 'Tambahkan kategori baru untuk mengatur transaksi Anda'
    },
    edit: {
      title: 'Edit Kategori',
      description: 'Perbarui informasi kategori'
    },
    tabs: {
      all: 'Semua',
      income: 'Pemasukan',
      expense: 'Pengeluaran'
    },
    empty: {
      title: 'Tidak Ada Kategori',
      description: 'Buat kategori kustom pertama Anda untuk mengatur transaksi',
      create: 'Buat Kategori'
    },
    list: {
      incomeCategories: 'Kategori Pemasukan',
      expenseCategories: 'Kategori Pengeluaran',
      default: 'Bawaan'
    },
    deleteConfirm: {
      title: 'Hapus Kategori',
      message: 'Apakah Anda yakin ingin menghapus "{name}"? Tindakan ini tidak dapat dibatalkan.',
      confirm: 'Hapus'
    },
    form: {
      name: 'Nama Kategori',
      namePlaceholder: 'Contoh: Freelance, Belanja, Transportasi',
      type: 'Tipe',
      selectType: 'Pilih tipe',
      typeIncome: 'Pemasukan',
      typeExpense: 'Pengeluaran',
      typeHint: 'Tipe kategori tidak dapat diubah setelah dibuat',
      save: 'Simpan',
      saving: 'Menyimpan...',
      cancel: 'Batal',
      nameRequired: 'Nama kategori wajib diisi',
      typeRequired: 'Silakan pilih tipe'
    }
  },
  debts: {
    title: 'Utang Piutang',
    subtitle: 'Kelola utang dan piutang Anda',
    add: 'Tambah',
    create: {
      title: 'Buat Utang Piutang',
      description: 'Tambahkan utang atau piutang baru'
    },
    edit: {
      title: 'Edit Utang Piutang',
      description: 'Perbarui informasi utang piutang'
    },
    summary: {
      youOwe: 'Anda Berutang',
      owedToYou: 'Piutang Anda',
      netPosition: 'Posisi Bersih',
      overdue: 'Jatuh Tempo'
    },
    filters: {
      show: 'Tampilkan',
      hide: 'Sembunyikan',
      type: 'Tipe',
      status: 'Status',
      overdue: 'Hanya Jatuh Tempo',
      apply: 'Terapkan',
      reset: 'Reset'
    },
    types: {
      payable: 'Utang',
      receivable: 'Piutang',
      youOwe: 'Anda Berutang',
      owedToYou: 'Piutang Anda',
      youOweMoney: 'Anda berutang uang',
      youAreOwedMoney: 'Anda memiliki piutang'
    },
    status: {
      pending: 'Tertunda',
      partial: 'Sebagian',
      paid: 'Lunas'
    },
    card: {
      totalAmount: 'Jumlah Total',
      remaining: 'Sisa',
      due: 'Jatuh Tempo',
      payment: 'pembayaran',
      payments: 'pembayaran',
      edit: 'Edit',
      delete: 'Hapus'
    },
    empty: {
      title: 'Tidak Ada Utang Piutang',
      description: 'Mulai lacak utang dan piutang Anda',
      create: 'Buat Utang Piutang'
    },
    deleteConfirm: {
      title: 'Hapus Utang Piutang',
      message: 'Apakah Anda yakin ingin menghapus utang piutang untuk {name}? Tindakan ini tidak dapat dibatalkan.',
      confirm: 'Hapus',
      cancel: 'Batal'
    },
    form: {
      debtType: 'Tipe Utang Piutang',
      counterpartyName: 'Nama Pihak',
      counterpartyPlaceholder: 'Masukkan nama orang atau perusahaan',
      totalAmount: 'Jumlah Total',
      dueDate: 'Tanggal Jatuh Tempo',
      note: 'Catatan',
      noteOptional: '(Opsional)',
      notePlaceholder: 'Tambahkan detail tambahan tentang utang piutang ini...',
      charactersCount: '{count}/500 karakter',
      save: 'Simpan',
      saving: 'Menyimpan...',
      cancel: 'Batal',
      typeRequired: 'Silakan pilih tipe utang piutang',
      counterpartyRequired: 'Nama pihak wajib diisi',
      amountRequired: 'Jumlah harus lebih dari 0',
      dueDateRequired: 'Tanggal jatuh tempo wajib diisi'
    },
    paymentHistory: {
      empty: {
        title: 'Belum Ada Pembayaran',
        description: 'Tambahkan pembayaran untuk mulai melacak utang piutang ini'
      },
      edit: 'Edit',
      delete: 'Hapus',
      timeAgo: {
        justNow: 'Baru saja',
        minuteAgo: '{count} menit yang lalu',
        minutesAgo: '{count} menit yang lalu',
        hourAgo: '{count} jam yang lalu',
        hoursAgo: '{count} jam yang lalu',
        dayAgo: '{count} hari yang lalu',
        daysAgo: '{count} hari yang lalu'
      }
    },
    paymentForm: {
      remainingAmount: 'Sisa Jumlah',
      paymentAmount: 'Jumlah Pembayaran',
      paymentDateTime: 'Tanggal & Waktu Pembayaran',
      note: 'Catatan',
      noteOptional: '(Opsional)',
      notePlaceholder: 'Tambahkan catatan tentang pembayaran ini...',
      charactersCount: '{count}/200 karakter',
      save: 'Simpan',
      saving: 'Menyimpan...',
      updatePayment: 'Perbarui Pembayaran',
      addPayment: 'Tambah Pembayaran',
      cancel: 'Batal',
      maximumHint: 'Maksimal: {amount}'
    },
    filtersForm: {
      title: 'Filter',
      activeCount: '{count} aktif',
      debtType: 'Tipe Utang Piutang',
      all: 'Semua',
      status: 'Status',
      allStatuses: 'Semua Status',
      statusOpen: 'Terbuka',
      statusPartial: 'Sebagian',
      statusPaid: 'Lunas',
      showOnlyOverdue: 'Tampilkan Hanya Jatuh Tempo',
      applyFilters: 'Terapkan Filter',
      reset: 'Reset'
    },
    detail: {
      // Buttons and actions
      edit: 'Edit',
      delete: 'Hapus',
      add: 'Tambah',
      markAsFullyPaid: 'Tandai Sebagai Lunas',
      // Section headings
      debtSummary: 'Ringkasan Utang Piutang',
      information: 'Informasi',
      paymentHistory: 'Riwayat Pembayaran',
      // Labels and fields
      totalAmount: 'Jumlah Total',
      paidAmount: 'Jumlah Dibayar',
      remainingAmount: 'Sisa Jumlah',
      dueDate: 'Tanggal Jatuh Tempo',
      paymentsMade: 'Pembayaran Dilakukan',
      created: 'Dibuat',
      lastUpdated: 'Terakhir Diperbarui',
      note: 'Catatan',
      // Type labels
      youOwe: 'Anda Berutang',
      owedToYou: 'Piutang Anda',
      // Status
      paid: 'Lunas',
      // Due date messages
      daysOverdue: '{count} hari terlambat',
      dueToday: 'Jatuh tempo hari ini',
      daysRemaining: '{count} hari tersisa',
      // Modal titles
      addPayment: 'Tambah Pembayaran',
      editPayment: 'Edit Pembayaran',
      deleteDebt: 'Hapus Utang Piutang',
      markAsPaid: 'Tandai Sebagai Lunas',
      deletePayment: 'Hapus Pembayaran',
      // Confirmation messages
      deleteDebtConfirm: 'Apakah Anda yakin ingin menghapus utang piutang ini? Tindakan ini tidak dapat dibatalkan.',
      markAsPaidConfirm: 'Apakah Anda yakin ingin menandai utang piutang ini sebagai lunas? Ini akan mengatur sisa jumlah menjadi nol.',
      deletePaymentConfirm: 'Apakah Anda yakin ingin menghapus pembayaran ini? Tindakan ini tidak dapat dibatalkan.',
      // Error state
      debtNotFound: 'Utang piutang tidak ditemukan'
    }
  },
  reports: {
    title: 'Laporan Keuangan',
    subtitle: 'Lihat ringkasan keuangan dan ekspor data Anda',
    summary: {
      totalIncome: 'Total Pemasukan',
      totalExpense: 'Total Pengeluaran',
      netBalance: 'Saldo Bersih',
      transactions: 'Transaksi'
    },
    categoryBreakdown: {
      title: 'Rincian Kategori',
      showLess: 'Tampilkan Lebih Sedikit',
      showAll: 'Tampilkan Semua {count} Kategori'
    },
    trend: {
      title: 'Tren Pemasukan vs Pengeluaran',
      date: 'Tanggal',
      income: 'Pemasukan',
      expense: 'Pengeluaran',
      balance: 'Saldo',
      showing: 'Menampilkan {current} dari {total} entri'
    },
    granularity: {
      daily: 'Harian',
      weekly: 'Mingguan',
      monthly: 'Bulanan'
    },
    empty: {
      title: 'Tidak Ada Data Tersedia',
      description: 'Pilih rentang tanggal untuk melihat laporan keuangan Anda'
    }
  },
  profile: {
    title: 'Profil',
    subtitle: 'Kelola informasi akun dan preferensi Anda',
    accountInfo: {
      title: 'Informasi Akun',
      userId: 'ID Pengguna',
      name: 'Nama',
      email: 'Email',
      language: 'Bahasa/Wilayah',
      memberSince: 'Anggota Sejak',
      editProfile: 'Edit Profil'
    },
    subscription: {
      title: 'Detail Langganan',
      plan: 'Paket',
      premiumActive: 'Premium Aktif',
      premiumMessage: 'Nikmati akses tanpa batas ke semua fitur premium',
      trialMessage: 'Uji coba Anda akan berakhir dalam {days} hari',
      trialEndsOn: 'Uji coba Anda akan berakhir pada {date}',
      started: 'Dimulai',
      trialEnds: 'Uji Coba Berakhir',
      expires: 'Kedaluwarsa',
      upgradeToPremium: 'Upgrade ke Premium'
    },
    form: {
      name: 'Nama',
      namePlaceholder: 'Masukkan nama Anda',
      email: 'Email',
      locale: 'Bahasa/Wilayah',
      selectLocale: 'Pilih bahasa',
      save: 'Simpan',
      saving: 'Menyimpan...',
      cancel: 'Batal',
      nameRequired: 'Nama wajib diisi',
      emailRequired: 'Email wajib diisi'
    },
    loading: 'Memuat...',
    retry: 'Coba Lagi'
  },
  premium: {
    title: 'Premium',
    status: {
      premiumActive: 'Premium Aktif',
      trialActive: 'Periode Uji Coba Aktif',
      validUntil: 'Berlaku hingga: {date}',
      daysRemaining: '{count} hari tersisa',
      enjoyPremium: 'Nikmati semua fitur premium secara gratis!',
      processing: 'Memproses...',
      loading: 'Memuat...',
      subscribeNow: 'Berlangganan Sekarang - IDR 25.000/bulan'
    },
    trialBanner: {
      title: 'Uji Coba Premium Aktif',
      daysRemaining: '{count} hari',
      day: 'hari',
      days: 'hari',
      remaining: 'tersisa',
      until: 'hingga {date}',
      enjoying: 'Nikmati dompet tanpa batas, laporan & ekspor Excel/PDF!',
      subscribeButton: 'Berlangganan Sekarang - IDR 25.000/bulan',
      progressUsed: '{percent}% uji coba telah digunakan'
    },
    hero: {
      title: 'Upgrade ke Premium',
      subtitle: 'Buka fitur tanpa batas dan kendalikan keuangan Anda seperti tidak pernah sebelumnya',
      price: 'IDR 25.000',
      perMonth: 'per bulan',
      subscribeToPremium: 'Berlangganan Premium',
      onlyPerMonth: 'Hanya IDR 25.000/bulan · Batalkan kapan saja'
    },
    trial: {
      title: 'Tahukah Anda?',
      description: 'Pengguna baru secara otomatis mendapatkan uji coba GRATIS 14 hari untuk semua fitur Premium saat mendaftar! Rasakan dompet tanpa batas, laporan lanjutan, dan ekspor Excel/PDF sebelum memutuskan untuk berlangganan.'
    },
    comparison: {
      title: 'Perbandingan Fitur',
      feature: 'Fitur',
      free: 'Gratis',
      premium: 'Premium',
      wallets: 'Dompet',
      categories: 'Kategori',
      exportFormat: 'Format Ekspor',
      dateRange: 'Rentang Tanggal',
      advancedReports: 'Laporan Lanjutan',
      cloudBackup: 'Backup Cloud',
      prioritySupport: 'Dukungan Prioritas',
      unlimited: 'Tanpa Batas',
      csvLimited: 'CSV (100 records)',
      csvExcelPdf: 'CSV, Excel, PDF (10.000 records)',
      days90: '90 hari',
      days365: '365 hari',
      upgradeToPremium: 'Upgrade ke Premium'
    },
    features: {
      unlimitedWallets: {
        title: 'Dompet Tanpa Batas',
        description: 'Buat sebanyak mungkin dompet yang Anda butuhkan untuk mengatur keuangan pribadi, bisnis, dan tabungan secara terpisah.'
      },
      advancedAnalytics: {
        title: 'Analitik Lanjutan',
        description: 'Dapatkan wawasan detail dengan laporan kustom, pola pengeluaran, dan alat prakiraan keuangan.'
      },
      unlimitedCategories: {
        title: 'Kategori Tanpa Batas',
        description: 'Buat kategori dan subkategori kustom untuk melacak setiap aspek kebiasaan pengeluaran Anda.'
      },
      prioritySupport: {
        title: 'Dukungan Prioritas',
        description: 'Dapatkan bantuan saat Anda membutuhkannya dengan dukungan prioritas khusus dan waktu respons yang lebih cepat.'
      },
      dataExport: {
        title: 'Ekspor Data',
        description: 'Ekspor data keuangan Anda dalam berbagai format (CSV, PDF, Excel) untuk catatan dan analisis Anda.'
      },
      cloudBackup: {
        title: 'Backup Cloud',
        description: 'Backup cloud otomatis untuk menjaga data keuangan Anda tetap aman dan dapat diakses dari mana saja.'
      }
    },
    cta: {
      title: 'Siap untuk upgrade?',
      descriptionTrial: 'Berlangganan sekarang untuk terus menikmati fitur premium setelah masa uji coba Anda berakhir',
      descriptionFree: 'Bergabunglah dengan ribuan pengguna yang mengambil kendali keuangan mereka dengan Premium',
      getStarted: 'Mulai dengan Premium'
    },
    upgradeModal: {
      defaultTitle: 'Fitur Premium',
      defaultMessage: 'Fitur ini hanya tersedia untuk pengguna Premium.',
      defaultFeatures: [
        'Dompet & utang tanpa batas',
        'Laporan keuangan & analitik',
        'Grafik tren & wawasan',
        'Analisis breakdown kategori',
        'Ekspor Excel & PDF',
        'Dukungan prioritas'
      ],
      upgradeButton: 'Upgrade ke Premium',
      maybeLater: 'Nanti Saja',
      pricing: 'Hanya <span class="font-bold">IDR 25.000/bulan</span> · Batalkan kapan saja'
    }
  }
}
