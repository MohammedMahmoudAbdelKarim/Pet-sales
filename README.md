# White Helmet Dashboard

A modern Angular dashboard application for managing users, attractions, and viewing pet sales statistics.

## Features

- **User Management**
  - List users with pagination and sorting
  - Add, edit, and delete users
  - Search functionality
  - Form validation

- **Attractions Management**
  - List attractions with pagination and sorting
  - Add, edit, and delete attractions
  - Search functionality
  - Form validation

- **Pet Sales Statistics**
  - Weekly sales trend chart
  - Daily sales details
  - Date selection
  - Interactive data visualization

- **Authentication**
  - Login with JWT
  - Protected routes
  - Secure token storage
  - Automatic token injection

## Technical Stack

- Angular 19
- Angular Material
- NgxCharts
- RxJS
- TypeScript

## Project Structure

```
src/
  app/
    core/
      auth/           # Authentication related components and services
    features/
      users/          # User management feature
      attractions/    # Attractions management feature
      pet-sales/      # Pet sales statistics feature
    shared/           # Shared components and utilities
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd whitehelmet-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Development

- The application uses lazy loading for better performance
- All components are standalone
- Material Design components for consistent UI
- Responsive design for all screen sizes
- Error handling and loading states
- Form validation
- Type safety with TypeScript

## API Integration

The application integrates with the following APIs:
- User management: `/api/users/*`
- Attractions management: `/api/auth/attractions/*`
- Pet sales statistics: `/api/pets/*`

## Authentication

- JWT-based authentication
- Token stored in session storage
- HTTP interceptor for automatic token injection
- Route guards for protected routes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
