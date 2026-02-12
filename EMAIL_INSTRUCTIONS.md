# 📧 Email Setup Instructions for Udhyoga Pay

## Quick Start - Gmail App Password Setup

Follow these steps to enable email sending for worker credentials:

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: **https://myaccount.google.com/**
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google," click on **2-Step Verification**
4. Follow the prompts to set it up (you'll need your phone)

### Step 2: Generate App Password

1. Go to **https://myaccount.google.com/apppasswords**
   - Or: Google Account → Security → 2-Step Verification → App passwords
2. You may need to sign in again
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (Custom name)**
5. Type: `Udhyoga Pay Backend`
6. Click **Generate**
7. You'll see a 16-character password like: `abcd efgh ijkl mnop`

### Step 3: Update Backend Configuration

1. Open `backend/.env` file
2. Update these lines:
   ```env
   EMAIL_USER=rajuchaswik@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   **Important**: Remove all spaces from the app password!

### Step 4: Restart Backend Server

```powershell
cd backend
npm run dev
```

## ✅ How It Works

### When Admin Approves a Worker:

1. Admin enters work email (e.g., `worker1@udhyogapay.com`)
2. System generates a random password
3. Creates worker account in database
4. **Sends email** to worker's personal email with:
   - Welcome message
   - Work email
   - Temporary password
   - Login link
   - Instructions

### Worker Receives Email:

```
To: worker.personal@gmail.com
Subject: 🎉 Welcome to Udhyoga Pay - Your Account is Approved!

Dear [Worker Name],

Your application for [Profession] has been approved!

Your Login Credentials:
Work Email: worker1@udhyogapay.com
Password: a1b2c3d4e5f6g7h8

[Login to Udhyoga Pay Button]
```

### Worker Can Login:

1. Go to login page
2. Select "Worker" login
3. Use credentials from email
4. Start accepting bookings!

## 🔒 Security Notes

- ✅ **App Password is safe** - It only works for this app
- ✅ **Not your Gmail password** - Your main password stays secure
- ✅ **Can be revoked** - Delete it anytime from Google Account
- ✅ **Never committed to Git** - `.env` file is in `.gitignore`

## 🧪 Testing Email Functionality

### Test 1: Approve a Worker Application

1. Register as a worker (with your test email)
2. Login as admin
3. Go to "Pending Verifications" tab
4. Approve the worker with a work email
5. Check your personal email inbox

### Test 2: Check Console Logs

When email sends successfully:
```
✅ Email sent successfully: <message-id>
```

When email fails:
```
❌ Email sending failed: [error message]
```

## ❓ Troubleshooting

### "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution**: 
- Make sure 2-Step Verification is enabled
- Generate a NEW app password
- Copy it WITHOUT spaces
- Update `.env` file
- Restart backend

### "Less secure app access blocked"

**Solution**: 
- Gmail no longer supports "less secure apps"
- You MUST use App Passwords (see Step 2)

### Email not received

**Check**:
1. ✅ Spam folder
2. ✅ Personal email in worker application is correct
3. ✅ Backend console for error messages
4. ✅ Gmail daily limit (500 emails/day for free accounts)

### Environment variables not loading

**Solution**:
```powershell
# Stop the server (Ctrl+C)
# Restart it
cd backend
npm run dev
```

## 🚀 Production Recommendations

For production deployment, consider using:

1. **SendGrid** - More reliable, 100 emails/day free
2. **AWS SES** - Very cheap, pay-as-you-go
3. **Mailgun** - 5000 emails/month free
4. **Postmark** - Transaction-focused

See `EMAIL_SETUP.md` for detailed production setup.

## 📞 Support

If you encounter issues:
1. Check console logs for error messages
2. Verify .env file has correct values
3. Ensure 2-Step Verification is enabled
4. Try generating a new App Password

---

**Ready to test?** Restart your backend and approve a worker! 🎉
