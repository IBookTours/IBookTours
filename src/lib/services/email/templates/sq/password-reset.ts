import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>Rivendosja e Fjalëkalimit</h1>
    <p>I/E dashur ${customerName},</p>
    <p>Kemi marrë një kërkesë për të rivendosur fjalëkalimin tuaj. Klikoni butonin më poshtë për të krijuar një fjalëkalim të ri.</p>

    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Rivendos Fjalëkalimin</a>
    </p>

    <div class="info-box">
      <p><strong>E Rëndësishme:</strong></p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Ky link skadon për ${expiresIn}</li>
        <li>Nëse nuk e kërkuat këtë, injoroni këtë email</li>
        <li>Fjalëkalimi juaj do të mbetet i pandryshuar derisa të krijoni një të ri</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #6b7280;">
      Nëse butoni nuk funksionon, kopjoni dhe ngjitni këtë link në shfletuesin tuaj:<br>
      <a href="${resetLink}" style="word-break: break-all;">${resetLink}</a>
    </p>

    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: 'Kërkesë për rivendosjen e fjalëkalimit për llogarinë tuaj IBookTours.',
  });

  return {
    subject: 'Rivendosni Fjalëkalimin Tuaj - IBookTours',
    html,
    text: htmlToText(html),
  };
}
