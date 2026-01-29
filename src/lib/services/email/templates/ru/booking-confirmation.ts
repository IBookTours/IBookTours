import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const { customerName, bookingId, tourName, tourDate, travelers, totalPrice, meetingPoint, meetingTime, guideContact } = data;

  const content = `
    <h1>Бронирование подтверждено!</h1>
    <p>Уважаемый(ая) ${customerName},</p>
    <p>Отличные новости! Ваше бронирование подтверждено. Ниже представлены детали вашего предстоящего приключения.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Детали бронирования</h2>
      <p><span class="info-label">Номер бронирования</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">Тур</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">Дата</span><br><span class="info-value">${tourDate}</span></p>
      <p><span class="info-label">Количество гостей</span><br><span class="info-value">${travelers}</span></p>
      <p><span class="info-label">Итого</span><br><span class="info-value" style="font-size: 20px; color: #22c55e;">${totalPrice}</span></p>
    </div>

    <div class="info-box">
      <h2 style="margin-top: 0;">Информация о встрече</h2>
      <p><span class="info-label">Место встречи</span><br><span class="info-value">${meetingPoint}</span></p>
      <p><span class="info-label">Время встречи</span><br><span class="info-value">${meetingTime}</span></p>
      ${guideContact ? `<p><span class="info-label">Контакт гида</span><br><span class="info-value">${guideContact}</span></p>` : ''}
    </div>

    <p style="text-align: center;"><a href="https://ibooktours.com/bookings/${bookingId}" class="button">Посмотреть бронирование</a></p>
    <p>Если у вас есть вопросы, свяжитесь с нами.</p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: `Ваше бронирование тура ${tourName} подтверждено!` });
  return { subject: `Бронирование подтверждено - ${tourName}`, html, text: htmlToText(html) };
}
