# Crime CRS Feature Reference

This document summarizes key capabilities implemented in this prototype.

## Core Features
- CRUD operations for crime records
- Deletion of crime records
- Automatic resolution deadlines based on heading
- Overdue detection and listing
- Reminder tracking with three-stage reminders
- Listing upcoming deadlines with a due-soon query
- Escalation of overdue crimes with reason logging
- Persistent SQLite database storage
- JWT-based login and protected routes
- WebSocket notifications for updates
- Station assignment for crimes and per-station queries
- Officer assignment for crimes and per-officer queries
- Officer-specific statistics endpoint
- Statistics endpoint summarizing pending, resolved, and overdue counts
- Station-specific statistics endpoint
- Category filtering for crimes and category-specific statistics
- Notes can be added to crimes for additional context
- Separate evidence management service for uploading and deleting evidence
- Evidence service maintains a hash chain for integrity

## System Overview
The system runs as multiple Express services with SQLite persistence. Authentication tokens protect the APIs and WebSocket connections deliver real-time events. Unit tests cover the critical features.
