import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>Bem-vindo à Nossa Newsletter!</h1>
    <p>Olá!</p>
    <p>Obrigado por se inscrever na newsletter da IBookTours! Você agora faz parte da nossa comunidade de viajantes aventureiros.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">O Que Você Receberá</h2>
      <p><strong>Ofertas Exclusivas</strong> - Seja o primeiro a saber sobre promoções especiais</p>
      <p><strong>Inspiração para Viagens</strong> - Descubra joias escondidas na Albânia</p>
      <p><strong>Dicas de Viagem</strong> - Conselhos de especialistas para sua aventura</p>
      <p><strong>Novos Passeios</strong> - Acesso antecipado aos nossos últimos passeios</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Comece a Explorar</a>
    </p>

    <p style="font-size: 14px; color: #6b7280;">
      Você se inscreveu com: ${email}<br>
      Você pode cancelar a inscrição a qualquer momento clicando no link de cancelamento em nossos e-mails.
    </p>

    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: 'Bem-vindo à Newsletter da IBookTours! Ofertas exclusivas e dicas de viagem esperam por você.',
  });

  return {
    subject: 'Bem-vindo à Newsletter da IBookTours!',
    html,
    text: htmlToText(html),
  };
}
