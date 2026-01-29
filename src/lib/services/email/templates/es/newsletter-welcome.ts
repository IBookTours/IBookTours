import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>¡Bienvenido a Nuestro Boletín!</h1>
    <p>¡Hola!</p>
    <p>¡Gracias por suscribirte al boletín de IBookTours! Ahora eres parte de nuestra comunidad de viajeros aventureros.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Lo Que Recibirás</h2>
      <p><strong>Ofertas Exclusivas</strong> - Sé el primero en conocer promociones especiales</p>
      <p><strong>Inspiración de Viaje</strong> - Descubre joyas ocultas en Albania</p>
      <p><strong>Consejos de Viaje</strong> - Consejos de expertos para tu aventura</p>
      <p><strong>Nuevos Tours</strong> - Acceso anticipado a nuestros últimos tours</p>
    </div>

    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">Comenzar a Explorar</a></p>
    <p style="font-size: 14px; color: #6b7280;">Te suscribiste con: ${email}<br>Puedes darte de baja en cualquier momento haciendo clic en el enlace de cancelación en nuestros correos.</p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: '¡Bienvenido al Boletín de IBookTours! Ofertas exclusivas y consejos de viaje te esperan.' });
  return { subject: '¡Bienvenido al Boletín de IBookTours!', html, text: htmlToText(html) };
}
