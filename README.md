# Crime Resolution Tracking and Reminder System

This repository contains a prototype microservice implementation for managing crime records and related evidence. It persists data in a SQLite database, uses JWT-based authentication, emits WebSocket notifications, chains evidence items with SHA256 hashes for integrity, and tracks case escalation and resolution status.

## Structure

- `backend/` – Node.js Express service for crime records with SQLite persistence, JWT login, and WebSocket notifications.
- `evidence-service/` – Express service storing evidence items and maintaining a hash chain of submissions.
- `auth-service/` – JWT authentication microservice.
- `frontend/` – React application providing role-based dashboards, localization, a theme toggle, offline support via a service worker, evidence management, and a notification center.
- `mobile/` – Basic React Native skeleton for field officers.
- `docker-compose.yml` – Container orchestration for local development.

Each service runs independently. Additional services (e.g., notification, analytics) can be added in separate directories.
See `crime-crs-features-list.md` for a list of implemented features. The frontend registers a service worker on load so basic pages work offline. It also shows live notifications via WebSocket and lets users manage evidence items. Crimes can be filtered by status via new API endpoints. Penal codes can be added via `/api/penal-codes` to control deadlines. User accounts are managed through `/api/users`.

## Running Tests

```bash
# Crime service
cd backend
npm install
npm test

# Evidence service
cd ../evidence-service
npm install
npm test

# Auth service
cd ../auth-service
npm install
npm test

# Frontend
cd ../frontend
npm install
npm test
```
## Running with Docker Compose

Start all services with:

```bash
docker-compose up
```

Data will persist in the `backend-data` volume.

## Top-level Test Script

You can run all service tests at once using the root `package.json` scripts:

```bash
npm test
```

This runs the backend, evidence service, auth service, and frontend tests sequentially.

## Deployment

The easiest way to start all services together is with Docker Compose. First
build the images and then launch the stack:

```bash
# Build images
docker-compose build

# Start the stack
docker-compose up -d
```

The backend service exposes port `3000`, the evidence service `4000`, the auth
service `5000`, and the frontend `5173`. The backend data is stored in the
`backend-data` Docker volume.

### Environment Variables

The backend uses the following environment variables which can be customised in
`docker-compose.yml`:

- `DB_FILE` – path to the SQLite database file
- `JWT_SECRET` – secret used to sign JWT tokens

Frontend configuration such as API base URLs can be adjusted by editing the
Vite environment variables in `frontend/.env`.

### Manual Development

If you prefer running services locally without Docker you can start each in a
separate terminal:

```bash
cd backend && npm install && node src/index.js

cd evidence-service && npm install && node src/index.js

cd auth-service && npm install && node src/index.js

cd frontend && npm install && npm run dev
```

The React app will then be available at <http://localhost:5173>. Login through
the `/login` page using a username from the seeded SQLite database. Once
authenticated you can manage crimes, upload evidence and see notifications in
real time.
