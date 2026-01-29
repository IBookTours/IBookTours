import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>Wachtwoord resetten</h1>
    <p>Beste ${customerName},</p>
    <p>We hebben een verzoek ontvangen om je wachtwoord te resetten. Klik op de onderstaande knop om een nieuw wachtwoord aan te maken.</p>

    <p style="text-align: center;"><a href="${resetLink}" class="button">Wachtwoord resetten</a></p>

    <div class="info-box">
      <p><strong>Belangrijk:</strong></p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Deze link verloopt over ${expiresIn}</li>
        <li>Als je dit niet hebt aangevraagd, negeer dan deze e-mail</li>
        <li>Je huidige wachtwoord blijft ongewijzigd totdat je een nieuw wachtwoord aanmaakt</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #6b7280;">Als de knop niet werkt, kopieer en plak deze link in je browser:<br><a href="${resetLink}" style="word-break: break-all;">${resetLink}</a></p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: 'Verzoek om wachtwoord te resetten voor je IBookTours account.' });
  return { subject: 'Wachtwoord resetten - IBookTours', html, text: htmlToText(html) };
}
