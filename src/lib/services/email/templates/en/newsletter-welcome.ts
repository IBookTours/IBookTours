import { baseTemplate, htmlToText } from '../base';
import { NewsletterWelcomeData, RenderedEmail } from '../types';

export function newsletterWelcomeTemplate(data: NewsletterWelcomeData): RenderedEmail {
  const { email } = data;

  const content = `
    <h1>Welcome to Our Newsletter!</h1>
    <p>Thank you for subscribing to the IBookTours newsletter!</p>
    <p>You're now part of our community of travel enthusiasts who love exploring Albania's hidden gems and breathtaking destinations.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">What to Expect</h2>
      <p><strong>Exclusive Deals</strong> - Be the first to know about special offers and discounts</p>
      <p><strong>Travel Tips</strong> - Get insider tips for making the most of your Albanian adventure</p>
      <p><strong>New Tours</strong> - Discover our latest tour offerings before anyone else</p>
      <p><strong>Destination Guides</strong> - Learn about the best places to visit in Albania</p>
    </div>

    <p style="text-align: center;">
      <a href="https://ibooktours.com/tours" class="button">Start Exploring</a>
    </p>

    <p>We promise to only send you valuable content - no spam, ever!</p>
    <p>Happy travels!</p>
    <p><strong>The IBookTours Team</strong></p>

    <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
      Subscribed email: ${email}<br>
      You can unsubscribe at any time by clicking the link at the bottom of our emails.
    </p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: 'Welcome to IBookTours newsletter! Get ready for exclusive deals and travel tips.',
  });

  return {
    subject: 'Welcome to IBookTours Newsletter!',
    html,
    text: htmlToText(html),
  };
}
