import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>We've Received Your Message</h1>
    <p>Dear ${customerName},</p>
    <p>Thank you for contacting IBookTours! We've received your message and wanted to follow up.</p>

    <div class="info-box">
      <p>
        <span class="info-label">Regarding</span><br>
        <span class="info-value">${originalSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Our Response</span><br>
        <span class="info-value">${replyMessage.replace(/\n/g, '<br>')}</span>
      </p>
    </div>

    <p>If you have any more questions, feel free to reply to this email or visit our Help Center.</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/help" class="button">Visit Help Center</a>
    </p>

    <p>Best regards,</p>
    <p><strong>The IBookTours Team</strong></p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `Response to your inquiry: ${originalSubject}`,
  });

  return {
    subject: `Re: ${originalSubject}`,
    html,
    text: htmlToText(html),
  };
}
