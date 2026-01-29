import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>Сброс пароля</h1>
    <p>Уважаемый(ая) ${customerName},</p>
    <p>Мы получили запрос на сброс пароля для вашего аккаунта. Нажмите кнопку ниже, чтобы создать новый пароль.</p>

    <p style="text-align: center;"><a href="${resetLink}" class="button">Сбросить пароль</a></p>

    <div class="info-box">
      <p><strong>Важно:</strong></p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Ссылка действительна ${expiresIn}</li>
        <li>Если вы не запрашивали сброс, проигнорируйте это письмо</li>
        <li>Ваш текущий пароль останется без изменений, пока вы не создадите новый</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #6b7280;">Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:<br><a href="${resetLink}" style="word-break: break-all;">${resetLink}</a></p>
    <p><strong>Команда IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ru', content, previewText: 'Запрос на сброс пароля для вашего аккаунта IBookTours.' });
  return { subject: 'Сброс пароля - IBookTours', html, text: htmlToText(html) };
}
