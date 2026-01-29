import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const { customerName, tourName, tourDate, daysUntil, meetingPoint, contactPhone } = data;

  const content = `
    <h1>جولتك تقترب!</h1>
    <p>عزيزي/عزيزتي ${customerName}،</p>
    <p>مجرد تذكير ودي بأن جولتك بعد <strong>${daysUntil} ${daysUntil === 1 ? 'يوم' : 'أيام'}</strong>!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">تفاصيل الجولة</h2>
      <p><span class="info-label">الجولة</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">التاريخ</span><br><span class="info-value">${tourDate}</span></p>
      ${meetingPoint ? `<p><span class="info-label">نقطة التجمع</span><br><span class="info-value">${meetingPoint}</span></p>` : ''}
    </div>

    <h2>قائمة التحقق السريعة</h2>
    <ul>
      <li>تأكد من التاريخ والوقت</li>
      <li>جهز ملابس وأحذية مريحة</li>
      <li>أحضر واقي شمسي وماء</li>
      <li>احمل هويتك/جواز سفرك</li>
      <li>احفظ هذا البريد أو اطبع تأكيدك</li>
    </ul>

    ${contactPhone ? `<p>أسئلة في اللحظة الأخيرة؟ اتصل بنا على <strong>${contactPhone}</strong></p>` : ''}

    <p style="text-align: center;"><a href="https://ibooktours.com/profile" class="button">عرض تفاصيل الحجز</a></p>
    <p>نتطلع لرؤيتك!</p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: `جولتك ${tourName} بعد ${daysUntil} ${daysUntil === 1 ? 'يوم' : 'أيام'}!` });
  return { subject: `تذكير: ${tourName} بعد ${daysUntil} ${daysUntil === 1 ? 'يوم' : 'أيام'}`, html, text: htmlToText(html) };
}
