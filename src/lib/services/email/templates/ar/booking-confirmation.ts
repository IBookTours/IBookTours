import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const { customerName, bookingId, tourName, tourDate, travelers, totalAmount, meetingPoint, contactPhone } = data;

  const content = `
    <h1>تم تأكيد الحجز!</h1>
    <p>عزيزي/عزيزتي ${customerName}،</p>
    <p>أخبار رائعة! تم تأكيد حجزك. نحن متحمسون لإظهار جمال ألبانيا لك!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">تفاصيل الحجز</h2>
      <p><span class="info-label">رقم الحجز</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">الجولة</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">التاريخ</span><br><span class="info-value">${tourDate}</span></p>
      <p><span class="info-label">عدد المسافرين</span><br><span class="info-value">${travelers} ${travelers === 1 ? 'شخص' : 'أشخاص'}</span></p>
      <p><span class="info-label">المبلغ الإجمالي</span><br><span class="info-value" style="font-size: 20px; color: #e63946;">${totalAmount}</span></p>
      ${meetingPoint ? `<div class="divider"></div><p><span class="info-label">نقطة التجمع</span><br><span class="info-value">${meetingPoint}</span></p>` : ''}
    </div>

    <h2>ماذا تحضر معك</h2>
    <ul>
      <li>أحذية مريحة للمشي</li>
      <li>حماية من الشمس (قبعة، واقي شمسي)</li>
      <li>كاميرا لصور رائعة</li>
      <li>هوية أو جواز سفر ساري المفعول</li>
      <li>رسالة التأكيد هذه (مطبوعة أو على هاتفك)</li>
    </ul>

    ${contactPhone ? `<p>تحتاج للتواصل معنا يوم الجولة؟ اتصل بنا على <strong>${contactPhone}</strong></p>` : ''}

    <p style="text-align: center;"><a href="https://ibooktours.com/profile" class="button">عرض حجوزاتي</a></p>
    <p>إذا كان لديك أي أسئلة قبل الجولة، لا تتردد في التواصل معنا.</p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: `تم تأكيد حجزك لـ ${tourName} في ${tourDate}!` });
  return { subject: `تم تأكيد الحجز - ${tourName}`, html, text: htmlToText(html) };
}
