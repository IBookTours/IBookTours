import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const { customerName, tourName, tourDate, daysUntil, meetingPoint, contactPhone } = data;

  const content = `
    <h1>Turi Juaj Po Afrohet!</h1>
    <p>I/E dashur ${customerName},</p>
    <p>Vetëm një kujtesë miqësore se turi juaj është për <strong>${daysUntil} ${daysUntil === 1 ? 'ditë' : 'ditë'}</strong>!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detajet e Turit</h2>
      <p>
        <span class="info-label">Turi</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">Data</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      ${meetingPoint ? `
      <p>
        <span class="info-label">Pika e Takimit</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>Lista e Shpejtë</h2>
    <ul>
      <li>Konfirmoni datën dhe orën</li>
      <li>Përgatitni veshje dhe këpucë komode</li>
      <li>Sillni mbrojtje nga dielli dhe ujë</li>
      <li>Mbani ID-në/pasaportën me vete</li>
      <li>Ruani këtë email ose printoni konfirmimin</li>
    </ul>

    ${contactPhone ? `
    <p>Pyetje të minutës së fundit? Na telefononi në <strong>${contactPhone}</strong></p>
    ` : ''}

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">Shikoni Detajet e Rezervimit</a>
    </p>

    <p>Mezi presim t'ju takojmë!</p>
    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Turi juaj ${tourName} është për ${daysUntil} ${daysUntil === 1 ? 'ditë' : 'ditë'}!`,
  });

  return {
    subject: `Kujtesë: ${tourName} për ${daysUntil} ${daysUntil === 1 ? 'ditë' : 'ditë'}`,
    html,
    text: htmlToText(html),
  };
}
