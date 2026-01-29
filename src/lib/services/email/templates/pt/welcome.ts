import { baseTemplate, htmlToText } from '../base';
import { WelcomeData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeData): RenderedEmail {
  const { customerName } = data;

  const content = `
    <h1>Bem-vindo ao IBookTours!</h1>
    <p>Prezado(a) ${customerName},</p>
    <p>Obrigado por se juntar ao IBookTours! Estamos muito felizes em tê-lo como parte da nossa comunidade de viajantes.</p>
    <p>A Albânia espera por você com suas paisagens deslumbrantes, história rica e hospitalidade calorosa. Seja uma escapada relaxante na praia ou uma aventura nas montanhas, temos a viagem perfeita para você.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Próximos Passos</h2>
      <p><strong>1. Explore os Passeios</strong> - Descubra nossos passeios de um dia e pacotes de férias selecionados</p>
      <p><strong>2. Reserve Sua Aventura</strong> - Garanta sua vaga com reserva online fácil</p>
      <p><strong>3. Viaje com Confiança</strong> - Aproveite guias especializados e conhecimento local</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Explorar Passeios</a>
    </p>

    <p>Se tiver alguma dúvida, nossa equipe está sempre aqui para ajudar.</p>
    <p>Boas viagens!</p>
    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: `Bem-vindo ao IBookTours, ${customerName}! Comece a explorar os melhores passeios da Albânia.`,
  });

  return {
    subject: `Bem-vindo ao IBookTours, ${customerName}!`,
    html,
    text: htmlToText(html),
  };
}
