# Next.js Blog Application

A modern blogging platform built with Next.js featuring offline support and queue management for poor internet connections.

## Features

- User authentication
- Post creation and deletion
- Offline support with action queueing
- Real-time updates
- Responsive design

## Offline Support

The application features offline support through action queueing:
- Actions are stored locally when offline
- Automatically syncs when connection is restored
- Provides real-time status updates

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
# When prompted, name your migration (e.g., "initial")
npx prisma db seed
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Creating a User

To create a new user account:

1. Fill in the required fields:
   - Username
   - Email (e.g., email@mail.com)
   - Any password

