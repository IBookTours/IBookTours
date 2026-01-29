import { baseTemplate, htmlToText } from '../base';
import { WelcomeData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeData): RenderedEmail {
  const { customerName } = data;

  const content = `
    <h1>Mirësevini në IBookTours!</h1>
    <p>I/E dashur ${customerName},</p>
    <p>Faleminderit që u bashkuat me IBookTours! Jemi të lumtur t'ju kemi si pjesë të komunitetit tonë të udhëtarëve.</p>
    <p>Shqipëria ju pret me peizazhet e saj mahnitëse, historinë e pasur dhe mikpritjen e ngrohtë. Qoftë një pushim relaksues në plazh ose një aventurë malesh, kemi udhëtimin perfekt për ju.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Çfarë Vjen Më Pas?</h2>
      <p><strong>1. Shfletoni Turnet</strong> - Eksploroni turnet tona ditore dhe paketat e pushimeve</p>
      <p><strong>2. Rezervoni Aventurën Tuaj</strong> - Siguroni vendin tuaj me rezervim të lehtë online</p>
      <p><strong>3. Udhëtoni me Besim</strong> - Gëzoni guida eksperte dhe njohuri lokale</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Eksploroni Turnet</a>
    </p>

    <p>Nëse keni pyetje, ekipi ynë është gjithmonë këtu për t'ju ndihmuar.</p>
    <p>Udhëtime të mira!</p>
    <p><strong>Ekipi IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'sq',
    content,
    previewText: `Mirësevini në IBookTours, ${customerName}! Filloni të eksploroni turnet më të mira të Shqipërisë.`,
  });

  return {
    subject: `Mirësevini në IBookTours, ${customerName}!`,
    html,
    text: htmlToText(html),
  };
}
