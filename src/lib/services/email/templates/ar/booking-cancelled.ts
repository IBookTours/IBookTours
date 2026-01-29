import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>تم إلغاء الحجز</h1>
    <p>عزيزي/عزيزتي ${customerName}،</p>
    <p>تم إلغاء حجزك حسب طلبك.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">تفاصيل الإلغاء</h2>
      <p><span class="info-label">رقم الحجز</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">الجولة</span><br><span class="info-value">${tourName}</span></p>
      ${refundAmount ? `<div class="divider"></div><p><span class="info-label">مبلغ الاسترداد</span><br><span class="info-value" style="font-size: 20px; color: #22c55e;">${refundAmount}</span></p><p style="font-size: 14px; color: #6b7280;">سيتم معالجة الاسترداد خلال 5-10 أيام عمل إلى طريقة الدفع الأصلية.</p>` : ''}
    </div>

    <p>نأسف لعدم تمكنك من الانضمام إلينا هذه المرة. نأمل أن نراك في مغامرة مستقبلية!</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">استكشف جولات أخرى</a></p>
    <p>إذا كان لديك أي أسئلة حول الإلغاء أو الاسترداد، تواصل معنا.</p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: `تم إلغاء حجزك لـ ${tourName}.` });
  return { subject: `تم إلغاء الحجز - ${tourName}`, html, text: htmlToText(html) };
}
