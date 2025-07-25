# Crime Tracking Backend

This Express.js service manages crime records. Data is stored in a SQLite database and all routes require a valid JWT token. The server also opens a WebSocket endpoint so clients can subscribe to updates.

Other services such as evidence management run in their own directories.

## Usage

```bash
npm install
npm test
node src/index.js
```

### Notable Endpoints
- `POST /api/login` – obtain a JWT token
- `GET /api/users` – list users
- `POST /api/users` – create a new user
- `PUT /api/users/:username` – update an existing user
- `DELETE /api/users/:username` – remove a user
- `GET /api/penal-codes` – list penal codes
- `POST /api/penal-codes` – add a penal code
- `DELETE /api/penal-codes/:code` – remove a penal code
- `POST /api/crimes` – create a crime record
- `GET /api/crimes` – list all crimes
- `GET /api/crimes/:id` – retrieve a specific crime
- `PUT /api/crimes/:id` – update a crime
- `DELETE /api/crimes/:id` – remove a crime record
- `GET /api/crimes/:id/notes` – list notes for a crime
- `POST /api/crimes/:id/notes` – add a note
- `DELETE /api/crimes/:id/notes/:noteId` – remove a note
- `GET /api/crimes/overdue` – list overdue crimes
- `GET /api/crimes/reminders-due` – list crimes that should receive a reminder
- `GET /api/crimes/due-soon?days=7` – list crimes nearing their deadline
- `POST /api/crimes/:id/remind` – mark a reminder as sent
- `POST /api/crimes/:id/escalate` – escalate an overdue crime with a reason
- `POST /api/crimes/:id/resolve` – mark a crime as resolved
- `GET /api/crimes/escalated` – list escalated crimes
- `GET /api/crimes/station/:station` – list crimes for a station
- `GET /api/crimes/officer/:officer` – list crimes assigned to an officer
- `GET /api/stats` – summary counts of pending/resolved/overdue
- `GET /api/stats/station/:station` – stats for a specific station
- `GET /api/stats/officer/:officer` – stats for a specific officer
- `GET /api/crimes/category/:category` – list crimes by category
- `GET /api/stats/category/:category` – stats for a specific category
- `GET /api/crimes/status/:status` – list crimes by status (`pending` or `resolved`)
- `GET /api/stats/status/:status` – count crimes for a status
- WebSocket endpoint at /ws for real-time updates
