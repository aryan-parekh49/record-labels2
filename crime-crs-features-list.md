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
- Station assignment for crimes and per-station queries
- Officer assignment for crimes and per-officer queries
- Officer-specific statistics endpoint
- Statistics endpoint summarizing pending, resolved, and overdue counts
- Station-specific statistics endpoint
- Category filtering for crimes and category-specific statistics
- Notes can be added to crimes for additional context
- Separate evidence management service for uploading and deleting evidence

## System Overview
The code runs as a set of small Express services with in-memory storage and Jest tests for key features.
