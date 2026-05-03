const nodemailer = require('nodemailer');

exports.sendVerificationEmail = async (email, token) => {
  console.log('Attempting to send email to:', email);
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const verifyUrl = `https://coverkart.onrender.com/api/auth/verify/${token}`;

  const info = await transporter.sendMail({
    from: `"CoverKart" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '✅ Verify your CoverKart account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e, #e94560); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🛍️ CoverKart</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1a1a2e;">Verify your email</h2>
          <p>Click the button below to verify your CoverKart account:</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #e94560; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-size: 16px; margin: 20px 0;">
            ✅ Verify Account
          </a>
          <p style="color: #888; font-size: 12px;">This link expires in 24 hours.</p>
        </div>
      </div>
    `
  });

  console.log('Email sent:', info.messageId);
};