import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>Новое сообщение</h1>
    <p>Вы получили новое сообщение через форму обратной связи.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Детали сообщения</h2>
      <p><span class="info-label">Имя</span><br><span class="info-value">${name}</span></p>
      <p><span class="info-label">Email</span><br><span class="info-value">${email}</span></p>
      <p><span class="info-label">Тема</span><br><span class="info-value">${subject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Сообщение</span><br><span class="info-value">${message}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${email}" class="button">Ответить по email</a></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: `Новое сообщение от ${name}: ${subject}` });
  return { subject: `[Контакт] ${subject} - от ${name}`, html, text: htmlToText(html) };
}
