import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>New Contact Form Submission</h1>
    <p>A new message has been received through the contact form:</p>

    <div class="info-box">
      <p>
        <span class="info-label">From</span><br>
        <span class="info-value">${name}</span>
      </p>
      <p>
        <span class="info-label">Email</span><br>
        <span class="info-value"><a href="mailto:${email}">${email}</a></span>
      </p>
      <p>
        <span class="info-label">Subject</span><br>
        <span class="info-value">${subject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Message</span><br>
        <span class="info-value">${message.replace(/\n/g, '<br>')}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="button">Reply to ${name}</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `New contact from ${name}: ${subject}`,
  });

  return {
    subject: `Contact Form: ${subject}`,
    html,
    text: htmlToText(html),
  };
}
