const BREVO_API_KEY = process.env.BREVO_API_KEY || "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";
const BREVO_SENDER = process.env.BREVO_SENDER || "noreply@flipypay.com";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface BrevoEmailRequest {
  sender: { email: string; name?: string };
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  textContent,
  senderName = "EduPlatform"
}: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  senderName?: string;
}): Promise<boolean> {
  try {
    const emailData: BrevoEmailRequest = {
      sender: {
        email: BREVO_SENDER,
        name: senderName
      },
      to: [{ email: to }],
      subject,
      htmlContent,
      textContent
    };

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", errorData);
      throw new Error(`Brevo API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return false;
  }
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #ffffff; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: #62bf00; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <span style="color: #000000; font-weight: bold; font-size: 24px;">E</span>
        </div>
        <h1 style="color: #62bf00; margin: 0;">EduPlatform</h1>
      </div>
      
      <h2 style="color: #ffffff; text-align: center;">Email Verification</h2>
      
      <p style="color: #ffffff; font-size: 16px;">Thank you for signing up with EduPlatform!</p>
      
      <p style="color: #ffffff; font-size: 16px;">Your verification code is:</p>
      
      <div style="background: #62bf00; color: #000000; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; border-radius: 8px; letter-spacing: 4px;">
        ${otp}
      </div>
      
      <p style="color: #ffffff; font-size: 14px;">This code will expire in 10 minutes.</p>
      
      <p style="color: #ffffff; font-size: 14px;">If you didn't request this verification, please ignore this email.</p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
        <p style="color: #888888; font-size: 12px;">Best regards,<br>EduPlatform Team</p>
      </div>
    </div>
  `;

  const textContent = `
    EduPlatform - Email Verification
    
    Thank you for signing up with EduPlatform!
    
    Your verification code is: ${otp}
    
    This code will expire in 10 minutes.
    
    If you didn't request this verification, please ignore this email.
    
    Best regards,
    EduPlatform Team
  `;

  return await sendEmail({
    to: email,
    subject: "EduPlatform - Email Verification OTP",
    htmlContent,
    textContent
  });
}

export async function sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000000; color: #ffffff; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: #62bf00; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
          <span style="color: #000000; font-weight: bold; font-size: 24px;">E</span>
        </div>
        <h1 style="color: #62bf00; margin: 0;">EduPlatform</h1>
      </div>
      
      <h2 style="color: #ffffff; text-align: center;">Welcome to EduPlatform!</h2>
      
      <p style="color: #ffffff; font-size: 16px;">Hi ${firstName},</p>
      
      <p style="color: #ffffff; font-size: 16px;">Welcome to EduPlatform! We're excited to have you join our learning community.</p>
      
      <p style="color: #ffffff; font-size: 16px;">You now have access to:</p>
      
      <ul style="color: #ffffff; font-size: 14px; padding-left: 20px;">
        <li>100+ Professional courses</li>
        <li>Lifetime access to course materials</li>
        <li>Industry-recognized certificates</li>
        <li>24/7 learning support</li>
        <li>Community forums and discussions</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://eduplatform.com/courses" style="background: #62bf00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Start Learning Now
        </a>
      </div>
      
      <p style="color: #ffffff; font-size: 14px;">If you have any questions, feel free to reach out to our support team at support@eduplatform.com</p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
        <p style="color: #888888; font-size: 12px;">Happy Learning!<br>EduPlatform Team</p>
      </div>
    </div>
  `;

  const textContent = `
    Welcome to EduPlatform!
    
    Hi ${firstName},
    
    Welcome to EduPlatform! We're excited to have you join our learning community.
    
    You now have access to:
    - 100+ Professional courses
    - Lifetime access to course materials  
    - Industry-recognized certificates
    - 24/7 learning support
    - Community forums and discussions
    
    Start your learning journey at: https://eduplatform.com/courses
    
    If you have any questions, reach out to: support@eduplatform.com
    
    Happy Learning!
    EduPlatform Team
  `;

  return await sendEmail({
    to: email,
    subject: "Welcome to EduPlatform - Start Your Learning Journey!",
    htmlContent,
    textContent
  });
}
