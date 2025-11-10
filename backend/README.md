# Medisphere Backend

## Setup

1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `/controllers` - Route logic
- `/models` - Mongoose schemas
- `/routes` - Express routes
- `/middleware` - Auth, role checks
- `/config` - DB connection, etc.
- `/utils` - Helper functions

## Features
- JWT Auth
- Role-based access
- CRUD for appointments, tests, feedback, prescriptions 