# Email Setup Guide for Udhyoga Pay

## Gmail Configuration for Sending Emails

To enable the backend to send emails to workers with their login credentials, you need to set up Gmail with an App Password.

### Steps to Generate Gmail App Password:

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Under "Signing in to Google," select 2-Step Verification
   - Follow the steps to enable it

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Type "Udhyoga Pay Backend"
   - Click "Generate"
   - Copy the 16-character password (without spaces)

3. **Update .env File**:
   ```env
   EMAIL_USER=rajuchaswik@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

### Alternative Email Services:

If you prefer not to use Gmail, you can configure other services in `backend/src/services/emailService.ts`:

#### SendGrid:
```typescript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

#### Mailgun:
```typescript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD
  }
});
```

## Email Features

### 1. Worker Approval Email
When an admin approves a worker application:
- **Sent to**: Worker's personal email
- **Contains**:
  - Welcome message
  - Work email (e.g., worker1@udhyogapay.com)
  - Temporary password
  - Login instructions
  - Next steps to get started

### 2. Worker Rejection Email
When an admin rejects a worker application:
- **Sent to**: Worker's personal email
- **Contains**:
  - Rejection notice
  - Reason for rejection
  - Encouragement to reapply

## Testing Email Functionality

### Using a Test Gmail Account:
For development/testing, you can create a dedicated Gmail account:
1. Create a new Gmail account (e.g., udhyogapay.test@gmail.com)
2. Enable 2-Step Verification
3. Generate App Password
4. Update .env with test account credentials

### Using Mailtrap (Recommended for Development):
Mailtrap catches all emails in development without sending them:
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-password
```

Update `emailService.ts`:
```typescript
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## Security Best Practices

1. **Never commit credentials**: The .env file is in .gitignore
2. **Use App Passwords**: Never use your actual Gmail password
3. **Rotate passwords**: Change app passwords periodically
4. **Monitor usage**: Check Google Account activity regularly
5. **Production**: Use dedicated email service (SendGrid, AWS SES, etc.)

## Troubleshooting

### Email Not Sending:
1. Check .env file has correct credentials
2. Verify 2-Step Verification is enabled
3. Ensure App Password is correct (no spaces)
4. Check console for error messages
5. Verify EMAIL_USER and EMAIL_PASSWORD are loaded in process.env

### "Less secure app access":
- Gmail no longer supports this
- You MUST use App Passwords with 2-Step Verification

### Rate Limits:
- Gmail: 500 emails/day for free accounts
- For production: Use SendGrid (100 emails/day free) or AWS SES

## Production Deployment

For production, consider using:
1. **SendGrid** - 100 emails/day free
2. **AWS SES** - Pay-as-you-go, very cheap
3. **Mailgun** - 5000 emails/month free
4. **Postmark** - Reliable, transaction-focused

Update the email service configuration accordingly.
