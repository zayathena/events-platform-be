import { Request, Response } from 'express';
import axios from 'axios';

export const getEvents = (req: Request, res: Response) => {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const city = 'Liverpool';

  axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
    params: {
      apikey: apiKey,
      city: city,
      size: 10,
    },
  })
  .then(response => {
    const events = response.data._embedded?.events || [];

    res.json({
      message: 'Events fetched from Ticketmaster',
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
    console.error('Error fetching Ticketmaster events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  });
};