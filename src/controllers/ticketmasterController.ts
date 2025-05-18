import { Request, Response } from 'express';
import axios from 'axios';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    const city = 'Liverpool'; 

    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: {
        apikey: apiKey,
        city: 'Liverpool',
        size: 10, 
      },
    });

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
  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};