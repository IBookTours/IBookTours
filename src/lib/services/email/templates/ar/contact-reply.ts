import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>رد من IBookTours</h1>
    <p>عزيزي/عزيزتي ${customerName}،</p>
    <p>شكراً لتواصلك معنا. إليك ردنا على استفسارك:</p>

    <div class="info-box">
      <p><span class="info-label">استفسارك</span><br><span class="info-value">${originalSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">ردنا</span><br><span class="info-value">${replyMessage}</span></p>
    </div>

    <p>إذا كان لديك المزيد من الأسئلة، لا تتردد في الرد على هذا البريد أو زيارة مركز المساعدة.</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/help" class="button">زيارة مركز المساعدة</a></p>
    <p>مع أطيب التحيات،</p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: `رد من IBookTours حول: ${originalSubject}` });
  return { subject: `رد: ${originalSubject}`, html, text: htmlToText(html) };
}
