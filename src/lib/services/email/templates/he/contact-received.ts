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
    <h1>הודעה חדשה מטופס יצירת קשר</h1>
    <p>התקבלה הודעה חדשה דרך טופס יצירת הקשר:</p>

    <div class="info-box">
      <p>
        <span class="info-label">מאת</span><br>
        <span class="info-value">${safeName}</span>
      </p>
      <p>
        <span class="info-label">אימייל</span><br>
        <span class="info-value"><a href="mailto:${safeEmail}">${safeEmail}</a></span>
      </p>
      <p>
        <span class="info-label">נושא</span><br>
        <span class="info-value">${safeSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">הודעה</span><br>
        <span class="info-value">${safeMessage}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}" class="button">השב ל-${safeName}</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'he',
    content,
    previewText: `הודעה חדשה מ-${safeName}: ${safeSubject}`,
  });

  return {
    subject: `טופס יצירת קשר: ${subject}`,
    html,
    text: htmlToText(html),
  };
}
