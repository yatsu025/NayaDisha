# 🔍 Realtime Not Working? Debug Guide

## Step 1: Supabase Realtime Configuration

### ✅ Check Karo:

1. **Supabase Dashboard** mein jao
2. **Database** → **Replication** → **Realtime** (NOT ETL Replication!)
3. Ye tables enable hone chahiye:
   - ✅ `users`
   - ✅ `user_progress`
   - ✅ `user_tokens`
   - ✅ `mentor_requests`

### Agar Enable Nahi Hai:
```
Har table ke aage toggle button hoga
Click karke enable karo
Green dot aana chahiye ✅
```

---

## Step 2: RLS Policies Check

Supabase Dashboard → **Authentication** → **Policies**

### `users` table policies:
```sql
-- SELECT policy (MUST HAVE!)
CREATE POLICY "Enable read access for authenticated users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Or user-specific:
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (id = auth.uid());
```

### `user_tokens` table policies:
```sql
CREATE POLICY "Users can view own tokens"
ON user_tokens FOR SELECT
USING (user_id = auth.uid());
```

### `user_progress` table policies:
```sql
CREATE POLICY "Users can view own progress"
ON user_progress FOR SELECT
USING (user_id = auth.uid());
```

---

## Step 3: Test Realtime Connection

Browser console mein ye code run karo:

```javascript
// Test 1: Check if Supabase client is working
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

// Test 2: Subscribe to a channel
const testChannel = supabase
  .channel('test-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'users' },
    (payload) => console.log('✅ Realtime working!', payload)
  )
  .subscribe((status) => {
    console.log('Channel status:', status)
  })

// Wait 5 seconds, then update a user in Supabase dashboard
// You should see the log in console
```

---

## Step 4: Common Issues & Fixes

### Issue 1: "Channel status: CHANNEL_ERROR"
**Fix:**
- Realtime not enabled on table
- Go to Database → Replication → Realtime
- Enable the table

### Issue 2: "Channel status: TIMED_OUT"
**Fix:**
- RLS policy blocking SELECT
- Add SELECT policy for authenticated users

### Issue 3: No logs in console
**Fix:**
- Check if user is logged in
- Check if profile.id exists
- Add console.log to verify

### Issue 4: Updates work but UI doesn't refresh
**Fix:**
- fetchUser() function not being called
- State not updating properly
- Check useUser store

---

## Step 5: Manual Test

### Test in Supabase Dashboard:

1. Open your app in browser
2. Open browser console (F12)
3. Go to Supabase Dashboard
4. Open SQL Editor
5. Run this:

```sql
-- Get your user ID first
SELECT id, email, xp FROM users;

-- Update your XP
UPDATE users 
SET xp = xp + 100 
WHERE email = 'your-email@example.com';
```

6. Check browser console - should see: `🔥 Realtime user update:`
7. Check UI - XP should update automatically

---

## Step 6: Vercel Environment Variables

If deployed on Vercel, check:

```
Vercel Dashboard → Your Project → Settings → Environment Variables

Must have:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

After adding/changing:
- Redeploy the app
```

---

## Quick Fix Commands

### If nothing works, try this:

1. **Restart Supabase Realtime:**
   - Supabase Dashboard → Realtime → Restart

2. **Clear browser cache:**
   - Ctrl + Shift + Delete
   - Clear cache and reload

3. **Redeploy on Vercel:**
   - Vercel Dashboard → Deployments → Redeploy

---

## Expected Console Logs

When realtime is working, you should see:

```
🔥 Realtime user update: { id: '...', xp: 200, ... }
🔥 Realtime progress update: { user_id: '...', ... }
🔥 Realtime token update: { tokens: 4, ... }
```

If you don't see these logs, realtime is NOT working.

---

## Need Help?

Share screenshot of:
1. Supabase → Database → Replication → Realtime (show enabled tables)
2. Browser console (F12) when you update data
3. Any error messages
