import { baseTemplate, htmlToText } from '../base';
import { WelcomeData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeData): RenderedEmail {
  const { customerName } = data;

  const content = `
    <h1>¡Bienvenido a IBookTours!</h1>
    <p>Estimado/a ${customerName},</p>
    <p>¡Gracias por unirte a IBookTours! Estamos encantados de tenerte como parte de nuestra comunidad de viajeros.</p>
    <p>Albania te espera con sus impresionantes paisajes, rica historia y cálida hospitalidad. Ya sea una escapada relajante a la playa o una aventura en las montañas, tenemos el viaje perfecto para ti.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">¿Qué Sigue?</h2>
      <p><strong>1. Explora los Tours</strong> - Descubre nuestros tours de un día y paquetes vacacionales</p>
      <p><strong>2. Reserva Tu Aventura</strong> - Asegura tu lugar con reserva online fácil</p>
      <p><strong>3. Viaja con Confianza</strong> - Disfruta de guías expertos y conocimiento local</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Explorar Tours</a>
    </p>

    <p>Si tienes alguna pregunta, nuestro equipo siempre está aquí para ayudar.</p>
    <p>¡Felices viajes!</p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'es',
    content,
    previewText: `¡Bienvenido a IBookTours, ${customerName}! Comienza a explorar los mejores tours de Albania.`,
  });

  return {
    subject: `¡Bienvenido a IBookTours, ${customerName}!`,
    html,
    text: htmlToText(html),
  };
}
