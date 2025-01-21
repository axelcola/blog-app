# Project Assumptions

1. **Database**
   - Using SQLite for simplicity and portability
   - Database file is stored locally
   - Initial data is seeded from JSONPlaceholder API

2. **User Interface**
   - Mobile-first design with responsive layout
   - Simple card-based UI for posts
   - Minimal styling using Tailwind CSS
   - Confirmation dialog for post deletion

3. **Error Handling**
   - Simple error messages displayed at the top of the page
   - Network errors are caught and displayed to users
   - Basic error state management using React useState

4. **Performance**
   - Client-side filtering for user selection
   - No pagination implemented (could be added for performance with large datasets)
   - Basic error retry mechanism not implemented (could be added for unstable connections)

5. **Browser Support**
   - Modern browsers only (Chrome, Firefox, Safari, Edge)
   - No IE11 support

6. **Data Storage**
   - No caching implemented (could be added using Service Workers)
   - No offline support (could be added for better experience with unstable connections)

7. **UI Library** 
    - MUI