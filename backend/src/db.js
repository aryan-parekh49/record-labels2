const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function createDb(file = ':memory:') {
  const db = new sqlite3.Database(file);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS crimes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      heading TEXT,
      station TEXT,
      officer TEXT,
      penalCode TEXT,
      status TEXT,
      reportedAt TEXT,
      deadline TEXT,
      remindersSent INTEGER,
      escalated INTEGER,
      escalationReason TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crimeId INTEGER,
      text TEXT,
      createdAt TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS penal_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE,
      description TEXT,
      days INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT,
      role TEXT
    )`);
  });
  return db;
}

module.exports = { createDb };
