# Crime Tracking Backend

This Express.js backend provides CRUD operations for crime records in memory. It automatically assigns resolution deadlines based on the crime heading and exposes endpoints to mark records as resolved, list overdue cases, and manage reminder notifications.

## Usage

```bash
npm install
npm test
node src/index.js
```

### Notable Endpoints

- `POST /api/crimes` – create a crime record
- `GET /api/crimes/overdue` – list overdue crimes
- `GET /api/crimes/reminders-due` – list crimes that should receive a reminder
- `POST /api/crimes/:id/remind` – mark a reminder as sent
- `POST /api/crimes/:id/escalate` – escalate an overdue crime with a reason
- `GET /api/crimes/escalated` – list escalated crimes
- `GET /api/crimes/station/:station` – list crimes for a station
- `GET /api/stats` – summary counts of pending/resolved/overdue
