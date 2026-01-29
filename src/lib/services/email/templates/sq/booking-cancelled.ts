import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>Rezervimi u Anulua</h1>
    <p>I/E dashur ${customerName},</p>
    <p>Rezervimi juaj është anuluar sipas kërkesës.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detajet e Anulimit</h2>
      <p>
        <span class="info-label">ID e Rezervimit</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">Turi</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      ${refundAmount ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">Shuma e Rimbursimit</span><br>
        <span class="info-value" style="font-size: 20px; color: #22c55e;">${refundAmount}</span>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        Rimbursimi do të procesohet brenda 5-10 ditëve të punës në metodën origjinale të pagesës.
      </p>
      ` : ''}
    </div>

    <p>Na vjen keq që nuk mund të bashkoheni me ne këtë herë. Shpresojmë t'ju shohim në një aventurë të ardhshme!</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Eksploroni Turne të Tjera</a>
    </p>

    <p>Nëse keni pyetje rreth anulimit ose rimbursimit, na kontaktoni.</p>
    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Rezervimi juaj për ${tourName} është anuluar.`,
  });

  return {
    subject: `Rezervimi u Anulua - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
