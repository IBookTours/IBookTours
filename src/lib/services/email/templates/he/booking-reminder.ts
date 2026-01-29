import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const {
    customerName,
    tourName,
    tourDate,
    daysUntil,
    meetingPoint,
    contactPhone,
  } = data;

  const dayText = daysUntil === 1 ? 'מחר' : `בעוד ${daysUntil} ימים`;

  const content = `
    <h1>הטיול שלך ${daysUntil === 1 ? 'מחר' : 'מתקרב'}!</h1>
    <p>${customerName} יקר/ה,</p>
    <p>זוהי תזכורת ידידותית שההרפתקה שלך מתחילה ${dayText}! אנחנו נרגשים שתצטרפו אלינו.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">פרטי הטיול</h2>
      <p>
        <span class="info-label">טיול</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">תאריך</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      ${meetingPoint ? `
      <p>
        <span class="info-label">נקודת מפגש</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>רשימת בדיקה מהירה</h2>
    <ul>
      <li>נעלי הליכה נוחות - יש!</li>
      <li>הגנה מהשמש - יש!</li>
      <li>מצלמה מוכנה - יש!</li>
      <li>תעודה מזהה - יש!</li>
      <li>חוש הרפתקה - בהחלט יש!</li>
    </ul>

    ${contactPhone ? `
    <p><strong>טלפון חירום:</strong> ${contactPhone}</p>
    ` : ''}

    <p>אנא הגיעו 10-15 דקות לפני זמן היציאה המתוכנן.</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">צפו בפרטי ההזמנה</a>
    </p>

    <p>להתראות בקרוב!</p>
    <p><strong>צוות IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `תזכורת: הטיול שלך ל-${tourName} מתחיל ${dayText}!`,
  });

  return {
    subject: `תזכורת: ${tourName} - ${tourDate}`,
    html,
    text: htmlToText(html),
  };
}
