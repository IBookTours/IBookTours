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
    <h1>رسالة اتصال جديدة</h1>
    <p>لقد تلقيت رسالة جديدة عبر نموذج الاتصال.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">تفاصيل الرسالة</h2>
      <p><span class="info-label">الاسم</span><br><span class="info-value">${safeName}</span></p>
      <p><span class="info-label">البريد الإلكتروني</span><br><span class="info-value">${safeEmail}</span></p>
      <p><span class="info-label">الموضوع</span><br><span class="info-value">${safeSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">الرسالة</span><br><span class="info-value">${safeMessage}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${safeEmail}" class="button">الرد عبر البريد</a></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: `رسالة اتصال جديدة من ${safeName}: ${safeSubject}` });
  return { subject: `[اتصال] ${safeSubject} - من ${safeName}`, html, text: htmlToText(html) };
}
