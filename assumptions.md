# Technical Assumptions

## Environment & Dependencies
- Node.js version: 21.1.0
- Libraries:
  - lucide-react for UI components and icons
  - next-auth for authentication
  - bcrypt for password encryption
  - SWR for data fetching
  - idb-keyval for offline data storage
  - uuid for unique action identification in offline mode
  - For time reasons, I have decided not to add tests.

# Business Assumptions

## Core User Capabilities
- User account creation and authentication
- Post management (create/delete)
- Post moderation (delete others' posts)
- Offline functionality:
  - Asynchronous post creation
  - Asynchronous post deletion
  - Data persistence during poor connectivity
  - Actions synced when connection restored

## System Behavior
- Posts and actions persist locally during connectivity issues
- Seamless sync once connection reestablished
- Unique identifiers maintain data integrity during offline/online transitions