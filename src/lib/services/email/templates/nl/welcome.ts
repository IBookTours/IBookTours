import { baseTemplate, htmlToText } from '../base';
import { WelcomeEmailData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeEmailData): RenderedEmail {
  const { customerName, loginLink } = data;

  const content = `
    <h1>Welkom bij IBookTours!</h1>
    <p>Beste ${customerName},</p>
    <p>Bedankt voor je registratie bij IBookTours! We zijn blij je te verwelkomen in onze gemeenschap van reizigers.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Wat je kunt verwachten</h2>
      <p><strong>Exclusieve aanbiedingen</strong> - Toegang tot speciale kortingen en promoties</p>
      <p><strong>Persoonlijke aanbevelingen</strong> - Tours afgestemd op jouw voorkeuren</p>
      <p><strong>Eenvoudig boeken</strong> - Je reisgeschiedenis altijd binnen handbereik</p>
      <p><strong>Prioriteit ondersteuning</strong> - Ons team staat altijd klaar om te helpen</p>
    </div>

    <p style="text-align: center;"><a href="${loginLink}" class="button">Naar je account</a></p>
    <p>Begin vandaag nog met het verkennen van onze tours en vind je perfecte avontuur!</p>
    <p><strong>Het IBookTours Team</strong></p>
  `;

  const html = baseTemplate({ language: 'nl', content, previewText: 'Welkom bij IBookTours! Je account is succesvol aangemaakt.' });
  return { subject: 'Welkom bij IBookTours!', html, text: htmlToText(html) };
}
