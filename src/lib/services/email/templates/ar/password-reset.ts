import { baseTemplate, htmlToText } from '../base';
import { PasswordResetData, RenderedEmail } from '../types';

export function passwordResetTemplate(data: PasswordResetData): RenderedEmail {
  const { customerName, resetLink, expiresIn } = data;

  const content = `
    <h1>إعادة تعيين كلمة المرور</h1>
    <p>عزيزي/عزيزتي ${customerName}،</p>
    <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإنشاء كلمة مرور جديدة.</p>

    <p style="text-align: center;"><a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a></p>

    <div class="info-box">
      <p><strong>مهم:</strong></p>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>ينتهي هذا الرابط خلال ${expiresIn}</li>
        <li>إذا لم تطلب هذا، تجاهل هذا البريد</li>
        <li>ستبقى كلمة المرور دون تغيير حتى تنشئ واحدة جديدة</li>
      </ul>
    </div>

    <p style="font-size: 14px; color: #6b7280;">إذا لم يعمل الزر، انسخ والصق هذا الرابط في متصفحك:<br><a href="${resetLink}" style="word-break: break-all;">${resetLink}</a></p>
    <p><strong>فريق IBookTours</strong></p>
  `;

  const html = baseTemplate({ language: 'ar', content, previewText: 'طلب إعادة تعيين كلمة المرور لحساب IBookTours الخاص بك.' });
  return { subject: 'إعادة تعيين كلمة المرور - IBookTours', html, text: htmlToText(html) };
}
