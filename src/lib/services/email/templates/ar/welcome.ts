import { baseTemplate, htmlToText } from '../base';
import { WelcomeData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeData): RenderedEmail {
  const { customerName } = data;

  const content = `
    <h1>مرحباً بك في IBookTours!</h1>
    <p>عزيزي/عزيزتي ${customerName}،</p>
    <p>شكراً لانضمامك إلى IBookTours! نحن سعداء جداً بوجودك كجزء من مجتمع المسافرين لدينا.</p>
    <p>ألبانيا تنتظرك بمناظرها الطبيعية الخلابة وتاريخها الغني وكرم الضيافة. سواء كنت تبحث عن عطلة شاطئية هادئة أو مغامرة جبلية، لدينا الرحلة المثالية لك.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">ما هي الخطوة التالية؟</h2>
      <p><strong>1. استعرض الجولات</strong> - اكتشف جولاتنا اليومية وباقات العطلات المختارة</p>
      <p><strong>2. احجز مغامرتك</strong> - احجز مكانك بسهولة عبر الإنترنت</p>
      <p><strong>3. سافر بثقة</strong> - استمتع بمرشدين خبراء ومعرفة محلية</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">استكشف الجولات</a>
    </p>

    <p>إذا كان لديك أي أسئلة، فريقنا دائماً هنا للمساعدة.</p>
    <p>رحلات سعيدة!</p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'ar',
    content,
    previewText: `مرحباً بك في IBookTours، ${customerName}! ابدأ باستكشاف أفضل جولات ألبانيا.`,
  });

  return {
    subject: `مرحباً بك في IBookTours، ${customerName}!`,
    html,
    text: htmlToText(html),
  };
}
