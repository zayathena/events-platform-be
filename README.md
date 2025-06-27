# Launchpad Project - Events Platform Backend

A backend API for an events discovery and calendar platform. This application enables users to browse and sign up for custom events or Ticketmaster events, add events to their Google Calendar, and manage their own account. Staff users can log in to create and manage events.

---

## 📋 Project Overview

The Events Platform Backend is built with Node.js, Express, and PostgreSQL. It supports session-based authentication using `express-session` (with PostgreSQL storage via `connect-pg-simple`), integration with the Ticketmaster API, and RESTful endpoints for events and user management.

---

## ✨ Features

- **Event Browsing:** Retrieve a curated list of upcoming community events.
- **Event Signups:** Users can sign up for custom events or Ticketmaster events.
- **Calendar Integration:** Add events to your personal Google Calendar.
- **User Management:** Standard user registration and authentication.
- **Staff Administration:** Protected routes for staff to create, update, or delete events.
- **Secure Sessions:** Session data is stored in PostgreSQL for persistence.
- **Rate Limiting & Input Validation:** Prevent abuse and ensure data integrity.

---

## 📦 Dependencies

The project relies on the following packages:

### Runtime Dependencies:
- **axios**: ^1.9.0
- **bcrypt**: ^6.0.0
- **connect-pg-simple**: ^7.0.0
- **cookie-parser**: ^1.4.7
- **cors**: ^2.8.5
- **csurf**: ^1.11.0
- **dotenv**: ^16.5.0
- **express**: ^4.21.2
- **express-rate-limit**: ^7.5.0
- **express-session**: ^1.18.1
- **express-validator**: ^7.2.1
- **googleapis**: ^148.0.0
- **pg**: ^8.16.0

### Development Dependencies:
- **@types/bcrypt**: ^5.0.2
- **@types/cookie-parser**: ^1.4.9
- **@types/cors**: ^2.8.19
- **@types/csurf**: ^1.11.5
- **@types/express**: ^4.17.23
- **@types/express-session**: ^1.18.1
- **@types/node**: ^22.15.18
- **@types/pg**: ^8.15.2
- **ts-node**: ^10.9.2
- **ts-node-dev**: ^2.0.0
- **typescript**: ^5.8.3

*Note:* Running `npm install` (or `yarn install`) will automatically install all of the above dependencies as defined in your **package.json**.

---

## 🚀 Running the Project Locally

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (or yarn)
- **PostgreSQL:** Ensure your PostgreSQL server is running locally or you have access to a remote instance.

---

### Steps 

1. **Clone the Repository**

- You can clone the repository by entering the following command in your terminal: 
git clone https://github.com/zayathena/events-platform-be/

- Then naviagte into the folder: cd events-platform-be

2. **Install Dependencies**

- npm install
  or if you prefer yarn:
  yarn install

3. **Set Up Environment Variables**

Create a .env file at the root of the project with the following keys. Adjust values as needed:
```
SESSION_SECRET=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
NODE_ENV=development
TICKETMASTER_API_KEY=your-ticketmaster-api-key
REACT_APP_API_BASE_URL=http://localhost:3000
```
4. **Set Up the Database**

Create the Database: Ensure your PostgreSQL server is running, then create your database if it does not exist:
CREATE DATABASE your_database;

Seed the Database: Run the seed script to populate the database:
npm run seed

5. **Run the Server**
Start the server in development mode:
npm run dev

The server will typically be available at http://localhost:3000 (unless you have changed the port in your configuration).

## 📁 Project Structure
```
src/
├── config/            # Database configuration and seed scripts
├── controllers/       # Express controllers (handling HTTP requests)
├── middleware/        # Authentication, session, and other middleware
├── routes/            # API route definitions
├── services/          # Business logic for events, authentication, etc.
├── utils/             # Utility functions and helpers
├── app.ts             # Main Express app configuration
├── listen.ts          # Entry point to start the server
```
## 🌍 Deployment

### Deploying on render

1. **Create a New Web Service on Render**

- Connect your GitHub repository

- Build Command: 
yarn

- Start command:
yarn start

2. **Configuration on Render**

- Set up environment variables (such as SESSION_SECRET, DATABASE_URL, etc.) in your Render dashboard.

- Ensure your Render PostgreSQL instance is connected (the session table will be auto-created using createTableIfMissing: true).

- For detailed instructions, see the Render Deployment Guide for Node.js.

## ℹ️ Additional Notes

- *Session Handling:* Sessions are stored in PostgreSQL using connect-pg-simple. Ensure that cookies work correctly by verifying HTTPS usage and, if necessary, configuring the cookie domain in production.

- *CORS Configuration:* The cors middleware is set up to allow credentials and whitelist your frontend domain. Ensure that your frontend's URL matches the configured origin.

- *Ticketmaster API:* Make sure you have a valid Ticketmaster API key in your environment variables to enable external event fetching.

## 📬 Contributing & Contact

- *Contributing:* Contributions, bug reports, and feature requests are welcome! Open a GitHub Issue or submit a Pull Request.

- *Contact:* For any questions or support, please reach out via GitHub Issues.
