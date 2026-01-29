import { baseTemplate, htmlToText } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const {
    customerName,
    bookingId,
    tourName,
    tourDate,
    travelers,
    totalAmount,
    meetingPoint,
    contactPhone,
  } = data;

  const content = `
    <h1>Reserva Confirmada!</h1>
    <p>Prezado(a) ${customerName},</p>
    <p>Ótimas notícias! Sua reserva foi confirmada. Mal podemos esperar para mostrar a beleza da Albânia!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalhes da Reserva</h2>
      <p>
        <span class="info-label">ID da Reserva</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">Passeio</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">Data</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      <p>
        <span class="info-label">Número de Viajantes</span><br>
        <span class="info-value">${travelers} ${travelers === 1 ? 'pessoa' : 'pessoas'}</span>
      </p>
      <p>
        <span class="info-label">Valor Total</span><br>
        <span class="info-value" style="font-size: 20px; color: #e63946;">${totalAmount}</span>
      </p>
      ${meetingPoint ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">Ponto de Encontro</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>O Que Levar</h2>
    <ul>
      <li>Sapatos confortáveis para caminhada</li>
      <li>Proteção solar (chapéu, protetor solar)</li>
      <li>Câmera para fotos incríveis</li>
      <li>Documento de identidade ou passaporte válido</li>
      <li>Este e-mail de confirmação (impresso ou no celular)</li>
    </ul>

    ${contactPhone ? `
    <p>Precisa nos contatar no dia do passeio? Ligue para <strong>${contactPhone}</strong></p>
    ` : ''}

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">Ver Minhas Reservas</a>
    </p>

    <p>Se tiver alguma dúvida antes do passeio, não hesite em nos contatar.</p>
    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Sua reserva para ${tourName} em ${tourDate} está confirmada!`,
  });

  return {
    subject: `Reserva Confirmada - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
