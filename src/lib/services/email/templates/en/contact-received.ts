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
    <h1>New Contact Form Submission</h1>
    <p>A new message has been received through the contact form:</p>

    <div class="info-box">
      <p>
        <span class="info-label">From</span><br>
        <span class="info-value">${safeName}</span>
      </p>
      <p>
        <span class="info-label">Email</span><br>
        <span class="info-value"><a href="mailto:${safeEmail}">${safeEmail}</a></span>
      </p>
      <p>
        <span class="info-label">Subject</span><br>
        <span class="info-value">${safeSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Message</span><br>
        <span class="info-value">${safeMessage}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(subject)}" class="button">Reply to ${safeName}</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `New contact from ${safeName}: ${safeSubject}`,
  });

  return {
    subject: `Contact Form: ${subject}`,
    html,
    text: htmlToText(html),
  };
}
