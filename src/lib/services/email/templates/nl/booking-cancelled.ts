import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>Boeking geannuleerd</h1>
    <p>Beste ${customerName},</p>
    <p>Je boeking is geannuleerd zoals door jou aangevraagd.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Annuleringsgegevens</h2>
      <p><span class="info-label">Boekingsnummer</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">Tour</span><br><span class="info-value">${tourName}</span></p>
      ${refundAmount ? `<div class="divider"></div><p><span class="info-label">Terug te betalen bedrag</span><br><span class="info-value" style="font-size: 20px; color: #22c55e;">${refundAmount}</span></p><p style="font-size: 14px; color: #6b7280;">De terugbetaling wordt binnen 5-10 werkdagen verwerkt naar de oorspronkelijke betaalmethode.</p>` : ''}
    </div>

    <p>Het spijt ons dat je deze keer niet mee kon gaan. We hopen je te zien bij een toekomstig avontuur!</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">Bekijk andere tours</a></p>
    <p>Als je vragen hebt over de annulering of terugbetaling, neem dan contact met ons op.</p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: `Je boeking voor ${tourName} is geannuleerd.` });
  return { subject: `Boeking geannuleerd - ${tourName}`, html, text: htmlToText(html) };
}
