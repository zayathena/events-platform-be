import { Request, Response } from 'express';
import axios from 'axios';

export const getLiverpoolEvents = (req: Request, res: Response) => {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const city = 'Liverpool';
  const countryCode = 'GB';

  axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
    params: {
      apikey: apiKey,
      city,
      countryCode,
      size: 10,
    },
  })
  .then(response => {
    const events = response.data._embedded?.events || [];

    res.json({
      message: 'Liverpool events fetched',
      events: events.map((event: any) => ({
        id: event.id,
        name: event.name,
        date: event.dates.start.localDate,
        url: event.url,
        venue: event._embedded?.venues?.[0]?.name || 'Unknown venue',
      })),
    });
  })
  .catch(error => {
    console.error('Ticketmaster API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch events from Ticketmaster' });
  });
};