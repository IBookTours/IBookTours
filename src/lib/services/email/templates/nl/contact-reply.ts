import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>Reactie van IBookTours</h1>
    <p>Beste ${customerName},</p>
    <p>Bedankt dat je contact met ons hebt opgenomen. Hieronder vind je onze reactie op je vraag:</p>

    <div class="info-box">
      <p><span class="info-label">Je vraag</span><br><span class="info-value">${originalSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Onze reactie</span><br><span class="info-value">${replyMessage}</span></p>
    </div>

    <p>Als je nog vragen hebt, reageer gerust op deze e-mail of bezoek ons helpcentrum.</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/help" class="button">Bezoek Helpcentrum</a></p>
    <p>Met vriendelijke groet,</p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: `Reactie van IBookTours over: ${originalSubject}` });
  return { subject: `Re: ${originalSubject}`, html, text: htmlToText(html) };
}
