# Evidence Management Service

This Express service manages evidence items linked to crime records. Evidence submissions are hashed and appended to a simple chain to demonstrate blockchain-style immutability.

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
- `GET /api/evidence/chain` – retrieve hash chain
