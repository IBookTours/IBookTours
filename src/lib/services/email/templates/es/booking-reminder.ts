import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const { customerName, tourName, tourDate, daysUntil, meetingPoint, contactPhone } = data;

  const content = `
    <h1>¡Tu Tour se Acerca!</h1>
    <p>Estimado/a ${customerName},</p>
    <p>Solo un recordatorio amistoso de que tu tour es en <strong>${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}</strong>.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalles del Tour</h2>
      <p><span class="info-label">Tour</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">Fecha</span><br><span class="info-value">${tourDate}</span></p>
      ${meetingPoint ? `<p><span class="info-label">Punto de Encuentro</span><br><span class="info-value">${meetingPoint}</span></p>` : ''}
    </div>

    <h2>Lista Rápida</h2>
    <ul>
      <li>Confirma la fecha y hora</li>
      <li>Prepara ropa y calzado cómodos</li>
      <li>Trae protección solar y agua</li>
      <li>Ten tu ID/pasaporte a mano</li>
      <li>Guarda este correo o imprime tu confirmación</li>
    </ul>

    ${contactPhone ? `<p>¿Preguntas de última hora? Llámanos al <strong>${contactPhone}</strong></p>` : ''}

    <p style="text-align: center;"><a href="https://ibooktours.com/profile" class="button">Ver Detalles de la Reserva</a></p>
    <p>¡No podemos esperar para verte!</p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: `Tu tour ${tourName} es en ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}!` });
  return { subject: `Recordatorio: ${tourName} en ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'}`, html, text: htmlToText(html) };
}
