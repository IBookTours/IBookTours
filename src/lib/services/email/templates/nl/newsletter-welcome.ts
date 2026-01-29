import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>Welkom bij onze nieuwsbrief!</h1>
    <p>Hallo!</p>
    <p>Bedankt voor je aanmelding voor de IBookTours nieuwsbrief! Je maakt nu deel uit van onze gemeenschap van avontuurlijke reizigers.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Wat je ontvangt</h2>
      <p><strong>Exclusieve aanbiedingen</strong> - Als eerste op de hoogte van speciale deals</p>
      <p><strong>Reisinspiratie</strong> - Ontdek verborgen parels in Albanië</p>
      <p><strong>Reistips</strong> - Deskundig advies voor je avontuur</p>
      <p><strong>Nieuwe tours</strong> - Vroege toegang tot onze nieuwste tours</p>
    </div>

    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">Begin met ontdekken</a></p>
    <p style="font-size: 14px; color: #6b7280;">Je bent aangemeld met: ${email}<br>Je kunt je op elk moment afmelden via de link in onze e-mails.</p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: 'Welkom bij de IBookTours nieuwsbrief! Exclusieve aanbiedingen en reistips wachten op je.' });
  return { subject: 'Welkom bij de IBookTours nieuwsbrief!', html, text: htmlToText(html) };
}
