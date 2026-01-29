import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>איפוס סיסמה</h1>
    <p>${customerName} יקר/ה,</p>
    <p>קיבלנו בקשה לאיפוס סיסמת חשבון IBookTours שלך. לחצו על הכפתור למטה כדי ליצור סיסמה חדשה:</p>

    <p style="text-align: center;">
      <a href="${resetLink}" class="button">איפוס סיסמה</a>
    </p>

    <div class="info-box" style="background-color: #fef3c7; border-color: #f59e0b;">
      <p style="margin: 0; color: #92400e;">
        <strong>חשוב:</strong> קישור זה יפוג תוך ${expiresIn}. אם לא ביקשתם איפוס סיסמה, תוכלו להתעלם מאימייל זה.
      </p>
    </div>

    <p>אם הכפתור לא עובד, העתיקו והדביקו את הקישור הזה בדפדפן:</p>
    <p style="word-break: break-all; font-size: 14px; color: #6b7280;">${resetLink}</p>

    <div class="divider"></div>

    <p style="font-size: 14px; color: #6b7280;">
      <strong>טיפים לאבטחה:</strong>
    </p>
    <ul style="font-size: 14px; color: #6b7280;">
      <li>לעולם אל תשתפו את הסיסמה שלכם עם אף אחד</li>
      <li>השתמשו בסיסמה ייחודית לכל אתר</li>
      <li>שקלו להשתמש במנהל סיסמאות</li>
    </ul>

    <p>אם לא ביקשתם איפוס סיסמה זה, אנא צרו איתנו קשר מיידית.</p>
    <p><strong>צוות IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `איפוס סיסמת IBookTours שלך. הקישור פג תוך ${expiresIn}.`,
  });

  return {
    subject: 'איפוס סיסמת IBookTours שלך',
    html,
    text: htmlToText(html),
  };
}
