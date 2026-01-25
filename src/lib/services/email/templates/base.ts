// ============================================
// EMAIL BASE TEMPLATE
// ============================================
// Responsive HTML wrapper with RTL support for Hebrew

import { EmailLanguage } from './types';

// Brand colors matching the app theme
const COLORS = {
  primary: '#e63946',      // Punch Red
  primaryDark: '#c5313d',  // Darker red
  secondary: '#457b9d',    // Cerulean
  text: '#1d3557',         // Oxford Navy
  textLight: '#6b7280',    // Gray
  background: '#f1faee',   // Honeydew
  white: '#ffffff',
  border: '#e5e7eb',
};

interface BaseTemplateOptions {
  language: EmailLanguage;
  content: string;
  previewText?: string;
}

export function baseTemplate({ language, content, previewText }: BaseTemplateOptions): string {
  const isRTL = language === 'he';
  const dir = isRTL ? 'rtl' : 'ltr';
  const fontFamily = isRTL
    ? "'Rubik', 'Heebo', Arial, sans-serif"
    : "'Plus Jakarta Sans', Arial, sans-serif";

  return `
<!DOCTYPE html>
<html lang="${language}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ITravelTours</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }

    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: ${COLORS.background};
      font-family: ${fontFamily};
      direction: ${dir};
    }

    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${COLORS.white};
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%);
      padding: 32px 24px;
      text-align: center;
    }

    .logo {
      font-size: 28px;
      font-weight: 700;
      color: ${COLORS.white};
      text-decoration: none;
      letter-spacing: -0.5px;
    }

    /* Content */
    .content {
      padding: 40px 32px;
      color: ${COLORS.text};
      line-height: 1.6;
    }

    .content h1 {
      font-size: 24px;
      font-weight: 700;
      color: ${COLORS.text};
      margin: 0 0 24px 0;
    }

    .content h2 {
      font-size: 20px;
      font-weight: 600;
      color: ${COLORS.text};
      margin: 24px 0 16px 0;
    }

    .content p {
      font-size: 16px;
      color: ${COLORS.text};
      margin: 0 0 16px 0;
    }

    /* Buttons */
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: ${COLORS.primary};
      color: ${COLORS.white} !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }

    .button:hover {
      background-color: ${COLORS.primaryDark};
    }

    /* Info box */
    .info-box {
      background-color: ${COLORS.background};
      border: 1px solid ${COLORS.border};
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }

    .info-box p {
      margin: 8px 0;
    }

    .info-label {
      font-weight: 600;
      color: ${COLORS.textLight};
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 16px;
      color: ${COLORS.text};
      font-weight: 500;
    }

    /* Divider */
    .divider {
      height: 1px;
      background-color: ${COLORS.border};
      margin: 24px 0;
    }

    /* Footer */
    .footer {
      background-color: ${COLORS.background};
      padding: 32px 24px;
      text-align: center;
      border-top: 1px solid ${COLORS.border};
    }

    .footer p {
      font-size: 14px;
      color: ${COLORS.textLight};
      margin: 8px 0;
    }

    .footer a {
      color: ${COLORS.secondary};
      text-decoration: none;
    }

    .social-links {
      margin: 16px 0;
    }

    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: ${COLORS.secondary};
      text-decoration: none;
    }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      .content {
        padding: 24px 16px !important;
      }
      .header {
        padding: 24px 16px !important;
      }
    }
  </style>
</head>
<body>
  ${previewText ? `<!-- Preview text -->
  <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
    ${previewText}
  </div>` : ''}

  <!-- Background wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.background};">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <!-- Email container -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.white}; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td class="header">
              <a href="https://itraveltours.com" class="logo">ITravelTours</a>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p><strong>ITravelTours</strong></p>
              <p>Your gateway to Albanian adventures</p>
              <div class="divider"></div>
              <p>
                <a href="https://itraveltours.com">Website</a> |
                <a href="https://itraveltours.com/contact">Contact</a> |
                <a href="https://itraveltours.com/help">Help Center</a>
              </p>
              <p style="font-size: 12px; margin-top: 16px;">
                ${isRTL
                  ? 'קיבלת אימייל זה כי נרשמת לשירותי ITravelTours.'
                  : 'You received this email because you signed up for ITravelTours services.'}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Helper to convert HTML to plain text
export function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
