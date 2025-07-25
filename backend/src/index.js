const express = require('express');
const app = express();
app.use(express.json());

const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_DEADLINE_DAYS = {
  default: 60,
  'Serious Crime': 90,
  'Minor Offense': 30,
};

let crimes = [];
let nextId = 1;

function isOverdue(crime) {
  return new Date(crime.deadline).getTime() < Date.now() && crime.status !== 'resolved';
}

function getReminderLevel(crime) {
  if (crime.status !== 'pending') {
    return 0;
  }
  const reported = new Date(crime.reportedAt).getTime();
  const now = Date.now();
  const days = Math.floor((now - reported) / DAY_MS);
  if (days >= 50 && crime.remindersSent < 3) return 3;
  if (days >= 40 && crime.remindersSent < 2) return 2;
  if (days >= 30 && crime.remindersSent < 1) return 1;
  return 0;
}

function remindersDue() {
  return crimes.filter(c => getReminderLevel(c) > 0);
}

function dueSoon(days = 7) {
  const threshold = Date.now() + days * DAY_MS;
  return crimes.filter(c => {
    const deadline = new Date(c.deadline).getTime();
    return (
      c.status === 'pending' &&
      deadline <= threshold &&
      deadline >= Date.now()
    );
  });
}

function resetData() {
  crimes = [];
  nextId = 1;
}

app.post('/api/crimes', (req, res) => {
  const { category = 'Major', heading = 'default', station = 'Station 1', officer = '', ...rest } = req.body;
  const days = DEFAULT_DEADLINE_DAYS[heading] || DEFAULT_DEADLINE_DAYS.default;
  const reportedAt = new Date();
  const deadline = new Date(reportedAt.getTime() + days * DAY_MS);
  const crime = {
    id: nextId++,
    category,
    heading,
    reportedAt: reportedAt.toISOString(),
    deadline: deadline.toISOString(),
    station,
    officer,
    status: 'pending',
    remindersSent: 0,
    escalated: false,
    escalationReason: '',
    ...rest,
  };
  crimes.push(crime);
  res.status(201).json(crime);
});

app.get('/api/crimes/reminders-due', (req, res) => {
  res.json(remindersDue());
});

app.get('/api/crimes/due-soon', (req, res) => {
  const days = parseInt(req.query.days || '7', 10);
  res.json(dueSoon(days));
});

app.get('/api/crimes', (req, res) => {
  const now = Date.now();
  const list = crimes.map(c => ({
    ...c,
    overdue: new Date(c.deadline).getTime() < now && c.status !== 'resolved',
  }));
  res.json(list);
});

app.get('/api/crimes/overdue', (req, res) => {
  const now = Date.now();
  const list = crimes.filter(c => isOverdue(c));
  res.json(list);
});

app.get('/api/crimes/escalated', (req, res) => {
  res.json(crimes.filter(c => c.escalated));
});

app.get('/api/crimes/station/:station', (req, res) => {
  const { station } = req.params;
  res.json(crimes.filter(c => c.station === station));
});

app.get('/api/crimes/officer/:officer', (req, res) => {
  const { officer } = req.params;
  res.json(crimes.filter(c => c.officer === officer));
});

app.get('/api/crimes/category/:category', (req, res) => {
  const { category } = req.params;
  res.json(crimes.filter(c => c.category === category));
});

app.get('/api/stats', (req, res) => {
  const total = crimes.length;
  const pending = crimes.filter(c => c.status === 'pending').length;
  const resolved = crimes.filter(c => c.status === 'resolved').length;
  const overdue = crimes.filter(isOverdue).length;
  res.json({ total, pending, resolved, overdue });
});

app.get('/api/stats/station/:station', (req, res) => {
  const { station } = req.params;
  const list = crimes.filter(c => c.station === station);
  const total = list.length;
  const pending = list.filter(c => c.status === 'pending').length;
  const resolved = list.filter(c => c.status === 'resolved').length;
  const overdue = list.filter(isOverdue).length;
  res.json({ station, total, pending, resolved, overdue });
});

app.get('/api/stats/officer/:officer', (req, res) => {
  const { officer } = req.params;
  const list = crimes.filter(c => c.officer === officer);
  const total = list.length;
  const pending = list.filter(c => c.status === 'pending').length;
  const resolved = list.filter(c => c.status === 'resolved').length;
  const overdue = list.filter(isOverdue).length;
  res.json({ officer, total, pending, resolved, overdue });
});

app.get('/api/stats/category/:category', (req, res) => {
  const { category } = req.params;
  const list = crimes.filter(c => c.category === category);
  const total = list.length;
  const pending = list.filter(c => c.status === 'pending').length;
  const resolved = list.filter(c => c.status === 'resolved').length;
  const overdue = list.filter(isOverdue).length;
  res.json({ category, total, pending, resolved, overdue });
});

app.get('/api/crimes/:id', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  res.json(crime);
});

app.put('/api/crimes/:id', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  Object.assign(crime, req.body);
  res.json(crime);
});

app.post('/api/crimes/:id/remind', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  const level = getReminderLevel(crime);
  if (level === 0) {
    return res.status(400).send('Reminder not due');
  }
  crime.remindersSent += 1;
  res.json({ reminderLevel: level, crime });
});

app.post('/api/crimes/:id/escalate', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  if (!isOverdue(crime)) {
    return res.status(400).send('Crime not overdue');
  }
  const { reason } = req.body;
  if (!reason) {
    return res.status(400).send('Reason required');
  }
  crime.escalated = true;
  crime.escalationReason = reason;
  res.json(crime);
});

app.post('/api/crimes/:id/resolve', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  crime.status = 'resolved';
  res.json(crime);
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
module.exports.resetData = resetData;
module.exports.isOverdue = isOverdue;
module.exports.dueSoon = dueSoon;
