const express = require('express');
const { createDb } = require('./db');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');

const app = express();
app.use(express.json());

const dbFile = process.env.DB_FILE || path.join(__dirname, '../data/crime.sqlite');
const db = createDb(dbFile);
const SECRET = process.env.JWT_SECRET || 'secret123';
const users = [{ username: 'admin', password: 'password', role: 'dcp' }];

function auth(req, res, next) {
  if (req.path === '/api/login') return next();
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).send('No token');
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (e) {
    res.status(401).send('Invalid token');
  }
}

app.use(auth);
app.broadcast = () => {};

function loadData() {
  if (!fs.existsSync(dbFile)) return;
  crimes = [];
  db.all('SELECT * FROM crimes', [], (err, rows) => {
    if (!err) {
      crimes = rows.map(r => ({ ...r, notes: [] }));
      crimes.forEach(c => {
        db.all('SELECT * FROM notes WHERE crimeId = ?', [c.id], (e, notes) => {
          if (!e) c.notes = notes;
        });
      });
      nextId = crimes.reduce((m, c) => Math.max(m, c.id), 0) + 1;
    }
  });
}

function saveCrime(crime) {
  const stmt = db.prepare(`INSERT INTO crimes (id, category, heading, station, officer, status, reportedAt, deadline, remindersSent, escalated, escalationReason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(crime.id, crime.category, crime.heading, crime.station, crime.officer, crime.status, crime.reportedAt, crime.deadline, crime.remindersSent, crime.escalated ? 1 : 0, crime.escalationReason);
}

function updateCrimeDb(crime) {
  const stmt = db.prepare(`UPDATE crimes SET category=?, heading=?, station=?, officer=?, status=?, reportedAt=?, deadline=?, remindersSent=?, escalated=?, escalationReason=? WHERE id=?`);
  stmt.run(crime.category, crime.heading, crime.station, crime.officer, crime.status, crime.reportedAt, crime.deadline, crime.remindersSent, crime.escalated ? 1 : 0, crime.escalationReason, crime.id);
}

function deleteCrimeDb(id) {
  db.run('DELETE FROM crimes WHERE id=?', [id]);
  db.run('DELETE FROM notes WHERE crimeId=?', [id]);
}

function addNoteDb(crimeId, note) {
  const stmt = db.prepare(`INSERT INTO notes (crimeId, text, createdAt) VALUES (?, ?, ?)`);
  stmt.run(crimeId, note.text, note.createdAt);
}

const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_DEADLINE_DAYS = {
  default: 60,
  'Serious Crime': 90,
  'Minor Offense': 30,
};

let crimes = [];
let nextId = 1;

function addNote(crime, text) {
  const note = { id: crime.notes.length + 1, text, createdAt: new Date().toISOString() };
  crime.notes.push(note);
  addNoteDb(crime.id, note);
  return note;
}

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
  db.exec('DELETE FROM crimes');
  db.exec('DELETE FROM notes');
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send('Invalid credentials');
  const token = jwt.sign({ username: user.username, role: user.role }, SECRET);
  res.json({ token });
});

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
    notes: [],
    ...rest,
  };
  crimes.push(crime);
  saveCrime(crime);
  app.broadcast('crime-created', crime);
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
  updateCrimeDb(crime);
  app.broadcast('crime-updated', crime);
  res.json(crime);
});

app.delete('/api/crimes/:id', (req, res) => {
  const index = crimes.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send('Not Found');
  }
  const [removed] = crimes.splice(index, 1);
  deleteCrimeDb(removed.id);
  app.broadcast('crime-deleted', removed);
  res.json(removed);
});

app.get('/api/crimes/:id/notes', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  res.json(crime.notes);
});

app.post('/api/crimes/:id/notes', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  const { text } = req.body;
  if (!text) {
    return res.status(400).send('Text required');
  }
  const note = addNote(crime, text);
  res.status(201).json(note);
});

app.delete('/api/crimes/:id/notes/:noteId', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  const index = crime.notes.findIndex(n => n.id === parseInt(req.params.noteId));
  if (index === -1) {
    return res.status(404).send('Not Found');
  }
  const [removed] = crime.notes.splice(index, 1);
  db.run('DELETE FROM notes WHERE id=?', [removed.id]);
  res.json(removed);
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
  updateCrimeDb(crime);
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
  updateCrimeDb(crime);
  app.broadcast('crime-escalated', crime);
  res.json(crime);
});

app.post('/api/crimes/:id/resolve', (req, res) => {
  const crime = crimes.find(c => c.id === parseInt(req.params.id));
  if (!crime) {
    return res.status(404).send('Not Found');
  }
  crime.status = 'resolved';
  updateCrimeDb(crime);
  app.broadcast('crime-resolved', crime);
  res.json(crime);
});

if (require.main === module) {
  loadData();
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => console.log(`Server running on port ${port}`));
  const wss = new WebSocket.Server({ server, path: '/ws' });
  function broadcast(event, payload) {
    const msg = JSON.stringify({ event, payload });
    wss.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(msg));
  }
  app.broadcast = broadcast;
}

module.exports = app;
module.exports.resetData = resetData;
module.exports.isOverdue = isOverdue;
module.exports.dueSoon = dueSoon;
module.exports.loadData = loadData;
