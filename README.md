# Crime Resolution Tracking and Reminder System

This repository contains a prototype microservice implementation for managing crime records and related evidence. It now persists data in a SQLite database, uses JWT-based authentication, emits WebSocket notifications, and chains evidence items with SHA256 hashes for integrity.

## Structure

- `backend/` – Node.js Express service for crime records with SQLite persistence, JWT login, and WebSocket notifications.
- `evidence-service/` – Express service storing evidence items and maintaining a hash chain of submissions.
- `frontend/` – React application providing role-based dashboards and localization.
- `mobile/` – Basic React Native skeleton for field officers.
- `docker-compose.yml` – Container orchestration for local development.

Each service runs independently. Additional services (e.g., notification, analytics) can be added in separate directories.
See `crime-crs-features-list.md` for a list of implemented features.

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
