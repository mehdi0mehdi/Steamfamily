# Steam Family Design Guidelines

## Design Approach

**Reference-Based Approach: Steam Platform Aesthetic**

Drawing inspiration from Steam's iconic interface while creating a distinct identity for Steam Family. The design balances utility (tool browsing, reviews, downloads) with visual appeal (gaming culture, dark aesthetic).

**Key Design Principles:**
- Industrial gaming aesthetic with pure black base (#000000)
- Information hierarchy through subtle gradients and borders
- Card-based layouts with clear content boundaries
- Functional minimalism - every element serves a purpose

---

## Typography System

**Font Stack:**
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts CDN)
- Monospace: 'JetBrains Mono', monospace (for version numbers, technical info)

**Type Scale:**
- Hero/Page Titles: text-4xl md:text-5xl, font-bold (36px/48px)
- Section Headers: text-2xl md:text-3xl, font-semibold (24px/30px)
- Tool Titles: text-xl md:text-2xl, font-semibold (20px/24px)
- Body Text: text-base, font-normal (16px)
- Small Text/Meta: text-sm (14px)
- Micro Text: text-xs (12px)

**Hierarchy Rules:**
- All headings use semibold or bold weights
- Body text maintains normal weight for readability
- Technical information (versions, dates) use monospace

---

## Layout & Spacing System

**Tailwind Spacing Primitives:**
Primary units: **2, 4, 6, 8, 12, 16, 20, 24**

**Spacing Applications:**
- Component padding: p-4 (mobile), p-6 (tablet), p-8 (desktop)
- Section vertical spacing: py-12 (mobile), py-16 (tablet), py-20 (desktop)
- Card gaps: gap-4 (mobile), gap-6 (desktop)
- Element margins: mb-2, mb-4, mb-6 for vertical rhythm

**Grid System:**
- Tool Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature Grid: grid-cols-1 md:grid-cols-2
- Review Layout: Single column stack for readability
- Admin Form: grid-cols-1 md:grid-cols-2 for paired inputs

**Container Widths:**
- Main content: max-w-7xl (1280px)
- Text content: max-w-4xl (896px)
- Forms: max-w-2xl (672px)

---

## Component Library

### Header/Navigation
- Fixed top header with pure black (#000000) background
- Height: h-16 (64px)
- Logo/title left-aligned with text-xl font-semibold
- Auth buttons right-aligned (Login/Register icons via Font Awesome)
- Subtle bottom border (1px, rgba(255,255,255,0.1))

### Tool Cards (Home Page Grid)
- Pure black background with subtle border (rgba(255,255,255,0.1))
- Rounded corners: rounded-lg
- Hover state: subtle scale transform (scale-105) with border glow effect
- Structure: Screenshot thumbnail top, title, short description, metadata row (downloads, rating)
- Padding: p-4 with internal spacing using gap-3
- Aspect ratio for thumbnail: aspect-video

### Tool Detail Page Layout
- Two-column layout on desktop (lg:grid-cols-3): 
  - Left 2 cols: Main content (screenshots carousel, full description)
  - Right 1 col: Sticky sidebar (download buttons, metadata)
- Mobile: Full-width stack
- Screenshots carousel: Full-width with navigation dots, rounded-lg borders
- Content card: Pure black background, p-6 md:p-8, rounded-lg
- No content overflow - all text uses break-words and proper container constraints

### Download/CTA Buttons
**Primary Download Button:**
- Large size: px-8 py-4, text-lg font-semibold
- Gradient background (Steam-inspired): linear-gradient from emerald to teal
- Full rounded: rounded-lg
- Width: w-full on mobile, auto on desktop
- Icon left-aligned (download icon from Font Awesome)

**Secondary Mirror Button:**
- Same size as primary
- Outline style: border-2 with hover fill
- Transparent background with border glow on hover

**Tertiary Buttons (Donate, Telegram):**
- Smaller: px-6 py-3
- Different accent gradients (Donate: amber/orange, Telegram: blue/cyan)
- Icons included

**Important:** When buttons appear over images, add backdrop-blur-md and bg-black/40 for legibility

### Modal/Popup (Download CTA Modal)
- Centered overlay with backdrop blur (backdrop-blur-sm bg-black/60)
- Modal card: max-w-lg, rounded-xl, p-8
- Pure black background with subtle border
- Title at top (text-2xl font-bold), explanation text, all CTA buttons stacked
- Close button (X icon) top-right corner
- Smooth fade-in animation (transition-opacity duration-300)

### Review Cards
- Individual review: border-b last:border-b-0
- Padding: py-4
- Structure: Top row (user avatar, name, star rating, date), body text below
- Star display: Filled/empty stars using Font Awesome icons
- User avatar: rounded-full, w-10 h-10
- Text uses break-words to prevent overflow

### Review Form
- Full-width on mobile, max-w-2xl on desktop
- Star rating input: Large clickable stars (text-3xl) with hover preview
- Textarea: min-h-32, rounded-lg, p-4
- Character count indicator (text-sm) below textarea
- Submit button: Full-width on mobile
- Error messages: Text-sm with red accent, mb-2 below input

### Admin Panel
- Dedicated admin route/page
- Two-column form layout on desktop (md:grid-cols-2)
- Full-width inputs with consistent styling
- Multi-line textarea for descriptions: min-h-40
- Image URL inputs with preview thumbnails
- Visibility toggle: Switch component (or checkbox styled as toggle)
- Tags input: Comma-separated with visual tag pills below
- Submit button: Prominent, full-width gradient
- Tools list: Table or card grid with Edit/Delete actions

### Rating Display
- Average rating: Large number (text-4xl font-bold) with stars
- Total reviews count: text-sm below rating
- Distribution bars (optional): Horizontal bars showing 5-4-3-2-1 star counts

### Footer
- Full-width with py-12
- Three-column layout on desktop (md:grid-cols-3): Links, Legal, Social
- Mobile: Stacked single column
- Pure black background with top border
- Links styled as text-sm with hover underline

---

## Visual Treatment

**Black Theme Palette (Steam-Inspired):**
- Base: Pure #000000
- Cards/Elevated: #0a0a0a (very subtle lift)
- Borders: rgba(255, 255, 255, 0.1)
- Text Primary: #ffffff
- Text Secondary: rgba(255, 255, 255, 0.7)
- Text Muted: rgba(255, 255, 255, 0.5)

**Accent Gradients:**
- Primary (Download): linear-gradient(135deg, #10b981 0%, #14b8a6 100%) [emerald to teal]
- Secondary (Donate): linear-gradient(135deg, #f59e0b 0%, #f97316 100%) [amber to orange]
- Tertiary (Telegram): linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%) [blue to cyan]

**Effects:**
- Card hover: transform scale-105 with border glow (box-shadow: 0 0 20px rgba(255,255,255,0.1))
- Button hover: brightness-110 with subtle scale
- Transitions: All interactive elements use transition-all duration-200

---

## Page-Specific Layouts

### Home Page
- Hero section: h-[60vh] with gradient overlay
- Featured tools: Large card grid (3 columns desktop)
- Categories section: Horizontal scrollable pills/tags
- Recent tools: Standard 3-column grid
- Footer

### Tool Detail Page
- Breadcrumb navigation (text-sm with chevrons)
- Main content area with screenshots carousel
- Sticky sidebar with download CTAs and metadata (position: sticky top-20)
- Reviews section: Sort dropdown, review form (if authenticated), review list
- Related tools: 3-column grid at bottom

### Privacy/Terms Pages
- Single column: max-w-4xl
- Typography hierarchy: h2 sections with body paragraphs
- Generous line-height (leading-relaxed) for readability

---

## Icons & Assets

**Icon Library:** Font Awesome 6 (via CDN)
- Download: fa-download
- Star (rating): fa-star (filled), fa-star-o (empty)
- User: fa-user-circle
- Login: fa-sign-in-alt
- External link: fa-external-link-alt
- Edit: fa-edit
- Delete: fa-trash
- Close: fa-times

**Images:**
- Tool screenshots: Prominent in carousels and card thumbnails
- User avatars: Placeholder pattern (initials on gradient) if no upload
- No hero image on home - prioritize tool grid immediately
- Tool detail: Large screenshot carousel as visual anchor

---

## Accessibility

- All interactive elements: min height h-11 (44px) for touch targets
- Focus states: ring-2 ring-offset-2 ring-offset-black
- ARIA labels on icon-only buttons
- Alt text on all images
- Semantic HTML: nav, main, article, aside
- Form labels visible and associated with inputs
- Skip-to-content link for keyboard navigation

---

## Responsive Breakpoints

- Mobile-first approach
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (desktops)
- xl: 1280px (large desktops)

Critical responsive patterns:
- Grids collapse to single column on mobile
- Sticky sidebar becomes stacked on mobile
- Touch-friendly button sizes on all viewports
- Horizontal scroll for tag lists on mobile