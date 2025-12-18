# Design Guidelines: Tournament Management Web Application

## Design Approach

**Selected Approach**: Design System with Reference Inspiration
- **System**: Material Design 3 for consistent component patterns and data display
- **Reference**: score7.io for clean, sports-focused aesthetic and card-based layouts
- **Justification**: Tournament management requires clear data hierarchy and intuitive interactions (utility-focused), but benefits from score7.io's proven sports tournament UX patterns

## Typography System

**Font Families**:
- Primary: Inter (headings, UI elements, data)
- Secondary: JetBrains Mono (scores, match times, numerical data)

**Type Scale**:
- Hero Headlines: text-5xl to text-6xl, font-bold
- Page Titles: text-4xl, font-bold
- Section Headers: text-2xl to text-3xl, font-semibold
- Card Titles: text-lg to text-xl, font-semibold
- Body Text: text-base, font-normal
- Match Scores: text-3xl to text-4xl, font-mono, font-bold
- Metadata/Stats: text-sm, font-medium

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-12 to py-16
- Card gaps: gap-4 to gap-6
- Form fields: space-y-4

**Grid Structure**:
- Tournament cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Match brackets: Responsive single-column mobile, multi-column desktop
- Standings tables: Full-width with horizontal scroll on mobile
- Max container width: max-w-7xl

## Component Library

### Navigation
- Fixed top navbar with logo, tournament type switcher, create tournament CTA
- Breadcrumb navigation for deep pages (Tournament > Matches > Score Entry)
- Tab navigation for switching between Brackets/Standings/Fixtures views

### Tournament Type Cards (Homepage)
- Large cards with sport icon, title, description, "Create Tournament" button
- Hover elevation effect
- Display participant format (e.g., "2 Players per Team" for Padel)

### Tournament Creation Flow
- Multi-step form with progress indicator
- Step 1: Tournament details (name, type, format)
- Step 2: Team/player entry (manual input or bulk add)
- Step 3: Format selection (single elimination, round-robin)
- Step 4: Review and create

### Bracket Display
- Single elimination: Tree structure with connecting lines
- Rounds clearly labeled (Quarter Finals, Semi Finals, Finals)
- Match cards show: team names, scores, match time/status
- Winner advancement with visual indicator
- Mobile: Vertical flow, desktop: Horizontal tree

### Match Cards
- Team names with scores (large, prominent)
- Match status badge (Live, Upcoming, Completed)
- Venue and time information
- Quick score entry button for admins
- Share match button

### Standings Table
- Position, Team, Played, Won, Lost, Goals For/Against, Points
- Sticky header on scroll
- Highlight current user's team
- Sortable columns

### Score Entry Interface
- Large touch-friendly increment/decrement buttons
- Current score prominently displayed
- Submit and cancel actions clearly separated
- Match details at top (teams, time, venue)
- Optimized for mobile one-handed use

### Public Tournament View
- Hero section with tournament name, format, status
- Shareable link with copy button
- QR code for easy mobile access
- Live badge when matches are in progress

### Stats and Metrics
- Number cards for key stats (Total Matches, Completed, Upcoming)
- Clean numerical display with labels
- Grid layout: grid-cols-2 md:grid-cols-4

## Images

**Hero Image**: Yes - Homepage only
- Placement: Full-width hero section
- Content: Dynamic action shot of padel/football players in tournament setting
- Treatment: Subtle gradient overlay for text readability
- CTAs overlaid on image with blur-background buttons

**Tournament Type Cards**: Icon-based, no photos
- Use large sport-specific icons (tennis racket for Padel, football for football variants)

**Empty States**: Illustrations
- "No tournaments yet" with illustration and create CTA
- "Add teams to start" with helpful graphic

**Tournament Pages**: No hero images
- Focus on data display and functionality

## Page-Specific Layouts

### Homepage
- Hero: Full-width with background image, centered headline "Manage Your Tournaments", primary CTA
- Tournament Types: 3-column grid of cards (Padel, 8-sided, 5-sided)
- Features: 2-column layout showcasing key features (bracket generation, live scoring, etc.)
- Stats: 3 metrics cards (Active Tournaments, Total Matches, Users)
- Footer: Links, contact info

### Padel/Football Tournament Pages
- Page header: Tournament name, type badge, action buttons (Share, Edit, Delete)
- Tab navigation: Brackets | Standings | Matches | Teams
- Main content area: Tab-specific content with appropriate layout
- Sidebar (desktop): Quick stats, upcoming matches, admin controls

### Create Tournament Page
- Centered form card: max-w-2xl
- Progress stepper at top
- Form sections with clear headings
- Navigation buttons at bottom (Back, Next/Create)

## Animations

Use sparingly:
- Card hover: subtle elevation change (no color change)
- Score updates: Brief highlight flash when score changes
- Winner advancement: Smooth line drawing animation
- Page transitions: Fade in content (200ms)

## Responsive Behavior

**Mobile (< 768px)**:
- Single column layouts
- Bottom navigation for key actions
- Collapsible filters and options
- Full-width cards
- Horizontal scroll for wide tables

**Tablet (768px - 1024px)**:
- 2-column grids where appropriate
- Sidebar becomes collapsible
- Optimized for landscape viewing

**Desktop (> 1024px)**:
- 3-column tournament cards
- Persistent sidebar on tournament pages
- Multi-column bracket displays
- Expanded table views