'use strict';

// ── Load environment variables (local dev only) ──────────────────────────────
const path = require('path');
const fs   = require('fs');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('📁 Loaded .env from file');
} else {
  console.log('☁️  Using platform environment variables (Vercel)');
}

// ── Validate required vars ────────────────────────────────────────────────────
const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missing  = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  process.exit(1);
}

// ── Express setup ─────────────────────────────────────────────────────────────
const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── HTTP Security Headers Middleware ──────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none';");
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  next();
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Arovia API is running', timestamp: new Date().toISOString() });
});

// ── API Routes — module-based ─────────────────────────────────────────────────
app.use('/api/auth',   require('./modules/auth/auth.routes'));
app.use('/api/user',   require('./modules/user/user.routes'));
app.use('/api/admin',  require('./modules/admin/admin.routes'));
app.use('/api/public', require('./modules/public/public.routes'));

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(require('./middleware/error.middleware'));

// ── Start (local dev only) ────────────────────────────────────────────────────
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Arovia API running on http://localhost:${PORT}`);
    console.log(`   Supabase: ${process.env.SUPABASE_URL}`);
    console.log(`   CORS origin: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  });
}

module.exports = app;