const express = require('express');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret123';
const app = express();
app.use(express.json());

let users = [{ username: 'admin', password: 'password', role: 'dcp' }];

function generateToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, SECRET);
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send('Invalid credentials');
  res.json({ token: generateToken(user) });
});

app.post('/users', (req, res) => {
  const { username, password, role = 'pi' } = req.body;
  if (!username || !password) return res.status(400).send('username and password required');
  if (users.find(u => u.username === username)) return res.status(400).send('exists');
  const user = { username, password, role };
  users.push(user);
  res.status(201).json({ username, role });
});

app.get('/users', (req, res) => {
  res.json(users.map(u => ({ username: u.username, role: u.role })));
});

function reset() {
  users = [{ username: 'admin', password: 'password', role: 'dcp' }];
}

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Auth service running on port ${port}`));
}

module.exports = app;
module.exports.reset = reset;
