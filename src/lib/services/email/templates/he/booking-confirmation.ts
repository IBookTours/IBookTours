import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const {
    customerName,
    bookingId,
    tourName,
    tourDate,
    travelers,
    totalAmount,
    meetingPoint,
    contactPhone,
  } = data;

  const content = `
    <h1>ההזמנה אושרה!</h1>
    <p>${customerName} יקר/ה,</p>
    <p>חדשות מצוינות! ההזמנה שלך אושרה. אנחנו כבר לא יכולים לחכות להראות לך את יופייה של אלבניה!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">פרטי ההזמנה</h2>
      <p>
        <span class="info-label">מספר הזמנה</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">טיול</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">תאריך</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      <p>
        <span class="info-label">מספר מטיילים</span><br>
        <span class="info-value">${travelers} ${travelers === 1 ? 'אדם' : 'אנשים'}</span>
      </p>
      <p>
        <span class="info-label">סכום כולל</span><br>
        <span class="info-value" style="font-size: 20px; color: #e63946;">${totalAmount}</span>
      </p>
      ${meetingPoint ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">נקודת מפגש</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>מה להביא</h2>
    <ul>
      <li>נעלי הליכה נוחות</li>
      <li>הגנה מהשמש (כובע, קרם הגנה)</li>
      <li>מצלמה לצילומים מדהימים</li>
      <li>תעודת זהות או דרכון בתוקף</li>
      <li>אימייל אישור זה (מודפס או בטלפון)</li>
    </ul>

    ${contactPhone ? `
    <p>צריכים ליצור איתנו קשר ביום הטיול? התקשרו אלינו <strong>${contactPhone}</strong></p>
    ` : ''}

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">צפו בהזמנות שלי</a>
    </p>

    <p>אם יש לכם שאלות לפני הטיול, אל תהססו ליצור קשר.</p>
    <p><strong>צוות IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `ההזמנה שלך ל-${tourName} בתאריך ${tourDate} אושרה!`,
  });

  return {
    subject: `הזמנה אושרה - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
