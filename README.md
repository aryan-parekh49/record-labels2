# Crime Resolution Tracking and Reminder System

This repository contains a prototype microservice implementation for managing crime records and related evidence. It now persists data in a SQLite database, uses JWT-based authentication, emits WebSocket notifications, chains evidence items with SHA256 hashes for integrity, and tracks case escalation and resolution status.

## Structure

- `backend/` – Node.js Express service for crime records with SQLite persistence, JWT login, and WebSocket notifications.
- `evidence-service/` – Express service storing evidence items and maintaining a hash chain of submissions.
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
