import axios from "axios";

const API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";

export function fetchTicketmasterEvents(keyword: string = "music", city: string = "London") {
  return axios.get(BASE_URL, {
    params: {
      apikey: API_KEY,
      keyword,
      city: 'Liverpool',
      size: 10,
    },
  })
  .then(response => {
    const events = response.data._embedded?.events || [];
    return events.map((event: any) => ({
      id: event.id,
      name: event.name,
      date: event.dates.start.localDate,
      time: event.dates.start.localTime,
      image: event.images[0]?.url,
      venue: event._embedded.venues[0]?.name,
      city: event._embedded.venues[0]?.city.name,
    }));
  })
  .catch(err => {
    console.error("Failed to fetch Ticketmaster events:", err);
    throw err;
  });
}