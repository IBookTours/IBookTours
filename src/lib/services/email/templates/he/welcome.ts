import { baseTemplate, htmlToText } from '../base';
import { WelcomeData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeData): RenderedEmail {
  const { customerName } = data;

  const content = `
    <h1>ברוכים הבאים ל-IBookTours!</h1>
    <p>${customerName} יקר/ה,</p>
    <p>תודה שהצטרפת ל-IBookTours! אנחנו נרגשים לקבל אותך כחלק מקהילת המטיילים שלנו.</p>
    <p>אלבניה מחכה לך עם נופים מרהיבים, היסטוריה עשירה והכנסת אורחים חמה. בין אם אתם מחפשים חופשת חוף רגועה או טיול הרים מאתגר, יש לנו את הטיול המושלם בשבילכם.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">מה הלאה?</h2>
      <p><strong>1. דפדפו בטיולים</strong> - גלו את הטיולים וחבילות הנופש שלנו</p>
      <p><strong>2. הזמינו את ההרפתקה שלכם</strong> - שמרו את המקום שלכם בהזמנה קלה אונליין</p>
      <p><strong>3. טיילו בביטחון</strong> - תהנו ממדריכים מומחים ותובנות מקומיות</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">גלו טיולים</a>
    </p>

    <p>אם יש לכם שאלות, הצוות שלנו תמיד כאן לעזור.</p>
    <p>טיולים נעימים!</p>
    <p><strong>צוות IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `ברוכים הבאים ל-IBookTours, ${customerName}! התחילו לגלות את הטיולים הטובים ביותר באלבניה.`,
  });

  return {
    subject: `ברוכים הבאים ל-IBookTours, ${customerName}!`,
    html,
    text: htmlToText(html),
  };
}
