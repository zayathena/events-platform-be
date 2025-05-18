import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URI!
);

export function getAuthUrl() {
  const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
}

export function getTokens(code: string): Promise<any> {
  return oauth2Client.getToken(code).then(({ tokens }) => {
    oauth2Client.setCredentials(tokens);
    return tokens;
  });
}

export function createCalendarEvent(tokens: any, eventData: any): Promise<any> {
  oauth2Client.setCredentials(tokens);

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: eventData.title,
    description: eventData.description,
    start: {
      dateTime: eventData.start,
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: eventData.end,
      timeZone: 'Europe/London',
    },
  };

  return calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  })
  .then(response => response.data);
}