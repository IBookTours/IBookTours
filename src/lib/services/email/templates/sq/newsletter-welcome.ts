import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>Mirësevini në Buletinin Tonë!</h1>
    <p>Përshëndetje!</p>
    <p>Faleminderit që u abonuat në buletinin e IBookTours! Tani jeni pjesë e komunitetit tonë të udhëtarëve aventurierë.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Çfarë Do të Merrni</h2>
      <p><strong>Oferta Ekskluzive</strong> - Jini të parët që mësoni për promovime speciale</p>
      <p><strong>Frymëzim Udhëtimi</strong> - Zbuloni xhevahirë të fshehura në Shqipëri</p>
      <p><strong>Këshilla Udhëtimi</strong> - Këshilla eksperte për aventurën tuaj</p>
      <p><strong>Turne të Reja</strong> - Akses i hershëm në turnet tona të fundit</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Filloni të Eksploroni</a>
    </p>

    <p style="font-size: 14px; color: #6b7280;">
      U abonuat me: ${email}<br>
      Mund të çabonoheni në çdo kohë duke klikuar linkun e çabonimit në emailet tona.
    </p>

    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: 'Mirësevini në Buletinin e IBookTours! Oferta ekskluzive dhe këshilla udhëtimi ju presin.',
  });

  return {
    subject: 'Mirësevini në Buletinin e IBookTours!',
    html,
    text: htmlToText(html),
  };
}
