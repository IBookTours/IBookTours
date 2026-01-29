import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const { customerName, bookingId, tourName, tourDate, travelers, totalPrice, meetingPoint, meetingTime, guideContact } = data;

  const content = `
    <h1>Boeking bevestigd!</h1>
    <p>Beste ${customerName},</p>
    <p>Geweldig nieuws! Je boeking is bevestigd. Hieronder vind je de details van je aankomende avontuur.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Boekingsgegevens</h2>
      <p><span class="info-label">Boekingsnummer</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">Tour</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">Datum</span><br><span class="info-value">${tourDate}</span></p>
      <p><span class="info-label">Aantal reizigers</span><br><span class="info-value">${travelers}</span></p>
      <p><span class="info-label">Totaal</span><br><span class="info-value" style="font-size: 20px; color: #22c55e;">${totalPrice}</span></p>
    </div>

    <div class="info-box">
      <h2 style="margin-top: 0;">Ontmoetingsinformatie</h2>
      <p><span class="info-label">Ontmoetingspunt</span><br><span class="info-value">${meetingPoint}</span></p>
      <p><span class="info-label">Ontmoetingstijd</span><br><span class="info-value">${meetingTime}</span></p>
      ${guideContact ? `<p><span class="info-label">Contact gids</span><br><span class="info-value">${guideContact}</span></p>` : ''}
    </div>

    <p style="text-align: center;"><a href="https://ibooktours.com/bookings/${bookingId}" class="button">Bekijk boeking</a></p>
    <p>Als je vragen hebt, neem dan gerust contact met ons op.</p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: `Je boeking voor ${tourName} is bevestigd!` });
  return { subject: `Boeking bevestigd - ${tourName}`, html, text: htmlToText(html) };
}
