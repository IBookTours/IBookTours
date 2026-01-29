import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>Redefinição de Senha</h1>
    <p>Prezado(a) ${customerName},</p>
    <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha.</p>

    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Redefinir Senha</a>
    </p>

    <div class="info-box">
      <p><strong>Importante:</strong></p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Este link expira em ${expiresIn}</li>
        <li>Se você não solicitou isso, ignore este e-mail</li>
        <li>Sua senha permanecerá inalterada até que você crie uma nova</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #6b7280;">
      Se o botão não funcionar, copie e cole este link no seu navegador:<br>
      <a href="${resetLink}" style="word-break: break-all;">${resetLink}</a>
    </p>

    <p><strong>Equipe IBookTours</strong></p>
  `;

  const html = baseTemplate({
    language: 'pt',
    content,
    previewText: 'Solicitação de redefinição de senha para sua conta IBookTours.',
  });

  return {
    subject: 'Redefinir Sua Senha - IBookTours',
    html,
    text: htmlToText(html),
  };
}
