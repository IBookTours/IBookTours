import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>Reserva Cancelada</h1>
    <p>Prezado(a) ${customerName},</p>
    <p>Sua reserva foi cancelada conforme solicitado.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalhes do Cancelamento</h2>
      <p>
        <span class="info-label">ID da Reserva</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">Passeio</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      ${refundAmount ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">Valor do Reembolso</span><br>
        <span class="info-value" style="font-size: 20px; color: #22c55e;">${refundAmount}</span>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        O reembolso será processado em 5-10 dias úteis para o método de pagamento original.
      </p>
      ` : ''}
    </div>

    <p>Lamentamos que você não possa se juntar a nós desta vez. Esperamos vê-lo em uma aventura futura!</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Explorar Outros Passeios</a>
    </p>

    <p>Se tiver alguma dúvida sobre seu cancelamento ou reembolso, entre em contato conosco.</p>
    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Sua reserva para ${tourName} foi cancelada.`,
  });

  return {
    subject: `Reserva Cancelada - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
