import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Ticketmaster route works');
});

router.get('/events', (req, res) => {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const city = 'Liverpool';
  const countryCode = 'GB'; 

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&countryCode=${countryCode}`;

  axios.get(url)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error('Ticketmaster API Error:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to fetch events from Ticketmaster' });
    });
});

export default router;