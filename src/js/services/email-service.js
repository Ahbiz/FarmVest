// ============================================================
// FarmVest Transactional Email Service
// Handles REST dispatch for account verification OTPs,
// password recovery tokens, and harvest payout notifications.
// Reads API credentials from environment variables with fallback simulation.
// ============================================================

export const BREVO_CONFIG = {
  apiKey: import.meta.env.VITE_BREVO_API_KEY || '',
  senderEmail: import.meta.env.VITE_BREVO_SENDER_EMAIL || 'support@farmvest.com',
  senderName: import.meta.env.VITE_BREVO_SENDER_NAME || 'FarmVest Agriculture Investments',
  apiEndpoint: 'https://api.brevo.com/v3/smtp/email'
};

/**
 * Send transactional email via Brevo REST API
 */
export async function sendEmail({ to, subject, htmlContent, textContent }) {
  if (!BREVO_CONFIG.apiKey) {
    console.warn('[Email Service] API Key not configured. Simulating transactional email dispatch to:', to);
    return { success: true, simulated: true };
  }

  try {
    const response = await fetch(BREVO_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_CONFIG.apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_CONFIG.senderName,
          email: BREVO_CONFIG.senderEmail
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent || subject
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Brevo Email Service] Email sent successfully:', data);
      return { success: true, data };
    } else {
      const errData = await response.json();
      console.error('[Brevo Email Service] Failed to send email:', errData);
      return { success: false, error: errData };
    }
  } catch (err) {
    console.error('[Brevo Email Service] Error connecting to Brevo API:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send Registration Verification OTP Email
 */
export async function sendVerificationEmail(email, otpCode) {
  return sendEmail({
    to: email,
    subject: 'Your FarmVest Verification Code',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #F8FAFC; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0F5132; margin: 0;">Farm<span style="color:#16A34A;">Vest</span></h1>
        </div>
        <div style="background: #FFFFFF; padding: 32px; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h2 style="color: #0F5132; margin-top: 0;">Verify Your Email Address</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">Welcome to FarmVest! Please use the 6-digit verification code below to complete your registration:</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #16A34A; background: #F0FDF4; padding: 12px 24px; border-radius: 8px; border: 1px dashed #16A34A;">${otpCode}</span>
          </div>
          <p style="color: #64748B; font-size: 14px;">This code will expire in 10 minutes. If you did not create a FarmVest account, please ignore this email.</p>
        </div>
      </div>
    `
  });
}

/**
 * Send Password Reset Link Email
 */
export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${window.location.origin}/auth/reset-password.html?token=${resetToken}`;
  return sendEmail({
    to: email,
    subject: 'Reset Your FarmVest Password',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #F8FAFC; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #0F5132; margin: 0;">Farm<span style="color:#16A34A;">Vest</span></h1>
        </div>
        <div style="background: #FFFFFF; padding: 32px; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h2 style="color: #0F5132; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">We received a request to reset the password for your FarmVest account. Click the button below to proceed:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: #F59E0B; color: #0B1320; font-weight: 800; font-size: 16px; text-decoration: none; border-radius: 50px;">Reset Password</a>
          </div>
          <p style="color: #64748B; font-size: 14px;">If you didn't request a password reset, no action is needed.</p>
        </div>
      </div>
    `
  });
}

/**
 * Send Contact Support Ticket Notification
 */
export async function sendContactFormEmail(name, email, subject, message) {
  return sendEmail({
    to: BREVO_CONFIG.senderEmail,
    subject: `[Contact Form] ${subject} - from ${name}`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 24px;">
        <h2>New Contact Form Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #F1F5F9; padding: 16px; border-radius: 8px;">${message}</div>
      </div>
    `
  });
}
