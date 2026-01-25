import { baseTemplate, htmlToText } from '../base';
import { BookingCancelledData, RenderedEmail } from '../types';

export function bookingCancelledTemplate(data: BookingCancelledData): RenderedEmail {
  const { customerName, bookingId, tourName, refundAmount } = data;

  const content = `
    <h1>Booking Cancelled</h1>
    <p>Dear ${customerName},</p>
    <p>We're sorry to see you go! Your booking has been cancelled as requested.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Cancellation Details</h2>
      <p>
        <span class="info-label">Booking ID</span><br>
        <span class="info-value">${bookingId}</span>
      </p>
      <p>
        <span class="info-label">Tour</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      ${refundAmount ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">Refund Amount</span><br>
        <span class="info-value" style="font-size: 20px; color: #059669;">${refundAmount}</span>
      </p>
      <p style="font-size: 14px; color: #6b7280;">
        Your refund will be processed within 5-10 business days and credited to your original payment method.
      </p>
      ` : ''}
    </div>

    <p>We hope to welcome you on a future adventure! Albania has so many amazing experiences waiting for you.</p>

    <p style="text-align: center;">
      <a href="https://itraveltours.com/tours" class="button">Browse Other Tours</a>
    </p>

    <p>If you have any questions about your cancellation or refund, please don't hesitate to contact us.</p>
    <p><strong>The ITravelTours Team</strong></p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `Your booking for ${tourName} has been cancelled.`,
  });

  return {
    subject: `Booking Cancelled - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
