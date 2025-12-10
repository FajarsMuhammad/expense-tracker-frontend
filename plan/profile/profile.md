 ✅ Profile Management System - Implementasi Lengkap

  Saya sudah melengkapi sistem profile dengan fitur-fitur berikut:

  📋 Endpoints yang Tersedia:

  1. GET /api/v1/users/me - Get Complete Profile

  Mendapatkan profile lengkap user termasuk informasi subscription.

  Response meliputi:
  {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "locale": "id_ID",
    "createdAt": "2024-12-10T...",
    "updatedAt": "2024-12-10T...",
    "subscription": {
      "subscriptionId": "uuid",
      "tier": "PREMIUM",
      "status": "TRIAL",
      "isPremium": true,
      "isTrial": true,
      "startedAt": "2024-12-10T...",
      "endedAt": "2024-12-24T...",
      "trialDaysRemaining": 14
    }
  }

  Features:
  - ✅ Informasi user lengkap (id, email, name, locale)
  - ✅ Metadata akun (createdAt, updatedAt)
  - ✅ Informasi subscription real-time (tier, status, isPremium, isTrial)
  - ✅ Trial countdown - menampilkan sisa hari trial (trialDaysRemaining)
  - ✅ Tanggal mulai dan berakhir subscription

  2. PUT /api/v1/users/me - Update Profile

  Update profile user (name dan locale).

  Request:
  {
    "name": "New Name",
    "locale": "en_US"  // optional, format: language_COUNTRY
  }

  Validasi:
  - Name: required, 2-100 karakter
  - Locale: optional, format language_COUNTRY (contoh: id_ID, en_US)
  - Email: tidak bisa diubah (security)

  Features:
  - ✅ Update name dan locale
  - ✅ Validasi input dengan Jakarta Bean Validation
  - ✅ Auto-update updatedAt timestamp
  - ✅ Business event logging (PROFILE_UPDATED)
  - ✅ Metrics tracking (user.profile.updated)
  - ✅ Return updated profile dengan subscription info

  🏗️ Arsitektur yang Digunakan:

  DTOs:
  1. ProfileResponse - Response lengkap dengan nested SubscriptionInfo
  2. UpdateProfileRequest - Request untuk update profile dengan validasi

  Use Cases:
  1. GetUserProfile / GetUserProfileUseCase - Get complete profile
  2. UpdateUserProfile / UpdateUserProfileUseCase - Update profile

  Features:
  - Clean Architecture pattern (use case layer)
  - Comprehensive logging (debug & info level)
  - Business event tracking untuk audit trail
  - Metrics untuk monitoring
  - Swagger/OpenAPI documentation
  - Security via JWT authentication

  🎯 Use Cases untuk Frontend:

  Profile Page:
  // Get profile
  GET /api/v1/users/me
  Authorization: Bearer <token>

  // Display trial countdown
  if (profile.subscription.isTrial) {
    const daysLeft = profile.subscription.trialDaysRemaining;
    showTrialBanner(`${daysLeft} days left in your trial`);
  }

  // Update profile
  PUT /api/v1/users/me
  Authorization: Bearer <token>
  Content-Type: application/json

  {
    "name": "Updated Name",
    "locale": "id_ID"
  }

  Trial Status Badge:
  - Tampilkan badge "TRIAL" jika isTrial === true
  - Tampilkan countdown: trialDaysRemaining hari tersisa
  - Tampilkan "PREMIUM" jika isPremium === true && isTrial === false
  - Tampilkan "FREE" jika isPremium === false
