import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>Reset Your Password</h1>
    <p>Dear ${customerName},</p>
    <p>We received a request to reset your ITravelTours account password. Click the button below to create a new password:</p>

    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </p>

    <div class="info-box" style="background-color: #fef3c7; border-color: #f59e0b;">
      <p style="margin: 0; color: #92400e;">
        <strong>Important:</strong> This link will expire in ${expiresIn}. If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>

    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; font-size: 14px; color: #6b7280;">${resetLink}</p>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280;">
      <strong>Security Tips:</strong>
    </p>
    <ul style="font-size: 14px; color: #6b7280;">
      <li>Never share your password with anyone</li>
      <li>Use a unique password for each website</li>
      <li>Consider using a password manager</li>
    </ul>

    <p>If you didn't request this password reset, please contact us immediately.</p>
    <p><strong>The ITravelTours Team</strong></p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `Reset your ITravelTours password. Link expires in ${expiresIn}.`,
  });

  return {
    subject: 'Reset Your ITravelTours Password',
    html,
    text: htmlToText(html),
  };
}
