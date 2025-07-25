# Crime Resolution Tracking and Reminder System

This repository contains a prototype microservice implementation for managing crime records and related evidence.

## Structure

- `backend/` – Node.js Express service for crime records. Includes Jest tests and endpoints for reminders, escalation, statistics, and note management.
- `evidence-service/` – Express service that stores evidence items linked to crimes.
- `frontend/` – React application providing role-based dashboards and localization.

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
