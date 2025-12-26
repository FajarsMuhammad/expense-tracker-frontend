# Deployment Guide

Panduan deployment aplikasi Expense Tracker Frontend untuk berbagai environment.

## Table of Contents
- [Environment Variables](#environment-variables)
- [Development Setup](#development-setup)
- [Production Build](#production-build)
- [Deployment Platforms](#deployment-platforms)
- [Security Best Practices](#security-best-practices)

---

## Environment Variables

Aplikasi ini menggunakan Vite untuk environment management. Semua environment variables harus diawali dengan `VITE_` agar bisa diakses di client-side.

### Required Variables

```bash
VITE_API_BASE_URL          # Base URL backend API
VITE_APP_NAME              # Nama aplikasi
VITE_MIDTRANS_CLIENT_KEY   # Midtrans client key untuk payment
VITE_MIDTRANS_IS_PRODUCTION # Mode Midtrans (false/true)
```

### Environment Files

Vite membaca file environment dengan prioritas:
1. `.env.[mode].local` (tertinggi, tidak ter-commit ke git)
2. `.env.[mode]` (development/production)
3. `.env.local` (tidak ter-commit ke git)
4. `.env` (lowest priority)

**Mode:**
- `development` → saat menjalankan `npm run dev`
- `production` → saat menjalankan `npm run build`

---

## Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd expense-tracker-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy file `.env.example` dan sesuaikan dengan konfigurasi lokal Anda:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
VITE_API_BASE_URL=http://localhost:8081/api/v1
VITE_APP_NAME=Expense Tracker
VITE_MIDTRANS_CLIENT_KEY=Mid-client-YOUR_SANDBOX_KEY
VITE_MIDTRANS_IS_PRODUCTION=false
```

### 4. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## Production Build

### 1. Setup Production Environment

Buat file `.env.production.local` (tidak akan ter-commit):

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_APP_NAME=Expense Tracker
VITE_MIDTRANS_CLIENT_KEY=Mid-client-YOUR_PRODUCTION_KEY
VITE_MIDTRANS_IS_PRODUCTION=true
```

### 2. Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`

### 3. Preview Production Build (Optional)

```bash
npm run preview
```

---

## Deployment Platforms

### Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables di Vercel Dashboard:**
   - Go to: Project Settings → Environment Variables
   - Tambahkan semua required variables untuk Production environment

4. **Production Deployment:**
   ```bash
   vercel --prod
   ```

**Environment Variables di Vercel:**
- `VITE_API_BASE_URL` = `https://api.yourdomain.com/api/v1`
- `VITE_APP_NAME` = `Expense Tracker`
- `VITE_MIDTRANS_CLIENT_KEY` = `Mid-client-PRODUCTION_KEY`
- `VITE_MIDTRANS_IS_PRODUCTION` = `true`

---

### Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build Configuration (`netlify.toml`):**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables:**
   - Go to: Site Settings → Environment Variables
   - Tambahkan semua required variables

---

### Docker

1. **Buat `Dockerfile`:**
   ```dockerfile
   # Build stage
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   ARG VITE_API_BASE_URL
   ARG VITE_APP_NAME
   ARG VITE_MIDTRANS_CLIENT_KEY
   ARG VITE_MIDTRANS_IS_PRODUCTION
   ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
   ENV VITE_APP_NAME=$VITE_APP_NAME
   ENV VITE_MIDTRANS_CLIENT_KEY=$VITE_MIDTRANS_CLIENT_KEY
   ENV VITE_MIDTRANS_IS_PRODUCTION=$VITE_MIDTRANS_IS_PRODUCTION
   RUN npm run build

   # Production stage
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build Docker Image:**
   ```bash
   docker build \
     --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/api/v1 \
     --build-arg VITE_APP_NAME="Expense Tracker" \
     --build-arg VITE_MIDTRANS_CLIENT_KEY=Mid-client-KEY \
     --build-arg VITE_MIDTRANS_IS_PRODUCTION=true \
     -t expense-tracker-frontend .
   ```

3. **Run Container:**
   ```bash
   docker run -p 80:80 expense-tracker-frontend
   ```

---

### Traditional VPS/Server

1. **Build Locally atau di Server:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder ke server**

3. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/expense-tracker/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

4. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

---

## Security Best Practices

### 1. Environment Variables

- **NEVER commit** `.env.development`, `.env.production`, atau `.env.local` ke git
- Gunakan `.env.example` sebagai template
- Simpan production secrets di platform hosting (Vercel, Netlify, dll) atau secret manager

### 2. API Keys

- Gunakan **Sandbox keys** untuk development
- Gunakan **Production keys** hanya di production environment
- Rotate keys secara berkala
- Jangan expose keys di client-side code selain yang memang untuk client-side (seperti Midtrans client key)

### 3. Build Optimization

Build production sudah dikonfigurasi untuk:
- Remove `console.log` dan `debugger` statements
- Minify code dengan Terser
- Code splitting untuk optimize loading
- Tidak generate sourcemap di production

### 4. Git Security

Jika sudah ter-commit file `.env` dengan secrets:

```bash
# Remove from git history
git rm --cached .env.development .env.production
git commit -m "Remove sensitive env files"

# Jika perlu bersihkan history (HATI-HATI!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.development .env.production" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (koordinasikan dengan team)
git push origin --force --all
```

---

## Troubleshooting

### Error: Missing required environment variables

Pastikan semua required variables sudah diset. Cek dengan:

```bash
# Development
cat .env.local

# Production
cat .env.production.local
```

### Build gagal di CI/CD

Pastikan environment variables sudah diset di CI/CD platform. Variables harus tersedia saat build time, bukan runtime.

### API tidak terhubung setelah deploy

1. Cek CORS configuration di backend
2. Pastikan `VITE_API_BASE_URL` benar
3. Cek network tab di browser DevTools
4. Pastikan backend accessible dari public internet

---

## Support

Jika ada masalah dalam deployment, silakan:
1. Cek dokumentasi platform hosting
2. Review error logs
3. Cek environment variables configuration
4. Hubungi team DevOps atau maintainer project

---

**Last Updated:** December 2024
