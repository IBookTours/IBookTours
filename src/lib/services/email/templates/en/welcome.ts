import { baseTemplate, htmlToText } from '../base';
import { WelcomeData, RenderedEmail } from '../types';

export function welcomeTemplate(data: WelcomeData): RenderedEmail {
  const { customerName } = data;

  const content = `
    <h1>Welcome to ITravelTours!</h1>
    <p>Dear ${customerName},</p>
    <p>Thank you for joining ITravelTours! We're thrilled to have you as part of our travel community.</p>
    <p>Albania awaits with its stunning landscapes, rich history, and warm hospitality. Whether you're looking for a relaxing beach getaway or an adventurous mountain trek, we've got the perfect trip for you.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">What's Next?</h2>
      <p><strong>1. Browse Tours</strong> - Explore our curated day tours and vacation packages</p>
      <p><strong>2. Book Your Adventure</strong> - Secure your spot with easy online booking</p>
      <p><strong>3. Travel with Confidence</strong> - Enjoy expert guides and local insights</p>
    </div>

    <p style="text-align: center;">
      <a href="https://itraveltours.com/tours" class="button">Explore Tours</a>
    </p>

    <p>If you have any questions, our team is always here to help.</p>
    <p>Happy travels!</p>
    <p><strong>The ITravelTours Team</strong></p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `Welcome to ITravelTours, ${customerName}! Start exploring Albania's best tours.`,
  });

  return {
    subject: `Welcome to ITravelTours, ${customerName}!`,
    html,
    text: htmlToText(html),
  };
}
