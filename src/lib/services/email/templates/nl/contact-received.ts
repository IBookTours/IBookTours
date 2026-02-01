import { baseTemplate, htmlToText, escapeHtml, escapeHtmlWithLineBreaks } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  // SECURITY: Escape all user-provided content to prevent XSS
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtmlWithLineBreaks(message);

  const content = `
    <h1>Nieuw contactbericht</h1>
    <p>Je hebt een nieuw bericht ontvangen via het contactformulier.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Berichtdetails</h2>
      <p><span class="info-label">Naam</span><br><span class="info-value">${safeName}</span></p>
      <p><span class="info-label">E-mail</span><br><span class="info-value">${safeEmail}</span></p>
      <p><span class="info-label">Onderwerp</span><br><span class="info-value">${safeSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Bericht</span><br><span class="info-value">${safeMessage}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${safeEmail}" class="button">Antwoord via e-mail</a></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: `Nieuw contactbericht van ${safeName}: ${safeSubject}` });
  return { subject: `[Contact] ${safeSubject} - van ${safeName}`, html, text: htmlToText(html) };
}
