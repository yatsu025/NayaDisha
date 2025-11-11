# Supabase Setup Guide - NayaDisha

## 🔧 Email Authentication Setup (Required)

### Step 1: Enable Email Provider in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `sybpdloxirehafzepvda`
3. Navigate to **Authentication** → **Providers**
4. Find **Email** provider
5. Make sure it's **ENABLED** (it should be enabled by default)

### Step 2: Configure Email Settings

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. You can customize the confirmation email template (optional)

### Step 3: Email Confirmation Settings

**Option A: Disable Email Confirmation (For Testing)**
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **Uncheck** "Enable email confirmations"
4. Click **Save**

**Option B: Keep Email Confirmation (Production)**
- Users will receive a confirmation email after signup
- They must click the link to verify their account
- Then they can login

### Step 4: Test the Authentication

1. Run your app: `npm run dev`
2. Go to http://localhost:3000/login
3. Click "Don't have an account? Sign Up"
4. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
5. Click "Sign Up"

**If email confirmation is disabled:**
- You'll be logged in immediately
- Redirected to dashboard

**If email confirmation is enabled:**
- You'll see: "Please check your email to verify"
- Check your email inbox
- Click the verification link
- Then go back and login

## 🎯 Current Login Features

### Sign Up (Registration)
- Name field
- Email field
- Password field (minimum 6 characters)
- Creates new account in Supabase
- Stores name in user metadata

### Sign In (Login)
- Email field
- Password field
- Authenticates existing users
- Redirects to dashboard on success

### Toggle Between Login/Signup
- "Don't have an account? Sign Up" button
- "Already have an account? Sign In" button

### Error Handling
- Shows error messages in red
- Shows success messages in green
- Handles duplicate email errors
- Handles invalid credentials

## 🔐 Security Features

- Passwords are hashed by Supabase
- Minimum 6 character password requirement
- Email validation
- Protected routes (auto-redirect)
- Secure session management

## 📧 Email Configuration (Optional)

For production, you can configure custom SMTP:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable custom SMTP
4. Add your email provider details:
   - Host (e.g., smtp.gmail.com)
   - Port (e.g., 587)
   - Username
   - Password
   - Sender email

## 🧪 Test Accounts

You can create test accounts directly in Supabase:

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. User is created instantly

## 🚨 Common Issues & Solutions

### Issue: "Invalid login credentials"
**Solution**: 
- Check if email confirmation is required
- Verify the email/password are correct
- Make sure user exists in Supabase

### Issue: "User already exists"
**Solution**: 
- Use the login form instead of signup
- Or use a different email address

### Issue: "Email not confirmed"
**Solution**: 
- Check your email inbox for confirmation link
- Or disable email confirmation in Supabase settings

### Issue: Not receiving confirmation emails
**Solution**: 
- Check spam folder
- Verify email settings in Supabase
- For testing, disable email confirmation

## 📝 Database Schema (Optional)

You can create additional tables for user data:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  name text,
  xp integer default 0,
  level integer default 1,
  confidence_score integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policy for users to read their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Create policy for users to update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

## 🎉 You're All Set!

Your authentication is now working with:
- ✅ Email/Password signup
- ✅ Email/Password login
- ✅ User session management
- ✅ Protected routes
- ✅ Error handling

No need for Google OAuth setup anymore!

## 🔄 Next Steps

1. Test signup and login
2. Create some test accounts
3. Explore the dashboard
4. Start building features!
