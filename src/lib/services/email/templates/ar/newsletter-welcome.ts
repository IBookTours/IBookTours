import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>مرحباً بك في نشرتنا الإخبارية!</h1>
    <p>مرحباً!</p>
    <p>شكراً لاشتراكك في نشرة IBookTours الإخبارية! أنت الآن جزء من مجتمعنا من المسافرين المغامرين.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">ماذا ستحصل عليه</h2>
      <p><strong>عروض حصرية</strong> - كن أول من يعرف عن العروض الخاصة</p>
      <p><strong>إلهام للسفر</strong> - اكتشف الجواهر المخفية في ألبانيا</p>
      <p><strong>نصائح السفر</strong> - نصائح من الخبراء لمغامرتك</p>
      <p><strong>جولات جديدة</strong> - وصول مبكر لأحدث جولاتنا</p>
    </div>

    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">ابدأ الاستكشاف</a></p>
    <p style="font-size: 14px; color: #6b7280;">اشتركت باستخدام: ${email}<br>يمكنك إلغاء الاشتراك في أي وقت بالنقر على رابط إلغاء الاشتراك في رسائلنا.</p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: 'مرحباً بك في نشرة IBookTours الإخبارية! عروض حصرية ونصائح سفر بانتظارك.' });
  return { subject: 'مرحباً بك في نشرة IBookTours الإخبارية!', html, text: htmlToText(html) };
}
