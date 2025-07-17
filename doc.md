# Replit.md - Pharmacy Management System

## Overview

This is a full-stack pharmacy management system built with React, Express, and PostgreSQL. The application provides comprehensive inventory management, sales tracking, customer management, and reporting capabilities for pharmacy operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Pattern**: RESTful API with Express routes

### Database Schema Design
The system uses a relational database with four main entities:
- **Medicines**: Core inventory items with supplier relationships
- **Customers**: Customer information and purchase history
- **Suppliers**: Vendor management and contact information
- **Sales**: Transaction records with line items

## Key Components

### Data Layer
- **Drizzle ORM**: Type-safe database queries and migrations
- **Schema Definition**: Centralized in `/shared/schema.ts` for type sharing
- **Storage Interface**: Abstracted data access layer in `/server/storage.ts`
- **Validation**: Zod schemas for runtime type checking

### API Layer
- **Express Routes**: RESTful endpoints for CRUD operations
- **Error Handling**: Centralized error middleware
- **Request Logging**: Custom middleware for API request tracking
- **Type Safety**: Shared types between frontend and backend

### Frontend Components
- **Layout System**: Sidebar navigation with responsive design
- **Modal System**: Reusable modal components for forms
- **Data Tables**: Paginated tables with search and filtering
- **Dashboard**: Statistics and overview widgets
- **Form Components**: Validated forms with error handling

## Data Flow

1. **User Interaction**: User interacts with React components
2. **Form Submission**: React Hook Form validates data using Zod schemas
3. **API Request**: TanStack Query manages HTTP requests to Express API
4. **Database Operation**: Express routes use Drizzle ORM for database operations
5. **Response Handling**: API responses update React Query cache
6. **UI Update**: Components re-render with fresh data

### Key Data Flows
- **Inventory Management**: Add/edit medicines, track stock levels, supplier relationships
- **Sales Processing**: Create sales transactions, update inventory, customer records
- **Search & Filtering**: Real-time search across medicines, customers, suppliers
- **Dashboard Analytics**: Aggregate queries for sales statistics and low stock alerts

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking
- **tsx**: TypeScript execution for server
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development
- **Server**: Node.js with tsx for hot reloading
- **Client**: Vite development server with HMR
- **Database**: Neon Database with connection pooling
- **Environment**: Local development with DATABASE_URL

### Production
- **Build Process**: 
  - Frontend: Vite builds to `dist/public`
  - Backend: esbuild bundles server to `dist/index.js`
- **Deployment**: Single process serving both API and static files
- **Database**: Production PostgreSQL via Neon Database
- **Environment Variables**: DATABASE_URL required for database connection

### Key Architectural Decisions

1. **Shared Type System**: Types defined in `/shared/schema.ts` ensure consistency between frontend and backend
2. **Drizzle ORM**: Chosen for type safety and migration management over raw SQL
3. **TanStack Query**: Provides robust caching and synchronization for server state
4. **Monorepo Structure**: Single repository with clear separation of concerns
5. **PostgreSQL**: Relational database chosen for ACID compliance and complex queries
6. **Component Library**: shadcn/ui provides consistent, accessible components
7. **Validation Strategy**: Zod schemas shared between client and server validation

The architecture prioritizes type safety, developer experience, and maintainability while providing a scalable foundation for pharmacy management operations.