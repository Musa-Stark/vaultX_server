import { Resend } from "resend";
import { config } from "../config/index.js";
import crypto from "crypto";

export const sendOTP = async (email) => {
  const OTP = crypto.randomInt(100000, 999999).toString();
  const resend = new Resend(config.RESEND_APIKEY);
  const htmlTemp = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="500" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.08); padding:40px;">
          
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h2 style="margin:0; color:#111827; font-weight:600;">VaultX</h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:20px;">
              <h1 style="margin:0; font-size:22px; color:#111827;">
                Email Verification Code
              </h1>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:30px; color:#6b7280; font-size:15px; line-height:1.6;">
              Use the verification code below to complete your sign-in process.
              This code will expire in <strong>5 minutes</strong>.
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:30px;">
              <div style="
                display:inline-block;
                padding:18px 32px;
                font-size:28px;
                letter-spacing:8px;
                font-weight:bold;
                color:#111827;
                background:#f3f4f6;
                border-radius:8px;
                border:1px solid #e5e7eb;">
                ${OTP}
              </div>
            </td>
          </tr>

          <tr>
            <td align="center" style="color:#9ca3af; font-size:13px; line-height:1.5;">
              If you didn’t request this code, you can safely ignore this email.
              Never share your verification code with anyone.
            </td>
          </tr>

          <tr>
            <td style="padding-top:30px;">
              <hr style="border:none; border-top:1px solid #e5e7eb;" />
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:15px; font-size:12px; color:#9ca3af;">
              © 2026 Your Company. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const result = await resend.emails.send({
    from: "OTP - VaultX <onboarding@resend.dev>",
    to: email,
    subject: "Email verification",
    html: htmlTemp,
  });
  if (result.error) {
    return {
      error: true,
      message: result.error.message,
      statusCode: result.error.statusCode,
    };
  }

  return OTP;
};
