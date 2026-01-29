// ============================================
// CALENDAR UTILITY
// ============================================
// Generates calendar event URLs and ICS files for
// Google Calendar, Apple Calendar, and Outlook

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Sanitize text for use in calendar URLs/files
 * Prevents XSS and ensures valid encoding
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\r\n]+/g, ' ') // Replace newlines with spaces
    .trim();
}

/**
 * Format date for Google Calendar URL (YYYYMMDDTHHMMSSZ format)
 */
function formatGoogleDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Format date for ICS file (YYYYMMDDTHHMMSSZ format)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Generate a Google Calendar URL for adding an event
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: sanitizeText(event.title),
    details: sanitizeText(event.description),
    location: sanitizeText(event.location),
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate an Outlook Web calendar URL
 */
export function generateOutlookWebUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: sanitizeText(event.title),
    body: sanitizeText(event.description),
    location: sanitizeText(event.location),
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate ICS file content for Apple Calendar and desktop Outlook
 */
export function generateICSContent(event: CalendarEvent): string {
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@ibooktours.com`;
  const now = formatICSDate(new Date());

  // Escape special characters for ICS format
  const escapeICS = (text: string): string => {
    return sanitizeText(text)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IBookTours//Travel Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    `LOCATION:${escapeICS(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Download an ICS file for the event
 */
export function downloadICS(event: CalendarEvent, filename?: string): void {
  const content = generateICSContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${sanitizeText(event.title).replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy event details to clipboard
 */
export async function copyEventDetails(event: CalendarEvent): Promise<boolean> {
  const text = `${event.title}
📍 ${event.location}
📅 ${event.startDate.toLocaleDateString()} - ${event.endDate.toLocaleDateString()}

${event.description}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a CalendarEvent from booking data
 */
export function createEventFromBooking(booking: {
  name: string;
  location: string;
  date: string;
  duration?: string;
  type: string;
}): CalendarEvent {
  const startDate = new Date(booking.date);

  // Parse duration (e.g., "7 nights", "8 hours", "3 days")
  let endDate = new Date(startDate);
  if (booking.duration) {
    const match = booking.duration.match(/(\d+)\s*(night|day|hour)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      if (unit === 'night' || unit === 'day') {
        endDate.setDate(endDate.getDate() + num);
      } else if (unit === 'hour') {
        endDate.setHours(endDate.getHours() + num);
      }
    } else {
      // Default to 1 day if can't parse
      endDate.setDate(endDate.getDate() + 1);
    }
  } else {
    // Default to 1 day
    endDate.setDate(endDate.getDate() + 1);
  }

  const description = booking.type === 'vacation-package'
    ? `Your vacation package to ${booking.location}. Have a wonderful trip! \n\nBooked with IBookTours - www.ibooktours.com`
    : `Your ${booking.type} in ${booking.location}. Have a wonderful experience! \n\nBooked with IBookTours - www.ibooktours.com`;

  return {
    title: `IBookTours: ${booking.name}`,
    description,
    location: booking.location,
    startDate,
    endDate,
  };
}
