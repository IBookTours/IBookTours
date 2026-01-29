import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>Restablecimiento de Contraseña</h1>
    <p>Estimado/a ${customerName},</p>
    <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.</p>

    <p style="text-align: center;"><a href="${resetLink}" class="button">Restablecer Contraseña</a></p>

    <div class="info-box">
      <p><strong>Importante:</strong></p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>Este enlace expira en ${expiresIn}</li>
        <li>Si no solicitaste esto, ignora este correo</li>
        <li>Tu contraseña permanecerá sin cambios hasta que crees una nueva</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #6b7280;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="${resetLink}" style="word-break: break-all;">${resetLink}</a></p>
    <p><strong>El Equipo de IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'es', content, previewText: 'Solicitud de restablecimiento de contraseña para tu cuenta IBookTours.' });
  return { subject: 'Restablecer Tu Contraseña - IBookTours', html, text: htmlToText(html) };
}
