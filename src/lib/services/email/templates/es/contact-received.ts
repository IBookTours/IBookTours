import { baseTemplate, htmlToText, escapeHtml, escapeHtmlWithLineBreaks } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  // SECURITY: Escape all user-provided content to prevent XSS
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtmlWithLineBreaks(message);

  const content = `
    <h1>Nuevo Mensaje de Contacto</h1>
    <p>Has recibido un nuevo mensaje a través del formulario de contacto.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalles del Mensaje</h2>
      <p><span class="info-label">Nombre</span><br><span class="info-value">${safeName}</span></p>
      <p><span class="info-label">Correo</span><br><span class="info-value">${safeEmail}</span></p>
      <p><span class="info-label">Asunto</span><br><span class="info-value">${safeSubject}</span></p>
      <div class="divider"></div>
      <p><span class="info-label">Mensaje</span><br><span class="info-value">${safeMessage}</span></p>
    </div>

    <p style="text-align: center;"><a href="mailto:${safeEmail}" class="button">Responder por Correo</a></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: `Nuevo mensaje de contacto de ${safeName}: ${safeSubject}` });
  return { subject: `[Contacto] ${safeSubject} - de ${safeName}`, html, text: htmlToText(html) };
}
