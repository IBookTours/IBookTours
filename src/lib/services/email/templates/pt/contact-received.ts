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
    <h1>Nova Mensagem de Contato</h1>
    <p>Você recebeu uma nova mensagem através do formulário de contato.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalhes da Mensagem</h2>
      <p>
        <span class="info-label">Nome</span><br>
        <span class="info-value">${safeName}</span>
      </p>
      <p>
        <span class="info-label">E-mail</span><br>
        <span class="info-value">${safeEmail}</span>
      </p>
      <p>
        <span class="info-label">Assunto</span><br>
        <span class="info-value">${safeSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Mensagem</span><br>
        <span class="info-value">${safeMessage}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${safeEmail}" class="button">Responder por E-mail</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Nova mensagem de contato de ${safeName}: ${safeSubject}`,
  });

  return {
    subject: `[Contato] ${safeSubject} - de ${safeName}`,
    html,
    text: htmlToText(html),
  };
}
