import { baseTemplate, htmlToText } from '../base';
import { WelcomeEmailData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeEmailData): RenderedEmail {
  const { customerName, loginLink } = data;

  const content = `
    <h1>Добро пожаловать в IBookTours!</h1>
    <p>Уважаемый(ая) ${customerName},</p>
    <p>Благодарим вас за регистрацию в IBookTours! Мы рады приветствовать вас в нашем сообществе путешественников.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Что вас ждёт</h2>
      <p><strong>Эксклюзивные предложения</strong> - Доступ к специальным скидкам и акциям</p>
      <p><strong>Персональные рекомендации</strong> - Туры, подобранные специально для вас</p>
      <p><strong>Простое бронирование</strong> - Ваша история путешествий всегда под рукой</p>
      <p><strong>Приоритетная поддержка</strong> - Наша команда всегда готова помочь</p>
    </div>

    <p style="text-align: center;"><a href="${loginLink}" class="button">Войти в аккаунт</a></p>
    <p>Начните исследовать наши туры и найдите своё идеальное приключение уже сегодня!</p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: 'Добро пожаловать в IBookTours! Ваш аккаунт успешно создан.' });
  return { subject: 'Добро пожаловать в IBookTours!', html, text: htmlToText(html) };
}
