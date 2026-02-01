import { baseTemplate, htmlToText, escapeHtml } from '../base';
import { BookingConfirmationData, RenderedEmail } from '../types';

export function bookingConfirmationTemplate(data: BookingConfirmationData): RenderedEmail {
  const {
    customerName,
    bookingId,
    tourName,
    tourDate,
    travelers,
    totalAmount,
    meetingPoint,
    contactPhone,
  } = data;

  // SECURITY: Escape user-provided content to prevent XSS
  // Handle both totalAmount and totalPrice for backward compatibility
  const displayAmount = totalAmount || data.totalPrice || '';
  const safeCustomerName = escapeHtml(customerName);
  const safeBookingId = escapeHtml(bookingId);
  const safeTourName = escapeHtml(tourName);
  const safeTourDate = escapeHtml(tourDate);
  const safeTotalAmount = escapeHtml(displayAmount);
  const safeMeetingPoint = meetingPoint ? escapeHtml(meetingPoint) : '';
  const safeContactPhone = contactPhone ? escapeHtml(contactPhone) : '';

  const content = `
    <h1>Booking Confirmed!</h1>
    <p>Dear ${safeCustomerName},</p>
    <p>Great news! Your booking has been confirmed. We can't wait to show you the beauty of Albania!</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Booking Details</h2>
      <p>
        <span class="info-label">Booking ID</span><br>
        <span class="info-value">${safeBookingId}</span>
      </p>
      <p>
        <span class="info-label">Tour</span><br>
        <span class="info-value">${safeTourName}</span>
      </p>
      <p>
        <span class="info-label">Date</span><br>
        <span class="info-value">${safeTourDate}</span>
      </p>
      <p>
        <span class="info-label">Number of Travelers</span><br>
        <span class="info-value">${travelers} ${travelers === 1 ? 'person' : 'people'}</span>
      </p>
      <p>
        <span class="info-label">Total Amount</span><br>
        <span class="info-value" style="font-size: 20px; color: #e63946;">${safeTotalAmount}</span>
      </p>
      ${safeMeetingPoint ? `
      <div class="divider"></div>
      <p>
        <span class="info-label">Meeting Point</span><br>
        <span class="info-value">${safeMeetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>What to Bring</h2>
    <ul>
      <li>Comfortable walking shoes</li>
      <li>Sun protection (hat, sunscreen)</li>
      <li>Camera for amazing photos</li>
      <li>Valid ID or passport</li>
      <li>This confirmation email (printed or on your phone)</li>
    </ul>

    ${safeContactPhone ? `
    <p>Need to reach us on the day of your tour? Call us at <strong>${safeContactPhone}</strong></p>
    ` : ''}

    <p style="text-align: center;">
      <a href="https://ibooktours.com/profile" class="button">View My Bookings</a>
    </p>

    <p>If you have any questions before your tour, don't hesitate to contact us.</p>
    <p><strong>The IBookTours Team</strong></p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `Your booking for ${safeTourName} on ${safeTourDate} is confirmed!`,
  });

  return {
    subject: `Booking Confirmed - ${tourName}`,
    html,
    text: htmlToText(html),
  };
}
