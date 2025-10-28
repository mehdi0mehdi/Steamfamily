# Steam Family - Community Gaming Tools Platform

A modern, mobile-first website for sharing and discovering third-party gaming tools. Built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

- ✅ **Pure Black Steam-Inspired Theme** - Clean, accessible dark interface
- ✅ **Tool Management** - Browse, search, and download gaming tools
- ✅ **Reviews & Ratings** - Community-driven feedback with star ratings
- ✅ **Admin Panel** - Client-side tool management (visible only to admins)
- ✅ **Download Tracking** - Real-time download counters with analytics logging
- ✅ **Content Filtering** - URL blocking and bad-word replacement in reviews
- ✅ **Authentication** - Secure email/password auth via Supabase
- ✅ **Responsive Design** - Mobile-first layout that works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)

## Quick Start

### 1. Clone and Install

```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click "New Project"
4. Choose a name, database password, and region
5. Wait for the project to be created (~2 minutes)

#### Run Database Migrations

1. In your Supabase project, go to the **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `sql/001_initial_schema.sql`
4. Paste into the editor and click **Run**
5. You should see "Success. No rows returned" (this is normal)

This creates all tables (profiles, tools, reviews, downloads_log) and sets up Row Level Security policies.

#### Get Your API Credentials

1. Go to **Project Settings** → **API**
2. Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy the **anon/public** key (long string starting with `eyJ...`)

### 3. Configure Environment Variables

The Supabase credentials are already set up in your Replit Secrets. The app will automatically use:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Important**: Never commit the service_role key to version control. The anon key is safe for client-side use.

### 4. Create Your First Admin User

1. Start the development server (see below)
2. Navigate to the app and register a new account with your email
3. In Supabase SQL Editor, run:

```sql
UPDATE profiles 
SET is_admin = TRUE 
WHERE email = 'your-actual-email@example.com';
```

4. Refresh the app - you should now see an "Admin" button in the header

Alternatively, you can use the SQL from `sql/002_create_first_admin.sql` (remember to update the email).

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure

```
.
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Shadcn components
│   │   │   ├── Header.tsx
│   │   │   ├── DownloadModal.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── ToolDetail.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── ...
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configs
│   │   │   ├── supabase.ts  # Supabase client config
│   │   │   └── queryClient.ts
│   │   ├── App.tsx          # Main app with routes
│   │   └── index.css        # Global styles & theme
│   └── index.html
├── shared/
│   └── schema.ts            # TypeScript types & Zod schemas
├── sql/
│   ├── 001_initial_schema.sql    # Database migrations
│   └── 002_create_first_admin.sql
├── design_guidelines.md     # Design system documentation
└── README.md
```

## Design & Theming

The app uses a **pure black Steam-inspired theme**. All colors are defined as CSS variables in `client/src/index.css`:

### How to Change Theme Colors

```css
.dark {
  --background: 0 0% 0%;      /* Pure black background */
  --foreground: 0 0% 100%;    /* White text */
  --primary: 348 100% 55%;    /* Red accent (Steam-like) */
  --card: 0 0% 0%;            /* Card backgrounds */
  /* ... more colors ... */
}
```

See `design_guidelines.md` for the complete design system.

## Usage

### Adding Tools (Admin Panel)

1. Log in as an admin user
2. Click **Admin** in the header
3. Click **Add New Tool**
4. Fill in the form:
   - **Slug**: URL-friendly identifier (e.g., `my-awesome-tool`)
   - **Title**: Display name
   - **Descriptions**: Short and full descriptions (HTML allowed in full)
   - **Images**: Comma-separated URLs for screenshots
   - **Tags**: Comma-separated tags (e.g., `gaming, utility, mod`)
   - **Download URLs**: Primary and optional mirror links
   - **External Links**: Optional Donate and Telegram URLs
   - **Version**: Current version number
   - **Visible**: Toggle public visibility
5. Click **Create Tool**

The tool appears immediately on the homepage at `/tool/{slug}`

### Managing Reviews

**As a User:**
- Navigate to any tool page
- Log in if not already authenticated
- Click the star rating (1-5 stars)
- Write your review (min 10 characters)
- Click **Post Review**

**Content Filtering:**
- Reviews containing URLs are automatically blocked
- Bad words are replaced with `***` (configure in `client/src/lib/supabase.ts`)

**As an Admin:**
- You can view all reviews
- Use Supabase dashboard to moderate if needed

### Download Tracking

When users click **Download** or **Mirror**:
1. A modal appears with the download option and external links (Donate, Telegram)
2. Upon confirmation:
   - Download count increments in real-time
   - Event is logged to `downloads_log` table
   - User is redirected to the download URL

## Content Filtering

### URL Blocking

Reviews cannot contain URLs. This is enforced both client-side and server-side:

- **Client**: Regex `/(https?:\/\/|www\.)/i` in `ReviewForm.tsx`
- **Server**: PostgreSQL RLS policy in `001_initial_schema.sql`

### Bad Words

Configure the bad words list in `client/src/lib/supabase.ts`:

```typescript
export const badWords = [
  'badword1',
  'badword2',
  // Add your words here
];
```

Matched words are replaced with `***` before saving to the database.

## Database Schema

### Tables

- **profiles**: User accounts with admin flags
- **tools**: Gaming tools/utilities
- **reviews**: User reviews and ratings (1-5 stars)
- **downloads_log**: Download tracking for analytics

### Row Level Security (RLS)

- ✅ **Tools**: Only admins can create/update/delete
- ✅ **Reviews**: Only authenticated users can post; server-side URL/bad-word checks
- ✅ **Downloads**: Anyone can log downloads (even anonymous users)
- ✅ **Profiles**: Users can only update their own profile

All policies are defined in `sql/001_initial_schema.sql`.

## Testing

### Manual Testing Checklist

- [ ] Homepage loads with tool grid
- [ ] Tool detail page displays correctly (no white screen, no content overflow)
- [ ] Register new account
- [ ] Login with existing account
- [ ] Post a review (with valid content)
- [ ] Try posting review with URL (should be blocked)
- [ ] Download a tool (count should increment)
- [ ] Admin can access admin panel
- [ ] Non-admin cannot access admin panel
- [ ] Admin can create/edit/delete tools
- [ ] Changes appear immediately without code edits

### Browser Testing

Recommended browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Switching Environments

### Test Database → Production Database

1. Create a separate Supabase project for production
2. Run the same SQL migrations (`sql/001_initial_schema.sql`)
3. Update environment variables in Replit Secrets:
   - `VITE_SUPABASE_URL` → production URL
   - `VITE_SUPABASE_ANON_KEY` → production anon key
4. Restart the app
5. Create admin users in production database

### Local Development

For local development with a test database:

```bash
# Create a .env.local file
VITE_SUPABASE_URL=https://your-test-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-test-anon-key
```

## Security Notes

- ✅ Never commit `service_role` keys
- ✅ Anon/public keys are safe for client-side use
- ✅ All sensitive operations protected by RLS policies
- ✅ Content filtering prevents spam and malicious links
- ✅ SQL injection prevented by Supabase's query builder

## Troubleshooting

### "Missing Supabase environment variables"

- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Replit Secrets
- Restart the app after adding secrets

### Tool pages show white screen

- Check browser console for errors
- Verify the tool slug exists in the database
- Ensure `visible` is set to `true` for the tool
- Check Supabase logs for RLS policy issues

### Admin panel not visible

- Verify your user has `is_admin = TRUE` in the `profiles` table
- Run the SQL query from `sql/002_create_first_admin.sql`
- Log out and log back in

### Reviews not posting

- Ensure user is authenticated
- Check review doesn't contain URLs
- Verify review is 10-2000 characters
- Check rating is 1-5 stars
- Look at browser console and Supabase logs

### Download count not incrementing

- Check if `increment_downloads` function exists in Supabase
- Verify RLS policies allow downloads_log inserts
- Check browser network tab for API errors

## Contributing

This is a community platform. To add features or report bugs:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feature requests, please use the GitHub Issues page or contact through community channels.

---

**Built with ❤️ for the gaming community**

// TypeScript must be compiled to JavaScript before publishing to GitHub Pages. Use 'npx tsc' or 'npm run build'.
// Supabase anon key and URL are public client values — put them in config.js or .env and do not commit service_role keys.
// Admin panel visible only to admins — implementer: ensure Supabase RLS/policies protect admin writes.
// Linkless reviews: client uses regex /(https?:\/\/|www\.)/i to reject URLs. Server policies also reject them.
// Configurable badWords array in code/DB — sanitize before saving (replace with '***').
// Tool pages must be directories with index.html so URLs are /tool/<slug>/.
