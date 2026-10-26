# Campus Lost & Found (MERN)

React (Vite) + Tailwind frontend in `client/`, Express + MongoDB (Mongoose) API in `server/`.

## Run locally
Terminal 1 (backend):
    cd server
    cp .env.example .env     # then edit .env: MONGO_URI and JWT_SECRET
    npm install
    npm run dev              # http://localhost:5000

Terminal 2 (frontend):
    cd client
    cp .env.example .env     # VITE_API_URL=http://localhost:5000/api
    npm install
    npm run dev              # http://localhost:5173

## Environment variables
server/.env : PORT, MONGO_URI, JWT_SECRET, CLIENT_URL
client/.env : VITE_API_URL
