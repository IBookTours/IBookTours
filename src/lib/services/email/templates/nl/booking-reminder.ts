import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const { customerName, bookingId, tourName, tourDate, meetingPoint, meetingTime, whatToBring } = data;

  const content = `
    <h1>Herinnering Tour</h1>
    <p>Beste ${customerName},</p>
    <p>Je tour komt eraan! Hier is de belangrijke informatie voor je reis.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Tourgegevens</h2>
      <p><span class="info-label">Tour</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">Datum</span><br><span class="info-value">${tourDate}</span></p>
      <p><span class="info-label">Ontmoetingspunt</span><br><span class="info-value">${meetingPoint}</span></p>
      <p><span class="info-label">Ontmoetingstijd</span><br><span class="info-value">${meetingTime}</span></p>
    </div>

    ${whatToBring ? `
    <div class="info-box">
      <h2 style="margin-top: 0;">Wat mee te nemen</h2>
      <ul style="margin: 8px 0; padding-left: 20px;">
        ${whatToBring.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <p style="text-align: center;"><a href="https://ibooktours.com/bookings/${bookingId}" class="button">Bekijk boeking</a></p>
    <p>We kijken ernaar uit je te zien!</p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: `Herinnering: Je tour ${tourName} is op ${tourDate}` });
  return { subject: `Tour herinnering - ${tourName}`, html, text: htmlToText(html) };
}
