import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>Добро пожаловать в нашу рассылку!</h1>
    <p>Здравствуйте!</p>
    <p>Благодарим за подписку на рассылку IBookTours! Теперь вы часть нашего сообщества путешественников.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Что вы будете получать</h2>
      <p><strong>Эксклюзивные предложения</strong> - Узнавайте первыми о специальных акциях</p>
      <p><strong>Вдохновение для путешествий</strong> - Откройте для себя скрытые жемчужины Албании</p>
      <p><strong>Советы путешественникам</strong> - Рекомендации экспертов для вашего приключения</p>
      <p><strong>Новые туры</strong> - Ранний доступ к нашим последним турам</p>
    </div>

    <p style="text-align: center;"><a href="https://ibooktours.com/tours" class="button">Начать исследовать</a></p>
    <p style="font-size: 14px; color: #6b7280;">Вы подписались с адреса: ${email}<br>Отписаться можно в любое время по ссылке в наших письмах.</p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: 'Добро пожаловать в рассылку IBookTours! Эксклюзивные предложения и советы уже ждут вас.' });
  return { subject: 'Добро пожаловать в рассылку IBookTours!', html, text: htmlToText(html) };
}
