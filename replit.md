# EduPlatform - Online Course Selling Website

## Overview

EduPlatform is a comprehensive online education platform built for selling and managing courses. The application features a modern, dark-themed interface with a green accent color (#62bf00) and provides a complete course marketplace experience. It includes user authentication with email OTP verification, course browsing and enrollment, checkout functionality, and essential business pages. The platform is designed to serve different user types including distributors, retailers, and general users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built using React with TypeScript and follows a component-based architecture:

- **Framework**: React 18 with Vite as the build tool and development server
- **Routing**: Wouter for client-side routing with route protection for authenticated pages
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom CSS variables for theming, implementing a dark theme with #000000 background and #62bf00 accent color
- **State Management**: TanStack Query for server state management with optimistic updates and caching
- **Authentication**: Context-based auth provider with session management

### Backend Architecture
The server follows a RESTful API architecture with Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **Authentication**: Passport.js with local strategy using email/password, session-based authentication with PostgreSQL session store
- **Password Security**: Crypto module with scrypt for secure password hashing and comparison
- **API Design**: RESTful endpoints for courses, users, orders, contacts, and authentication

### Data Storage Solutions
Database architecture uses PostgreSQL with Drizzle ORM:

- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema Design**: 
  - Users table with email verification, user types (distributor/retailer/other), and profile information
  - Courses table with pricing, descriptions, curriculum, and metadata
  - OTP table for email verification with expiration and usage tracking
  - Enrollments table for course registrations
  - Orders table for purchase tracking
  - Contacts table for form submissions
- **Migrations**: Drizzle Kit for database migrations and schema evolution

### Authentication and Authorization
Multi-layered security approach:

- **Session Management**: Express sessions with PostgreSQL store for persistence
- **Email Verification**: OTP-based email verification system integrated with Brevo (formerly Sendinblue) API
- **Password Security**: Salted password hashing using Node.js crypto module
- **Route Protection**: Frontend route guards for authenticated-only pages like checkout
- **User Types**: Support for different user categories (distributor, retailer, other) for potential role-based features

## External Dependencies

### Third-Party Services
- **Brevo API**: Email service for OTP delivery and transactional emails with configured sender email
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support for real-time connections

### Payment Integration
- **Payment Gateway**: Placeholder implementation showing "Payment gateway integration pending" popup, designed for future integration with Indian payment providers

### Development and Deployment
- **Replit Integration**: Configured with Replit-specific Vite plugins for development environment
- **Environment Configuration**: Supports both development and production modes with appropriate optimizations
- **Build Process**: Vite for frontend bundling, esbuild for backend compilation to ESM format

### UI and Design Dependencies
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Lucide React**: Icon system for consistent visual elements
- **Tailwind CSS**: Utility-first CSS framework with custom color scheme
- **Google Fonts**: Inter font family for modern typography