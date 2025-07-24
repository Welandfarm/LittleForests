# LittleForest - Seedling E-commerce Platform

## Overview

LittleForest is a full-stack web application for an online seedling nursery business. The application provides a modern e-commerce experience for browsing and ordering tree seedlings, with admin functionality for content and product management. Built with React frontend, Express backend, and PostgreSQL database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Context API for authentication and cart state
- **Data Fetching**: TanStack React Query for server state management
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: TSX for development server with hot reload
- **Production**: ESBuild for server bundling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Located in `shared/schema.ts` for type sharing
- **Connection**: WebSocket-enabled connection pool using @neondatabase/serverless

## Key Components

### Authentication System
- Supabase-based authentication with email/password
- Role-based access control (admin/user roles)
- Session management with persistent login state
- Protected routes for admin functionality

### E-commerce Features
- Product catalog with category filtering (Indigenous Trees, Ornamental Trees, Fruit Trees)
- Shopping cart functionality with local state management
- WhatsApp integration for order placement
- Product image management with Supabase storage

### Admin Dashboard
- Product management (CRUD operations)
- Content management system for dynamic page content
- Contact message handling
- User management with role assignment
- Image upload functionality

### UI Components
- Comprehensive shadcn/ui component library
- Responsive design with mobile-first approach
- Carousel components for product display
- Modal dialogs and sidebars for enhanced UX

## Data Flow

1. **Client Requests**: React frontend makes API calls through TanStack Query
2. **Server Processing**: Express server handles requests with proper middleware
3. **Database Operations**: Drizzle ORM executes type-safe database queries
4. **Response Handling**: Server returns JSON responses with error handling
5. **State Updates**: React Query manages cache invalidation and UI updates

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless with connection pooling
- **Authentication**: Supabase for user management and auth
- **UI Framework**: Radix UI primitives with shadcn/ui styling
- **Image Storage**: Supabase Storage for file uploads
- **Communication**: WhatsApp Business API integration for orders

### Development Tools
- **Build Tool**: Vite for frontend bundling with HMR
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Environment variable configuration for database and API keys
- PostgreSQL module provisioning through Replit

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single-server deployment serving both API and static files

### Environment Configuration
- Database URL for PostgreSQL connection
- Supabase configuration for authentication and storage
- WhatsApp API credentials for order processing

### Hosting Strategy
- Replit autoscale deployment target
- Port 5000 for development, port 80 for production
- Static file serving with Express for production builds

## Changelog
- June 24, 2025. Initial setup
- June 24, 2025. Added honey product category with admin management
- June 24, 2025. Updated homepage messaging and styling with orange accents
- June 24, 2025. Fixed image upload functionality with proper payload limits
- June 26, 2025. Successfully migrated from Supabase to PostgreSQL database
- June 26, 2025. Fixed image upload mapping between database schema and frontend forms
- June 26, 2025. Updated homepage background with authentic nursery photo
- June 26, 2025. Implemented secure admin authentication system with bcrypt password hashing
- June 26, 2025. Created hidden admin login at /admin-login accessible only to wesleykoech2022@gmail.com and chepkoechjoan55@gmail.com
- June 26, 2025. Added clean public interface that hides all admin access when not logged in
- June 26, 2025. Migrated from PostgreSQL back to Supabase for better scalability and deployment flexibility
- June 30, 2025. Successfully migrated from Replit Agent to Replit environment with full functionality
- June 30, 2025. Updated homepage background with new nursery photo showing seedling cultivation
- June 30, 2025. Improved "Available" button styling from black to white background with black text
- June 30, 2025. Added clickable WhatsApp contact links throughout the application for better user engagement
- June 30, 2025. Updated WhatsApp message templates for order and contact buttons to use simplified, professional language
- July 17, 2025. Successfully migrated from PostgreSQL to Supabase database for better integration flexibility
- July 17, 2025. Configured API integration endpoints for Vercel dashboard to manage public website inventory
- July 17, 2025. Set up cross-platform integration between Replit admin app and Vercel dashboard analytics
- July 17, 2025. Successfully migrated from Replit Agent to Replit environment with proper inventory integration
- July 17, 2025. Successfully migrated from Replit Agent to Replit environment with full functionality
- July 17, 2025. Configured Supabase integration with provided credentials for authentication and data storage
- July 17, 2025. Seeded database with sample products (6 tree seedlings), content, and testimonials
- July 17, 2025. Fixed critical integration issue - website now displays real inventory from Vercel dashboard API
- July 17, 2025. Implemented data transformation layer to convert Vercel API format to frontend-compatible format
- July 17, 2025. Achieved real-time inventory synchronization between Vercel dashboard and public website
- July 24, 2025. Successfully completed migration from Replit Agent to Replit environment with enhanced security
- July 24, 2025. Fixed inventory filtering to properly hide products marked as "not ready for sale" in Vercel dashboard
- July 24, 2025. Improved database schema synchronization and resolved TypeScript errors for clean execution
- July 24, 2025. Successfully completed migration from Replit Agent to Replit environment with enhanced security
- July 24, 2025. Fixed inventory filtering to properly hide products marked as "not ready for sale" in Vercel dashboard
- July 24, 2025. Improved database schema synchronization and resolved TypeScript errors for clean execution
- July 24, 2025. Optimized product image display with square aspect ratio, object-cover styling, and 4-product grid layout for professional e-commerce appearance

## User Preferences

Preferred communication style: Simple, everyday language.