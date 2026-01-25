import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>קיבלנו את ההודעה שלך</h1>
    <p>${customerName} יקר/ה,</p>
    <p>תודה שפנית ל-ITravelTours! קיבלנו את ההודעה שלך ורצינו לעקוב.</p>

    <div class="info-box">
      <p>
        <span class="info-label">בנוגע ל</span><br>
        <span class="info-value">${originalSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">התגובה שלנו</span><br>
        <span class="info-value">${replyMessage.replace(/\n/g, '<br>')}</span>
      </p>
    </div>

    <p>אם יש לכם שאלות נוספות, אתם מוזמנים להשיב לאימייל זה או לבקר במרכז העזרה שלנו.</p>

    <p style="text-align: center;">
      <a href="https://itraveltours.com/help" class="button">בקרו במרכז העזרה</a>
    </p>

    <p>בברכה,</p>
    <p><strong>צוות ITravelTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `תגובה לפנייתך: ${originalSubject}`,
  });

  return {
    subject: `תגובה: ${originalSubject}`,
    html,
    text: htmlToText(html),
  };
}
