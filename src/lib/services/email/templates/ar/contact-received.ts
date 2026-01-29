import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>رسالة اتصال جديدة</h1>
    <p>لقد تلقيت رسالة جديدة عبر نموذج الاتصال.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">تفاصيل الرسالة</h2>
      <p><span class="info-label">الاسم</span><br><span class="info-value">${name}</span></p>
      <p><span class="info-label">البريد الإلكتروني</span><br><span class="info-value">${email}</span></p>
      <p><span class="info-label">الموضوع</span><br><span class="info-value">${subject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">الرسالة</span><br><span class="info-value">${message}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${email}" class="button">الرد عبر البريد</a></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: `رسالة اتصال جديدة من ${name}: ${subject}` });
  return { subject: `[اتصال] ${subject} - من ${name}`, html, text: htmlToText(html) };
}
