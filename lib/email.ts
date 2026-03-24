import nodemailer from 'nodemailer';

// Configure the transport using environment variables
// The user must provide EMAIL_USER and EMAIL_PASS in the .env file
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to 'smtp.sendgrid.net' or others if not using Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, otpCode: string) {
  // If email credentials are not configured, log it and return gracefully
  // This prevents the application from crashing in development
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('⚠️ EMAIL_USER or EMAIL_PASS not found in .env. The verification email was not sent natively.');
    console.log(`[SIMULATION] Sending OTP: ${otpCode} to ${email}`);
    // Simulate a successful send for dev mode if needed, but returning false implies failure
    // It's better to explicitly throw so the caller knows it failed in production
  }

  const mailOptions = {
    from: `"رادار الذهب" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `رمز التحقق الخاص بك - رادار الذهب: ${otpCode}`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>رمز التحقق</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #111111;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            border: 1px solid #333;
          }
          .header {
            background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #111;
            margin: 0;
            font-size: 28px;
            font-weight: 900;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
          }
          .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #aaaaaa;
            margin-bottom: 30px;
          }
          .otp-box {
            background-color: #222222;
            border: 2px dashed #D4AF37;
            border-radius: 12px;
            padding: 20px;
            margin: 0 auto 30px;
            max-width: 300px;
          }
          .otp-code {
            font-size: 42px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #D4AF37;
            margin: 0;
            font-family: monospace;
          }
          .footer {
            background-color: #0a0a0a;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #222;
          }
          .footer p {
            color: #666666;
            font-size: 12px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>رادار الذهب</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #fff; margin-top: 0;">تأكيد البريد الإلكتروني</h2>
            <p>
              مرحباً بك في منصة <strong>رادار الذهب</strong>.<br>
              لتفعيل حسابك والمضي قدماً في عالم التداول الاحترافي، يرجى استخدام الرمز السري أدناه:
            </p>
            
            <div class="otp-box">
              <p class="otp-code">${otpCode}</p>
            </div>
            
            <p style="font-size: 14px; margin-bottom: 0;">
              هذا الرمز صالح لمدة <strong>15 دقيقة</strong> فقط.<br>
              إذا لم تقم بطلب هذا الرمز، يمكنك تجاهل هذه الرسالة بأمان.
            </p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} رادار الذهب | Golden Radar. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // In development without credentials, we just return false
    return false;
  }
}
