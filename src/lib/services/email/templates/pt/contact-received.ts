import { baseTemplate, htmlToText } from '../base';
import { ContactReceivedData, RenderedEmail } from '../types';

export function contactReceivedTemplate(data: ContactReceivedData): RenderedEmail {
  const { name, email, subject, message } = data;

  const content = `
    <h1>Nova Mensagem de Contato</h1>
    <p>Você recebeu uma nova mensagem através do formulário de contato.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Detalhes da Mensagem</h2>
      <p>
        <span class="info-label">Nome</span><br>
        <span class="info-value">${name}</span>
      </p>
      <p>
        <span class="info-label">E-mail</span><br>
        <span class="info-value">${email}</span>
      </p>
      <p>
        <span class="info-label">Assunto</span><br>
        <span class="info-value">${subject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Mensagem</span><br>
        <span class="info-value">${message}</span>
      </p>
    </div>

    <p style="text-align: center;">
      <a href="mailto:${email}" class="button">Responder por E-mail</a>
    </p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Nova mensagem de contato de ${name}: ${subject}`,
  });

  return {
    subject: `[Contato] ${subject} - de ${name}`,
    html,
    text: htmlToText(html),
  };
}
