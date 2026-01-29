import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>Përgjigje nga IBookTours</h1>
    <p>I/E dashur ${customerName},</p>
    <p>Faleminderit që na kontaktuat. Ja përgjigja jonë për pyetjen tuaj:</p>

    <div class="info-box">
      <p>
        <span class="info-label">Pyetja Juaj</span><br>
        <span class="info-value">${originalSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Përgjigja Jonë</span><br>
        <span class="info-value">${replyMessage}</span>
      </p>
    </div>

    <p>Nëse keni pyetje të tjera, mos hezitoni të na përgjigjeni ose të vizitoni Qendrën tonë të Ndihmës.</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/help" class="button">Vizitoni Qendrën e Ndihmës</a>
    </p>

    <p>Me respekt,</p>
    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Përgjigje nga IBookTours rreth: ${originalSubject}`,
  });

  return {
    subject: `Re: ${originalSubject}`,
    html,
    text: htmlToText(html),
  };
}
