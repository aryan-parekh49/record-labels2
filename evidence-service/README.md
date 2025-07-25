# Evidence Management Service

This simple Express service manages evidence items linked to crime records.
It stores data in memory and provides minimal REST endpoints.

## Usage

```bash
npm install
npm test
node src/index.js
```

### Endpoints

- `POST /api/evidence` – add an evidence item `{ crimeId, type, description }`
- `GET /api/evidence/crime/:crimeId` – list evidence for a crime
- `DELETE /api/evidence/:id` – delete an evidence item
