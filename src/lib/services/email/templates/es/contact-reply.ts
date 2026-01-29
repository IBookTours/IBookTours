import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>Respuesta de IBookTours</h1>
    <p>Estimado/a ${customerName},</p>
    <p>Gracias por contactarnos. Aquí está nuestra respuesta a tu consulta:</p>

    <div class="info-box">
      <p><span class="info-label">Tu Consulta</span><br><span class="info-value">${originalSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Nuestra Respuesta</span><br><span class="info-value">${replyMessage}</span></p>
    </div>

    <p>Si tienes más preguntas, no dudes en responder a este correo o visitar nuestro Centro de Ayuda.</p>
    <p style="text-align: center;"><a href="https://ibooktours.com/help" class="button">Visitar Centro de Ayuda</a></p>
    <p>Atentamente,</p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: `Respuesta de IBookTours sobre: ${originalSubject}` });
  return { subject: `Re: ${originalSubject}`, html, text: htmlToText(html) };
}
