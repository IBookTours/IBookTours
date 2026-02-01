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
    <h1>Новое сообщение</h1>
    <p>Вы получили новое сообщение через форму обратной связи.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Детали сообщения</h2>
      <p><span class="info-label">Имя</span><br><span class="info-value">${safeName}</span></p>
      <p><span class="info-label">Email</span><br><span class="info-value">${safeEmail}</span></p>
      <p><span class="info-label">Тема</span><br><span class="info-value">${safeSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Сообщение</span><br><span class="info-value">${safeMessage}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${safeEmail}" class="button">Ответить по email</a></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: `Новое сообщение от ${safeName}: ${safeSubject}` });
  return { subject: `[Контакт] ${safeSubject} - от ${safeName}`, html, text: htmlToText(html) };
}
