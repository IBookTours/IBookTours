import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>Nieuw contactbericht</h1>
    <p>Je hebt een nieuw bericht ontvangen via het contactformulier.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Berichtdetails</h2>
      <p><span class="info-label">Naam</span><br><span class="info-value">${name}</span></p>
      <p><span class="info-label">E-mail</span><br><span class="info-value">${email}</span></p>
      <p><span class="info-label">Onderwerp</span><br><span class="info-value">${subject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Bericht</span><br><span class="info-value">${message}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${email}" class="button">Antwoord via e-mail</a></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: `Nieuw contactbericht van ${name}: ${subject}` });
  return { subject: `[Contact] ${subject} - van ${name}`, html, text: htmlToText(html) };
}
