import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>הודעה חדשה מטופס יצירת קשר</h1>
    <p>התקבלה הודעה חדשה דרך טופס יצירת הקשר:</p>

    <div class="info-box">
      <p>
        <span class="info-label">מאת</span><br>
        <span class="info-value">${name}</span>
      </p>
      <p>
        <span class="info-label">אימייל</span><br>
        <span class="info-value"><a href="mailto:${email}">${email}</a></span>
      </p>
      <p>
        <span class="info-label">נושא</span><br>
        <span class="info-value">${subject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">הודעה</span><br>
        <span class="info-value">${message.replace(/\n/g, '<br>')}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="button">השב ל-${name}</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `הודעה חדשה מ-${name}: ${subject}`,
  });

  return {
    subject: `טופס יצירת קשר: ${subject}`,
    html,
    text: htmlToText(html),
  };
}
