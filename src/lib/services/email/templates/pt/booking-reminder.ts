import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const { customerName, tourName, tourDate, daysUntil, meetingPoint, contactPhone } = data;

  const content = `
    <h1>Seu Passeio se Aproxima!</h1>
    <p>Prezado(a) ${customerName},</p>
    <p>Só um lembrete amigável de que seu passeio é em <strong>${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}</strong>!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalhes do Passeio</h2>
      <p>
        <span class="info-label">Passeio</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">Data</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      ${meetingPoint ? `
      <p>
        <span class="info-label">Ponto de Encontro</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>Checklist Rápida</h2>
    <ul>
      <li>Confirme a data e horário</li>
      <li>Prepare roupas e calçados confortáveis</li>
      <li>Traga proteção solar e água</li>
      <li>Tenha seu ID/passaporte em mãos</li>
      <li>Salve este e-mail ou imprima sua confirmação</li>
    </ul>

    ${contactPhone ? `
    <p>Dúvidas de última hora? Ligue para <strong>${contactPhone}</strong></p>
    ` : ''}

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">Ver Detalhes da Reserva</a>
    </p>

    <p>Mal podemos esperar para vê-lo!</p>
    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Seu passeio ${tourName} é em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}!`,
  });

  return {
    subject: `Lembrete: ${tourName} em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}`,
    html,
    text: htmlToText(html),
  };
}
