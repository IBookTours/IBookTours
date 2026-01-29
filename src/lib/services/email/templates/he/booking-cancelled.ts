import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>ההזמנה בוטלה</h1>
    <p>${customerName} יקר/ה,</p>
    <p>אנחנו מצטערים לראות אותך עוזב/ת! ההזמנה שלך בוטלה כפי שביקשת.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">פרטי הביטול</h2>
      <p>
        <span class="info-label">מספר הזמנה</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">טיול</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      ${refundAmount ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">סכום להחזר</span><br>
        <span class="info-value" style="font-size: 20px; color: #059669;">${refundAmount}</span>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        ההחזר יעובד תוך 5-10 ימי עסקים ויזוכה לאמצעי התשלום המקורי שלך.
      </p>
      ` : ''}
    </div>

    <p>אנחנו מקווים לארח אותך בהרפתקה עתידית! לאלבניה יש כל כך הרבה חוויות מדהימות שמחכות לך.</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">עיינו בטיולים אחרים</a>
    </p>

    <p>אם יש לכם שאלות על הביטול או ההחזר, אל תהססו ליצור קשר.</p>
    <p><strong>צוות IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `ההזמנה שלך ל-${tourName} בוטלה.`,
  });

  return {
    subject: `הזמנה בוטלה - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
