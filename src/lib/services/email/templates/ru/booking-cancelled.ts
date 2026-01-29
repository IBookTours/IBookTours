import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>Бронирование отменено</h1>
    <p>Уважаемый(ая) ${customerName},</p>
    <p>Ваше бронирование было отменено по вашему запросу.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Детали отмены</h2>
      <p><span class="info-label">Номер бронирования</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">Тур</span><br><span class="info-value">${tourName}</span></p>
      ${refundAmount ? `<div class="divider"></div><p><span class="info-label">Сумма возврата</span><br><span class="info-value" style="font-size: 20px; color: #22c55e;">${refundAmount}</span></p><p style="font-size: 14px; color: #6b7280;">Возврат будет обработан в течение 5-10 рабочих дней на исходный способ оплаты.</p>` : ''}
    </div>

    <p>Нам жаль, что вы не сможете присоединиться к нам в этот раз. Надеемся увидеть вас в будущих приключениях!</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">Посмотреть другие туры</a></p>
    <p>Если у вас есть вопросы по отмене или возврату, свяжитесь с нами.</p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: `Ваше бронирование тура ${tourName} отменено.` });
  return { subject: `Бронирование отменено - ${tourName}`, html, text: htmlToText(html) };
}
