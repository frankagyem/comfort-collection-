# Comfort Collections E-Commerce Platform

A full-stack e-commerce website for Comfort Collections, built with React (Vite), Node.js, Express, and MongoDB.

## Tech Stack
- **Frontend:** React (Vite), Zustand (State Management), React Router, Lucide React (Icons), CSS Variables (Theming).
- **Backend:** Node.js, Express, Mongoose (MongoDB).
- **Auth:** JWT-based authentication.
- **Image Storage:** Supabase Storage (configured in backend).
- **Deployment:** Vercel/Netlify (Frontend), Render/Railway (Backend), MongoDB Atlas (Database).

## Project Structure
- `/backend`: Node.js API server
- `/frontend`: React client application

## Setup Instructions

### 1. Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create an account/cluster.
2. Under "Database Access", create a user and password.
3. Under "Network Access", whitelist your IP address (or `0.0.0.0/0` for all).
4. Click "Connect", select "Connect your application", and copy the connection string.

### 2. Image Storage Setup (Supabase)
1. Create a project on [Supabase](https://supabase.com/).
2. Go to "Storage" and create a new public bucket named `products`.
3. Go to "Project Settings > API" to get your `SUPABASE_URL` and `SUPABASE_KEY` (anon public or service role).

### 3. Environment Variables
In the `backend` folder, copy `.env.example` to `.env` and fill in the values:
```
NODE_ENV=development
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
SUPABASE_URL=<your_supabase_project_url>
SUPABASE_KEY=<your_supabase_anon_key>
```

### 4. Install Dependencies
Open two terminals.

**Terminal 1 (Backend):**
```bash
cd backend
npm install
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
```

### 5. Seed the Database
Populate the database with the initial admin user and sample products:
```bash
cd backend
npm run data:import
```

*Admin Login Credentials:*
- Email: `comfortyanso16@gmail.com`
- Password: `0554383476@Jj`

### 6. Run Locally
**Terminal 1 (Backend):**
```bash
npm run dev
```
*(Runs on http://localhost:5000)*

**Terminal 2 (Frontend):**
```bash
npm run dev
```
*(Runs on http://localhost:3000)*

## Deployment to Production

### Backend (Render / Railway)
1. Push your code to GitHub.
2. Connect your repo to Render or Railway.
3. Set the Root Directory to `backend` (or deploy just that subfolder).
4. Add all environment variables from your `.env` file to the platform's environment settings.
5. Set start command to `node server.js` (or `npm start`).

### Frontend (Vercel / Netlify)
1. Connect your repo to Vercel or Netlify.
2. Set the Root Directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. In your frontend API calls, ensure they point to your deployed backend URL instead of `/api/...` (You can change this in a `.env` file for Vite using `VITE_API_URL` and configuring axios, or if using Vercel, set up a `vercel.json` rewrite).

## Features Included
- **Mobile First & PWA:** Configured with `vite-plugin-pwa` for offline support and mobile installability.
- **Editorial Design:** Grid layouts, River Island aesthetic, and smooth micro-interactions.
- **WhatsApp Checkout:** Orders generate a pre-filled WhatsApp message sent directly to `0554383476`.
- **Payment Architecture:** The `Order` model includes `isPaid`, `paymentMethod`, etc. ready for Paystack/Mobile Money integration.
- **Admin Dashboard:** Order management, status updates, and basic analytics.
- **Referral System:** Generates referral codes for users, tied to checkout.
