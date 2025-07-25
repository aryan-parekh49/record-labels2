# Crime CRS Feature Reference

This document summarizes key capabilities implemented in this prototype.

## Core Features
- CRUD operations for crime records
- Deletion of crime records
- Automatic resolution deadlines based on heading
- Overdue detection and listing
- Reminder tracking with three-stage reminders
 - Offline-capable frontend via service worker
- Light and dark theme toggle
- Evidence management UI with evidence add/list/delete
- Notification center using WebSocket updates
=======
   
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
 - Penal code management with custom deadline days
- Status filtering with `/api/crimes/status/:status` and status count endpoint
- Notes can be added to crimes for additional context
- User management endpoints for creating, listing, updating and deleting users
=======
- Notes can be added to crimes for additional context
 - Separate evidence management service for uploading and deleting evidence
- Evidence service maintains a hash chain for integrity

## System Overview
The system runs as multiple Express services with SQLite persistence. Authentication tokens protect the APIs and WebSocket connections deliver real-time events. Unit tests cover the critical features.
