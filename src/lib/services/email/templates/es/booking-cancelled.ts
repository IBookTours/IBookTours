import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>Reserva Cancelada</h1>
    <p>Estimado/a ${customerName},</p>
    <p>Tu reserva ha sido cancelada según lo solicitado.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalles de la Cancelación</h2>
      <p><span class="info-label">ID de Reserva</span><br><span class="info-value">${bookingId}</span></p>
      <p><span class="info-label">Tour</span><br><span class="info-value">${tourName}</span></p>
      ${refundAmount ? `<div class="divider"></div><p><span class="info-label">Monto del Reembolso</span><br><span class="info-value" style="font-size: 20px; color: #22c55e;">${refundAmount}</span></p><p style="font-size: 14px; color: #6b7280;">El reembolso se procesará en 5-10 días hábiles al método de pago original.</p>` : ''}
    </div>

    <p>Lamentamos que no puedas unirte a nosotros esta vez. ¡Esperamos verte en una aventura futura!</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">Explorar Otros Tours</a></p>
    <p>Si tienes preguntas sobre tu cancelación o reembolso, contáctanos.</p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: `Tu reserva para ${tourName} ha sido cancelada.` });
  return { subject: `Reserva Cancelada - ${tourName}`, html, text: htmlToText(html) };
}
