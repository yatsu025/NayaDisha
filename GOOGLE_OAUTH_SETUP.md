# 🔵 Google OAuth Setup Guide - Step by Step

## 📋 Prerequisites
- Supabase project (already have: sybpdloxirehafzepvda)
- Google account
- 10 minutes

## 🎯 Step-by-Step Setup

### Step 1: Go to Google Cloud Console

1. Open browser and go to: https://console.cloud.google.com
2. Sign in with your Google account

### Step 2: Create/Select Project

**Option A: Create New Project**
1. Click on project dropdown (top left)
2. Click "New Project"
3. Name: "NayaDisha" (or any name)
4. Click "Create"
5. Wait for project to be created

**Option B: Use Existing Project**
1. Click on project dropdown
2. Select your existing project

### Step 3: Enable Google+ API

1. In the search bar, type "Google+ API"
2. Click on "Google+ API"
3. Click "Enable"
4. Wait for it to enable

### Step 4: Create OAuth Credentials

1. Go to "Credentials" (left sidebar)
2. Click "Create Credentials" (top)
3. Select "OAuth client ID"

**If you see "Configure Consent Screen":**
1. Click "Configure Consent Screen"
2. Select "External"
3. Click "Create"
4. Fill in:
   - App name: NayaDisha
   - User support email: your email
   - Developer contact: your email
5. Click "Save and Continue"
6. Skip "Scopes" → Click "Save and Continue"
7. Skip "Test users" → Click "Save and Continue"
8. Click "Back to Dashboard"

### Step 5: Create OAuth Client ID

1. Go back to "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: "NayaDisha Web Client"

### Step 6: Add Authorized Redirect URIs

**IMPORTANT:** Add this exact URL:
```
https://sybpdloxirehafzepvda.supabase.co/auth/v1/callback
```

**How to add:**
1. Scroll to "Authorized redirect URIs"
2. Click "+ ADD URI"
3. Paste the URL above
4. Click "Create"

### Step 7: Copy Credentials

You'll see a popup with:
- **Client ID**: Looks like `123456789-abc.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-abc123xyz`

**IMPORTANT:** Copy both! You'll need them in next step.

### Step 8: Add to Supabase

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project: `sybpdloxirehafzepvda`
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click to expand
6. Toggle **"Enable Sign in with Google"** to ON
7. Paste **Client ID** (from Step 7)
8. Paste **Client Secret** (from Step 7)
9. Click **Save**

### Step 9: Test It!

1. Run your app: `npm run dev`
2. Go to: http://localhost:3000/login
3. Click **"Continue with Google"**
4. Select your Google account
5. Click "Allow" to grant permissions
6. You should be redirected to dashboard!

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth client ID created
- [ ] Redirect URI added correctly
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Google provider enabled in Supabase
- [ ] Credentials pasted in Supabase
- [ ] Saved in Supabase
- [ ] Tested login flow

## 🎨 What Users Will See

```
Login Page
    ↓
Click "Continue with Google"
    ↓
Google Account Selection Popup
    ↓
"NayaDisha wants to access your Google Account"
    ↓
Click "Allow"
    ↓
Redirected to Dashboard
    ↓
Logged In! 🎉
```

## 🔧 Configuration Details

### Redirect URI Explained
```
https://sybpdloxirehafzepvda.supabase.co/auth/v1/callback
│                                                      │
└─ Your Supabase Project URL                          │
                                                       │
                                    Supabase Auth Callback Path ─┘
```

### Scopes Requested
By default, Supabase requests:
- Email address
- Basic profile info (name, photo)

### User Data Stored
After Google login, Supabase stores:
```json
{
  "id": "uuid",
  "email": "user@gmail.com",
  "user_metadata": {
    "name": "User Name",
    "avatar_url": "https://...",
    "email": "user@gmail.com",
    "email_verified": true,
    "full_name": "User Name",
    "iss": "https://accounts.google.com",
    "picture": "https://...",
    "provider_id": "123456789",
    "sub": "123456789"
  }
}
```

## 🐛 Common Issues

### Issue: "Redirect URI mismatch"
**Cause:** Wrong redirect URI in Google Cloud Console
**Solution:** 
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Make sure redirect URI is EXACTLY:
   ```
   https://sybpdloxirehafzepvda.supabase.co/auth/v1/callback
   ```
4. No trailing slash, no extra spaces

### Issue: "Access blocked: This app's request is invalid"
**Cause:** OAuth consent screen not configured
**Solution:**
1. Go to "OAuth consent screen"
2. Fill in required fields
3. Add your email as test user
4. Publish app (or keep in testing mode)

### Issue: "Unsupported provider"
**Cause:** Google provider not enabled in Supabase
**Solution:**
1. Go to Supabase → Authentication → Providers
2. Enable Google provider
3. Add credentials
4. Save

### Issue: Popup blocked
**Cause:** Browser blocking popup
**Solution:**
1. Allow popups for localhost
2. Or click the popup icon in address bar
3. Or use redirect flow instead

## 🔐 Security Notes

✅ OAuth 2.0 protocol (industry standard)
✅ Credentials stored securely in Supabase
✅ No passwords stored in your app
✅ Google handles authentication
✅ Tokens expire automatically
✅ Refresh tokens managed by Supabase

## 📱 Mobile/Production Setup

### For Production (when deploying)

Add production redirect URI:
```
https://yourdomain.com/auth/callback
```

In Google Cloud Console:
1. Edit OAuth client
2. Add production redirect URI
3. Save

In Supabase:
1. Update Site URL in settings
2. Add production URL to allowed redirect URLs

## 🎉 Success!

If everything is set up correctly:
- ✅ Google button appears on login page
- ✅ Clicking opens Google account selection
- ✅ After selecting account, redirects to dashboard
- ✅ User is logged in
- ✅ User data is stored in Supabase

## 📞 Need Help?

**Google Cloud Console Issues:**
- Check Google Cloud Console documentation
- Verify project is selected
- Check billing is enabled (if required)

**Supabase Issues:**
- Check Supabase logs (Authentication → Logs)
- Verify credentials are correct
- Check redirect URI matches exactly

**App Issues:**
- Check browser console for errors
- Verify .env.local has correct Supabase URL
- Test with different browser

---

**Status**: 🔵 Google OAuth Ready to Configure!
**Time Required**: ~10 minutes
**Difficulty**: Easy (just follow steps)