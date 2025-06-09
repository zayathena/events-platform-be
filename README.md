# Launchpad Project
# Events Platform

## 📋 Project Overview

A backend API for an events discovery and calendar platform. Built with Node.js, Express, and PostgreSQL, this app allows users to browse and sign up for custom events or events via Ticketmaster, save them to a personal calendar, and manage their own account.

## ✨ Features

- Browse community events
- Sign up for events
- Add events to your Google Calendar
- Staff login to manage and create events
- Responsive and accessible design

## 🔧 Built With

- Node.js
- Express
- TypeScript
- PostgreSQL
- express-session + connect-pg-simple
- dotenv
- Ticketmaster API

## 🚀 Running the Project Locally

1. Clone the repository: 
   git clone https://github.com/zayathena/events-platform-be.git 
   cd events-platform-be

2. Install Dependencies 
   npm install

3. Create Environment Variables 
   SESSION_SECRET=your-secret-key
   DATABASE_URL=postgresql://user:password@localhost:5432/your_database
   NODE_ENV=development   

4. Set Up the Database 
   Make sure you have PostgreSQL running, then run the seed script
   npm run seed 

5. Run the Server
   npm run dev    

## 📁 Project Structure

src/
├── config/            # Database setup and seeds
├── controllers/       # Express controllers
├── middleware/        # Auth and session middleware
├── routes/            # API route definitions
├── utils/             # Utility functions
├── app.ts             # Express app config
├── listen.ts          # Entry point

## 🌍 Deployment

- Follow the Render deployment guide: https://render.com/docs/deploy-node
- Make sure to configure:
   Environment variables (SESSION_SECRET, DATABASE_URL)
   Build command: yarn 
   Start command: yarn start 

## 📬 Contact

For issues or feature requests, please open a GitHub Issue.