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
    <h1>Mesazh i Ri Kontakti</h1>
    <p>Keni marrë një mesazh të ri nga formulari i kontaktit.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detajet e Mesazhit</h2>
      <p>
        <span class="info-label">Emri</span><br>
        <span class="info-value">${safeName}</span>
      </p>
      <p>
        <span class="info-label">Email</span><br>
        <span class="info-value">${safeEmail}</span>
      </p>
      <p>
        <span class="info-label">Subjekti</span><br>
        <span class="info-value">${safeSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Mesazhi</span><br>
        <span class="info-value">${safeMessage}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${safeEmail}" class="button">Përgjigju me Email</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Mesazh i ri kontakti nga ${safeName}: ${safeSubject}`,
  });

  return {
    subject: `[Kontakt] ${safeSubject} - nga ${safeName}`,
    html,
    text: htmlToText(html),
  };
}
