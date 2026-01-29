import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const { customerName, bookingId, tourName, tourDate, travelers, totalAmount, meetingPoint, contactPhone } = data;

  const content = `
    <h1>¡Reserva Confirmada!</h1>
    <p>Estimado/a ${customerName},</p>
    <p>¡Excelentes noticias! Tu reserva ha sido confirmada. ¡No podemos esperar para mostrarte la belleza de Albania!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalles de la Reserva</h2>
      <p><span class="info-label">ID de Reserva</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">Tour</span><br><span class="info-value">${tourName}</span></p>
      <p><span class="info-label">Fecha</span><br><span class="info-value">${tourDate}</span></p>
      <p><span class="info-label">Número de Viajeros</span><br><span class="info-value">${travelers} ${travelers === 1 ? 'persona' : 'personas'}</span></p>
      <p><span class="info-label">Monto Total</span><br><span class="info-value" style="font-size: 20px; color: #e63946;">${totalAmount}</span></p>
      ${meetingPoint ? `<div class="divider"></div><p><span class="info-label">Punto de Encuentro</span><br><span class="info-value">${meetingPoint}</span></p>` : ''}
    </div>

    <h2>Qué Traer</h2>
    <ul>
      <li>Zapatos cómodos para caminar</li>
      <li>Protección solar (gorra, protector solar)</li>
      <li>Cámara para fotos increíbles</li>
      <li>Documento de identidad o pasaporte válido</li>
      <li>Este correo de confirmación (impreso o en tu teléfono)</li>
    </ul>

    ${contactPhone ? `<p>¿Necesitas contactarnos el día del tour? Llámanos al <strong>${contactPhone}</strong></p>` : ''}

    <p style="text-align: center;"><a href="https://ibooktours.com/profile" class="button">Ver Mis Reservas</a></p>
    <p>Si tienes alguna pregunta antes del tour, no dudes en contactarnos.</p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: `¡Tu reserva para ${tourName} el ${tourDate} está confirmada!` });
  return { subject: `Reserva Confirmada - ${tourName}`, html, text: htmlToText(html) };
}
