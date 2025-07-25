const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

let evidences = [];
let nextId = 1;
let chain = [];

function resetData() {
  evidences = [];
  nextId = 1;
  chain = [];
}

app.post('/api/evidence', (req, res) => {
  const { crimeId, type = 'photo', description = '' } = req.body;
  if (!crimeId) {
    return res.status(400).send('crimeId required');
  }
  const evidence = {
    id: nextId++,
    crimeId,
    type,
    description,
    createdAt: new Date().toISOString(),
  };
  evidences.push(evidence);
  const prevHash = chain.length ? chain[chain.length - 1].hash : '';
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ prevHash, ...evidence }))
    .digest('hex');
  chain.push({ hash, prevHash, evidenceId: evidence.id });
  res.status(201).json(evidence);
});

app.get('/api/evidence/crime/:crimeId', (req, res) => {
  const { crimeId } = req.params;
  res.json(evidences.filter(e => e.crimeId == crimeId));
});

app.get('/api/evidence/chain', (req, res) => {
  res.json(chain);
});

app.delete('/api/evidence/:id', (req, res) => {
  const index = evidences.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send('Not Found');
  }
  const [removed] = evidences.splice(index, 1);
  res.json(removed);
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log(`Evidence service running on port ${port}`));
}

module.exports = app;
module.exports.resetData = resetData;
