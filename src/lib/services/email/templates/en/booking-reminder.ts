import { baseTemplate, htmlToText } from '../base';
import { BookingReminderData, RenderedEmail } from '../types';

export function bookingReminderTemplate(data: BookingReminderData): RenderedEmail {
  const {
    customerName,
    tourName,
    tourDate,
    daysUntil,
    meetingPoint,
    contactPhone,
  } = data;

  const dayText = daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`;

  const content = `
    <h1>Your Tour is ${daysUntil === 1 ? 'Tomorrow' : 'Coming Up'}!</h1>
    <p>Dear ${customerName},</p>
    <p>This is a friendly reminder that your adventure is ${dayText}! We're excited to have you join us.</p>

    <div class="info-box">
      <h2 style="margin-top: 0;">Tour Details</h2>
      <p>
        <span class="info-label">Tour</span><br>
        <span class="info-value">${tourName}</span>
      </p>
      <p>
        <span class="info-label">Date</span><br>
        <span class="info-value">${tourDate}</span>
      </p>
      ${meetingPoint ? `
      <p>
        <span class="info-label">Meeting Point</span><br>
        <span class="info-value">${meetingPoint}</span>
      </p>
      ` : ''}
    </div>

    <h2>Quick Checklist</h2>
    <ul>
      <li>Comfortable walking shoes - check!</li>
      <li>Sun protection - check!</li>
      <li>Camera ready - check!</li>
      <li>Valid ID - check!</li>
      <li>Sense of adventure - definitely check!</li>
    </ul>

    ${contactPhone ? `
    <p><strong>Emergency Contact:</strong> ${contactPhone}</p>
    ` : ''}

    <p>Please arrive 10-15 minutes before the scheduled departure time.</p>

    <p style="text-align: center;">
      <a href="https://itraveltours.com/profile" class="button">View Booking Details</a>
    </p>

    <p>See you soon!</p>
    <p><strong>The ITravelTours Team</strong></p>
  `;

  const html = baseTemplate({
    language: 'en',
    content,
    previewText: `Reminder: Your ${tourName} tour is ${dayText}!`,
  });

  return {
    subject: `Reminder: ${tourName} - ${tourDate}`,
    html,
    text: htmlToText(html),
  };
}
