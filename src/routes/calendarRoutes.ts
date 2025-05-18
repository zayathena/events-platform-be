import express from "express";
import { getAuthUrl, getTokens, createCalendarEvent } from "../services/googleCalendar";

const router = express.Router();

router.get("/google-auth", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code as string;
  const tokens = await getTokens(code);

  res.json({ message: "Authorization successful", tokens });
});

router.post("/add-event", async (req, res) => {
  const { tokens, eventData } = req.body;

  try {
    const result = await createCalendarEvent(tokens, eventData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event", detail: error });
  }
});

export default router;