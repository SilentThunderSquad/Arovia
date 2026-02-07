# Vercel Environment Variables Setup Guide

## Problem
The error `OAuth2Strategy requires a clientID option` occurs because environment variables from your local `.env` file are not available on Vercel. The `.env` file is gitignored (for security) and doesn't get deployed.

## Solution: Configure Environment Variables in Vercel

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Navigate to your **Arovia** project
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add Required Environment Variables

Add the following environment variables from your `backend/.env` file:

#### Required Variables:

| Variable Name | Description | Example Value |
|--------------|-------------|---------------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456789-abcdefg.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | `GOCSPX-xxxxxxxxxxxxx` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/arovia` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_super_secret_jwt_key_here` |
| `SESSION_SECRET` | Secret key for sessions | `your_session_secret_key_here` |
| `CLIENT_URL` | Frontend URL | `https://your-app.vercel.app` |

#### Optional Variables:

| Variable Name | Description | Default |
|--------------|-------------|---------|
| `PORT` | Server port (Vercel handles this) | `5000` |

### Step 3: Set Environment Scope

For each variable, select the appropriate environment(s):
- ✅ **Production** - For your main deployment
- ✅ **Preview** - For branch deployments (like `dashboards`)
- ✅ **Development** - For local development (optional)

**Recommendation:** Select **all three** for each variable to ensure consistency.

### Step 4: Save and Redeploy

1. Click **Save** after adding all variables
2. Vercel will automatically trigger a new deployment
3. Or manually redeploy: Go to **Deployments** → Click **⋯** → **Redeploy**

---

## How to Get Google OAuth Credentials

If you don't have Google OAuth credentials yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as application type
7. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/google/callback`
   - `http://localhost:5000/api/auth/google/callback` (for local dev)
8. Copy the **Client ID** and **Client Secret**

---

## Verification

After adding environment variables and redeploying:

1. Check Vercel deployment logs
2. You should see: `✅ MongoDB connected successfully`
3. You should NOT see: `❌ ERROR: Missing required Google OAuth environment variables!`
4. The OAuth error should be gone

---

## Local Development

Your local development will continue to work with the `backend/.env` file. The code now correctly loads from:
```javascript
dotenv.config({ path: path.join(__dirname, '..', '.env') });
```

---

## Security Notes

- ✅ **NEVER** commit `.env` files to Git
- ✅ `.env` is already in `.gitignore`
- ✅ Use different credentials for production vs development
- ✅ Rotate secrets regularly
- ✅ Use Vercel's encrypted environment variables

---

## Troubleshooting

### Still seeing the error?
1. Double-check variable names (case-sensitive!)
2. Ensure no extra spaces in variable values
3. Verify all environments are selected (Production/Preview/Development)
4. Try a manual redeploy

### Need to update a variable?
1. Go to Settings → Environment Variables
2. Click **⋯** next to the variable
3. Click **Edit**
4. Update the value and save
5. Redeploy your application

---

## Quick Checklist

- [ ] Added `GOOGLE_CLIENT_ID` to Vercel
- [ ] Added `GOOGLE_CLIENT_SECRET` to Vercel
- [ ] Added `MONGO_URI` to Vercel
- [ ] Added `JWT_SECRET` to Vercel
- [ ] Added `SESSION_SECRET` to Vercel
- [ ] Added `CLIENT_URL` to Vercel
- [ ] Selected all environments (Production/Preview/Development)
- [ ] Saved all variables
- [ ] Triggered a new deployment
- [ ] Checked deployment logs for success

---

**After completing these steps, your Vercel deployment should work perfectly!** 🚀
