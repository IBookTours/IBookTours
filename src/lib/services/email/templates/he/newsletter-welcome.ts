import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>ברוכים הבאים לניוזלטר שלנו!</h1>
    <p>תודה שנרשמתם לניוזלטר של ITravelTours!</p>
    <p>אתם עכשיו חלק מקהילת חובבי הטיולים שלנו שאוהבים לגלות את הפנינים הנסתרות והיעדים המרהיבים של אלבניה.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">מה לצפות</h2>
      <p><strong>הצעות בלעדיות</strong> - היו הראשונים לדעת על מבצעים והנחות מיוחדות</p>
      <p><strong>טיפים לטיולים</strong> - קבלו טיפים פנימיים להפיק את המירב מההרפתקה האלבנית שלכם</p>
      <p><strong>טיולים חדשים</strong> - גלו את הטיולים החדשים שלנו לפני כולם</p>
      <p><strong>מדריכי יעדים</strong> - למדו על המקומות הטובים ביותר לביקור באלבניה</p>
    </div>

    <p style="text-align: center;">
      <a href="https://itraveltours.com/tours" class="button">התחילו לגלות</a>
    </p>

    <p>אנחנו מבטיחים לשלוח לכם רק תוכן בעל ערך - ללא ספאם, לעולם!</p>
    <p>טיולים נעימים!</p>
    <p><strong>צוות ITravelTours</strong></p>

    <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
      אימייל רשום: ${email}<br>
      תוכלו לבטל את הרישום בכל עת על ידי לחיצה על הקישור בתחתית האימיילים שלנו.
    </p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: 'ברוכים הבאים לניוזלטר של ITravelTours! התכוננו להצעות בלעדיות וטיפים לטיולים.',
  });

  return {
    subject: 'ברוכים הבאים לניוזלטר של ITravelTours!',
    html,
    text: htmlToText(html),
  };
}
