# Crime CRS Feature Reference

This document summarizes key capabilities implemented in this prototype.

## Core Features
- CRUD operations for crime records
- Automatic resolution deadlines based on heading
- Overdue detection and listing
- Reminder tracking with three-stage reminders
- Escalation of overdue crimes with reason logging
- Station assignment for crimes and per-station queries
- Officer assignment for crimes and per-officer queries
- Statistics endpoint summarizing pending, resolved, and overdue counts
- Station-specific statistics endpoint
- Category filtering for crimes and category-specific statistics

## System Overview
The code is intentionally lightweight and runs as a single Express service. It stores data in memory for demonstration and includes Jest tests for main workflows.
