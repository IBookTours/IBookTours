import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const { customerName, bookingId, tourName, tourDate, meetingPoint, meetingTime, whatToBring } = data;

  const content = `
    <h1>Напоминание о туре</h1>
    <p>Уважаемый(ая) ${customerName},</p>
    <p>Ваш тур уже совсем скоро! Вот важная информация для вашей поездки.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Детали тура</h2>
      <p><span class="info-label">Тур</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">Дата</span><br><span class="info-value">${tourDate}</span></p>
      <p><span class="info-label">Место встречи</span><br><span class="info-value">${meetingPoint}</span></p>
      <p><span class="info-label">Время встречи</span><br><span class="info-value">${meetingTime}</span></p>
    </div>

    ${whatToBring ? `
    <div class="info-box">
      <h2 style="margin-top: 0;">Что взять с собой</h2>
      <ul style="margin: 8px 0; padding-left: 20px;">
        ${whatToBring.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <p style="text-align: center;"><a href="https://ibooktours.com/bookings/${bookingId}" class="button">Посмотреть бронирование</a></p>
    <p>Мы с нетерпением ждём встречи с вами!</p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: `Напоминание: ваш тур ${tourName} состоится ${tourDate}` });
  return { subject: `Напоминание о туре - ${tourName}`, html, text: htmlToText(html) };
}
