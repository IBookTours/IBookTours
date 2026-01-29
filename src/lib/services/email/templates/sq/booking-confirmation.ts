import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const {
    customerName,
    bookingId,
    tourName,
    tourDate,
    travelers,
    totalAmount,
    meetingPoint,
    contactPhone,
  } = data;

  const content = `
    <h1>Rezervimi u Konfirmua!</h1>
    <p>I/E dashur ${customerName},</p>
    <p>Lajm i mirë! Rezervimi juaj është konfirmuar. Mezi presim t'ju tregojmë bukurinë e Shqipërisë!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detajet e Rezervimit</h2>
      <p>
        <span class="info-label">ID e Rezervimit</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">Turi</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">Data</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      <p>
        <span class="info-label">Numri i Udhëtarëve</span><br>
        <span class="info-value">${travelers} ${travelers === 1 ? 'person' : 'persona'}</span>
      </p>
      <p>
        <span class="info-label">Shuma Totale</span><br>
        <span class="info-value" style="font-size: 20px; color: #e63946;">${totalAmount}</span>
      </p>
      ${meetingPoint ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">Pika e Takimit</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>Çfarë të Sillni</h2>
    <ul>
      <li>Këpucë komode për ecje</li>
      <li>Mbrojtje nga dielli (kapelë, krem dielli)</li>
      <li>Aparat fotografik për foto të mrekullueshme</li>
      <li>ID ose pasaportë të vlefshme</li>
      <li>Këtë email konfirmimi (të printuar ose në telefon)</li>
    </ul>

    ${contactPhone ? `
    <p>Keni nevojë të na kontaktoni ditën e turit? Na telefononi në <strong>${contactPhone}</strong></p>
    ` : ''}

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">Shikoni Rezervimet e Mia</a>
    </p>

    <p>Nëse keni pyetje para turit, mos hezitoni të na kontaktoni.</p>
    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Rezervimi juaj për ${tourName} më ${tourDate} është konfirmuar!`,
  });

  return {
    subject: `Rezervimi u Konfirmua - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
