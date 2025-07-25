# Crime Resolution Tracking and Reminder System

This repository contains a prototype implementation of a microservice-based Crime Resolution Tracking System. The Express.js service handles crime records with automatic deadlines, overdue detection, reminder tracking, escalation of unresolved cases, and basic per-station statistics.

## Structure

- `backend/` – Node.js Express service that manages crime records. Includes unit tests with Jest and exposes REST endpoints for reminders, escalation, per-station queries, and statistics.

Further services (e.g., evidence management, notification, analytics) can be added in separate directories following a similar structure.

See `crime-crs-features-list.md` for a brief list of implemented capabilities.

## Running Tests

Navigate to the service directory and run `npm test`.

```bash
cd backend
npm install
npm test
```
