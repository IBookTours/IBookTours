import { baseTemplate, htmlToText } from '../base';
import { ContactReplyData, RenderedEmail } from '../types';

export function contactReplyTemplate(data: ContactReplyData): RenderedEmail {
  const { customerName, originalSubject, replyMessage } = data;

  const content = `
    <h1>Resposta da IBookTours</h1>
    <p>Prezado(a) ${customerName},</p>
    <p>Obrigado por entrar em contato conosco. Aqui está nossa resposta à sua consulta:</p>

    <div class="info-box">
      <p>
        <span class="info-label">Sua Consulta</span><br>
        <span class="info-value">${originalSubject}</span>
      </p>
      <div class="divider"></div>
      <p>
        <span class="info-label">Nossa Resposta</span><br>
        <span class="info-value">${replyMessage}</span>
      </p>
    </div>

    <p>Se tiver mais perguntas, sinta-se à vontade para responder a este e-mail ou visitar nossa Central de Ajuda.</p>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/help" class="button">Visitar Central de Ajuda</a>
    </p>

    <p>Atenciosamente,</p>
    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Resposta da IBookTours sobre: ${originalSubject}`,
  });

  return {
    subject: `Re: ${originalSubject}`,
    html,
    text: htmlToText(html),
  };
}
