import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>Ответ от IBookTours</h1>
    <p>Уважаемый(ая) ${customerName},</p>
    <p>Благодарим вас за обращение. Ниже представлен наш ответ на ваш запрос:</p>

    <div class="info-box">
      <p><span class="info-label">Ваш запрос</span><br><span class="info-value">${originalSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Наш ответ</span><br><span class="info-value">${replyMessage}</span></p>
    </div>

    <p>Если у вас есть дополнительные вопросы, ответьте на это письмо или посетите наш центр помощи.</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/help" class="button">Центр помощи</a></p>
    <p>С уважением,</p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: `Ответ от IBookTours по теме: ${originalSubject}` });
  return { subject: `Ответ: ${originalSubject}`, html, text: htmlToText(html) };
}
