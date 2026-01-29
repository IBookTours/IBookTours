import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>Mesazh i Ri Kontakti</h1>
    <p>Keni marrë një mesazh të ri nga formulari i kontaktit.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detajet e Mesazhit</h2>
      <p>
        <span class="info-label">Emri</span><br>
        <span class="info-value">${name}</span>
      </p>
      <p>
        <span class="info-label">Email</span><br>
        <span class="info-value">${email}</span>
      </p>
      <p>
        <span class="info-label">Subjekti</span><br>
        <span class="info-value">${subject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Mesazhi</span><br>
        <span class="info-value">${message}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${email}" class="button">Përgjigju me Email</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Mesazh i ri kontakti nga ${name}: ${subject}`,
  });

  return {
    subject: `[Kontakt] ${subject} - nga ${name}`,
    html,
    text: htmlToText(html),
  };
}
