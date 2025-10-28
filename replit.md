# Steam Family - Community Gaming Tools Platform

## Overview

Steam Family is a mobile-first web application for sharing and discovering third-party gaming tools. The platform enables users to browse tools, submit reviews, track downloads, and manage content through an admin panel. Built with modern web technologies, it emphasizes a Steam-inspired dark theme aesthetic with robust content moderation features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running in a Single Page Application (SPA) model using Vite as the build tool and development server.

**Routing**: Uses Wouter for client-side routing with page-based navigation structure:
- Home page for browsing tools
- Tool detail pages accessed via slug-based URLs (`/tool/:slug`)
- Authentication pages (login/register)
- Admin panel for content management
- Static pages (privacy, terms)

**State Management**: TanStack Query (React Query) handles server state, caching, and data synchronization. No global client state management beyond React Query's cache. Authentication state managed through a custom `AuthProvider` context.

**UI Components**: Built on Radix UI primitives with Shadcn UI design system. Uses Tailwind CSS for styling with a pure black theme (#000000) and custom CSS variables for theming. Design follows Steam's industrial gaming aesthetic with card-based layouts.

**Form Handling**: React Hook Form with Zod validation schemas for type-safe form validation and submission.

**Design System**: 
- Custom color system using HSL values with CSS variables
- Spacing based on Tailwind's default scale (4, 6, 8, 12, 16, 20, 24)
- Typography using Inter font family from Google Fonts
- Mobile-first responsive breakpoints (768px tablet, 1024px desktop)

### Backend Architecture

**Server Framework**: Express.js serving both API endpoints and the compiled frontend application.

**Development Mode**: Vite middleware integration for hot module replacement during development. The Express server runs with Vite in middleware mode, allowing seamless development experience.

**Production Mode**: Serves pre-built static assets from the `dist/public` directory. Server-side logic compiled separately using esbuild.

**Storage Layer**: The codebase includes a storage interface (`IStorage`) with an in-memory implementation (`MemStorage`), but the actual data operations are handled directly through Supabase client calls in components. The server routes file is currently empty, suggesting API operations are client-side only through Supabase.

**Middleware**: 
- JSON body parsing with raw body capture for webhook handling
- Request/response logging for API routes
- CORS and static file serving in production

### Database Design

**ORM**: Drizzle ORM with PostgreSQL schema definitions. Configuration set up for migrations but actual database is hosted on Supabase.

**Schema Structure**:

1. **Profiles Table**: User accounts with admin flags
   - Links to Supabase Auth users via UUID
   - Stores display names, avatar URLs, admin status
   - Created timestamp tracking

2. **Tools Table**: Gaming utilities catalog
   - Unique slug for URL-friendly identification
   - Rich content (short/full descriptions, images array, tags array)
   - Download/mirror/donate/telegram URLs
   - Version tracking and visibility toggle
   - Download counter for analytics

3. **Reviews Table**: User feedback system
   - Foreign keys to both tools and profiles with cascade deletion
   - Integer rating system (1-5 stars)
   - Text body for review content
   - Timestamp for sorting/display

4. **Downloads Log Table**: Analytics tracking
   - Captures download events per tool
   - Optional user association (nullable for anonymous downloads)
   - IP hash for duplicate prevention
   - Timestamp for analytics

**Relationships**: 
- Tools have many reviews (one-to-many)
- Users have many reviews (one-to-many)
- Tools have many download logs (one-to-many)
- Cascade deletion ensures referential integrity

### Authentication & Authorization

**Provider**: Supabase Auth handles all authentication flows (email/password).

**Client Integration**: Custom `useAuth` hook provides authentication context throughout the application. Session management handled automatically by Supabase client.

**Authorization Model**:
- Admin flag stored in profiles table determines access to admin panel
- Row Level Security (RLS) policies expected to be configured in Supabase (referenced in comments but not defined in codebase)
- Client-side route protection via React context
- Admin panel UI elements conditionally rendered based on `isAdmin` flag

**Security Considerations**:
- Supabase anon key used for client-side operations (safe for public exposure)
- RLS policies should restrict write operations to admins
- Content moderation applied client-side before submission

### Content Moderation

**URL Filtering**: Regex pattern `/(https?:\/\/|www\.)/i` blocks URLs in review submissions. Enforced client-side with expectation of server-side validation via Supabase policies.

**Bad Word Replacement**: Configurable array of words replaced with `***` before saving. Implementation uses regex with global case-insensitive matching. Client-side sanitization with assumption of additional server-side checks.

**Design Rationale**: Client-side filtering provides immediate user feedback, while server-side policies (via Supabase RLS) prevent bypass attempts.

### Download Tracking

**Dual System**:
1. **Counter Increment**: Direct updates to `tools.downloads` field for display
2. **Analytics Log**: Separate `downloads_log` entries with user/IP tracking

**Flow**: When user clicks download, modal presents confirmation with additional CTAs (donate, telegram). Upon confirmation, both counter and log are updated via Supabase mutations.

**Anonymous Tracking**: IP hashing allows duplicate prevention without storing full IP addresses. User ID is optional to support anonymous downloads.

## External Dependencies

### Primary Services

**Supabase**: Backend-as-a-Service providing:
- PostgreSQL database hosting
- Authentication and user management
- Row Level Security for authorization
- Real-time subscriptions (not currently utilized)
- Configured via environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### UI Libraries

**Radix UI**: Unstyled accessible component primitives for:
- Dialogs, dropdowns, popovers
- Form controls (checkbox, radio, select, switch)
- Navigation components
- Tooltip, toast notifications
- All interactive UI patterns

**Shadcn UI**: Pre-built component library built on Radix, customized through `components.json` configuration

**Lucide React**: Icon library for consistent iconography throughout the application

### Development Tools

**Vite**: Frontend build tool and development server with React plugin
- Custom alias configuration for import paths (`@/`, `@shared/`, `@assets/`)
- Development plugins for Replit integration (cartographer, dev-banner)
- Runtime error overlay for development experience

**TypeScript**: Type safety across entire codebase with strict mode enabled
- Shared types between client and server via `@shared` alias
- Path mapping in tsconfig for clean imports

**Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- Custom configuration for Steam-inspired theme
- Extended color palette with HSL variables
- Custom border radius values

### Data Management

**TanStack Query**: Server state management with:
- Automatic caching and refetching
- Optimistic updates
- Query invalidation on mutations
- Infinite stale time (manual cache control)

**React Hook Form**: Form state management with Zod schema validation integration

**Drizzle ORM**: TypeScript ORM for:
- Type-safe database queries
- Schema definitions and migrations
- Zod schema generation for validation

### Runtime Dependencies

**date-fns**: Date formatting and manipulation for timestamps and relative time display

**Wouter**: Lightweight React router (alternative to React Router)

**class-variance-authority (CVA)**: Component variant management for design system

**clsx + tailwind-merge**: Class name composition utilities via `cn()` helper

### Build Dependencies

**esbuild**: Server-side code bundling for production builds

**tsx**: TypeScript execution for development server runtime