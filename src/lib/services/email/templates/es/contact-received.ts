import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>Nuevo Mensaje de Contacto</h1>
    <p>Has recibido un nuevo mensaje a través del formulario de contacto.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalles del Mensaje</h2>
      <p><span class="info-label">Nombre</span><br><span class="info-value">${name}</span></p>
      <p><span class="info-label">Correo</span><br><span class="info-value">${email}</span></p>
      <p><span class="info-label">Asunto</span><br><span class="info-value">${subject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Mensaje</span><br><span class="info-value">${message}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${email}" class="button">Responder por Correo</a></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: `Nuevo mensaje de contacto de ${name}: ${subject}` });
  return { subject: `[Contacto] ${subject} - de ${name}`, html, text: htmlToText(html) };
}
