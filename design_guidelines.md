# Apartment Management System - Design Guidelines

## Architecture Decisions

### Authentication
**Auth Required** - The app has explicit user roles and account types.

**Implementation:**
- Hardcoded credentials login (email/password)
- 4 User Roles: Resident, Society Management, Security Staff, Maintenance Team
- Login screen with role selector dropdown
- Mock credentials stored in local state
- No SSO needed (per hardcoded requirement)
- Include "Remember Me" toggle
- Account screen with:
  - User profile (name, unit number, role badge)
  - App preferences (notifications, theme)
  - Log out with confirmation alert

**Hardcoded Test Accounts:**
- Resident: resident@apt.com / pass123
- Management: admin@apt.com / pass123
- Security: security@apt.com / pass123
- Maintenance: maintenance@apt.com / pass123

### Navigation Architecture
**Tab Navigation** (5 tabs with center action button for Residents/Management)

**Resident Navigation:**
1. Dashboard (Home icon)
2. Facilities (Calendar icon)
3. Tickets (+) - Center floating action button
4. Payments (CreditCard icon)
5. More (Menu icon)

**Management Navigation:**
1. Dashboard (Home icon)
2. Residents (Users icon)
3. Reports (+) - Center floating action button
4. Finance (DollarSign icon)
5. More (Menu icon)

**Security Navigation:**
- Stack-only with drawer for historical logs
- Main screen: Visitor Entry with drawer access to delivery logs, vehicle logs, emergency contacts

**Maintenance Navigation:**
- Stack-only with list-based home
- Main screen: Ticket List with filter tabs (Open, In Progress, Resolved)

### Information Architecture

**Shared Screens (accessible from More tab):**
- Notices & Events
- Document Repository
- Emergency Contacts
- Polls & Voting
- Settings & Profile

**Role-Specific Access:**
- Residents: View-only for most data
- Management: Full CRUD access to all modules
- Security: Entry/exit logging only
- Maintenance: Ticket management only

## Screen Specifications

### 1. Login Screen
**Layout:**
- No header
- Scrollable form (centered vertically when keyboard hidden)
- Top inset: insets.top + Spacing.xxl
- Bottom inset: insets.bottom + Spacing.xl

**Components:**
- App logo/icon (60x60)
- Title: "Apartment Management"
- Role selector (segmented control or dropdown)
- Email input field
- Password input field (with show/hide toggle)
- "Remember Me" checkbox
- Primary button: "Sign In"
- Footer text: "Hardcoded Demo App"

### 2. Dashboard (All Roles)
**Layout:**
- Custom transparent header with greeting ("Good Morning, [Name]")
- Right button: Notification bell with badge count
- Scrollable content
- Top inset: headerHeight + Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components:**
- Role badge pill (colored by role)
- Quick stats cards (3-4 cards in 2-column grid):
  - Pending payments (Residents)
  - Open tickets (All)
  - Upcoming events (All)
  - Visitor count (Security)
- "Recent Activity" section with list items
- "Quick Actions" buttons (role-specific)
- Alert banners for urgent items (due payments, emergency alerts)

### 3. Ticket List/Creation
**List Screen Layout:**
- Default header with "Tickets" title
- Right button: Filter icon
- Left button: Back (if in stack)
- Scrollable list
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl
- Floating action button (bottom-right) for "Create Ticket"
  - Position: 16px from bottom (above tab bar), 16px from right
  - Shadow: width: 0, height: 2, opacity: 0.10, radius: 2

**Create Ticket Screen:**
- Default header with "New Ticket" title
- Left button: Cancel
- Right button: Submit (disabled until form valid)
- Scrollable form
- Top inset: Spacing.xl
- Bottom inset: insets.bottom + Spacing.xl
- Form fields:
  - Category dropdown (Plumbing, Electrical, Cleaning, etc.)
  - Subject input
  - Description textarea
  - Priority selector (Low, Medium, High, Urgent)
  - Photo upload (optional, max 3)

### 4. Payment & Billing
**Layout:**
- Default header with "Payments" title
- Right button: History icon
- Scrollable content
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components:**
- Current month bill card (prominent, colored border if overdue)
  - Amount due
  - Due date
  - "Pay Now" button
- Payment history list (grouped by month)
- Each item shows: Date, Amount, Type, Status badge

### 5. Visitor Entry (Security)
**Layout:**
- Custom transparent header with "Gate Entry"
- Right button: History (opens drawer)
- Non-scrollable content with form
- Top inset: headerHeight + Spacing.xl
- Bottom inset: insets.bottom + Spacing.xl

**Components:**
- Entry type tabs: Visitor | Delivery | Vehicle
- Form fields (context-sensitive):
  - Visitor name
  - Flat/unit number (searchable dropdown)
  - Purpose
  - ID/contact number
  - Photo capture button
- Primary button: "Check In"
- Secondary button: "Pre-approved List"

### 6. Facility Booking
**Layout:**
- Default header with "Facilities" title
- Right button: My Bookings
- Scrollable list
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components:**
- Facility cards (Gym, Party Hall, Clubhouse, Swimming Pool)
  - Image thumbnail
  - Availability indicator (Green: Available, Yellow: Limited, Red: Fully booked)
  - "Book Now" button
- Calendar view for date selection (in booking flow)
- Time slot picker (chips/grid)

### 7. Notices & Events
**Layout:**
- Default header with "Notices & Events" title
- Scrollable list
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components:**
- Segmented control tabs: All | Notices | Events
- List items with:
  - Badge (Notice/Event type)
  - Title
  - Date/time
  - Preview text
  - Attachment icon (if applicable)
- Tap to expand for full details

### 8. More/Settings Hub
**Layout:**
- Default header with "More" title
- Scrollable list
- Top inset: Spacing.xl
- Bottom inset: tabBarHeight + Spacing.xl

**Components:**
- Profile card (top) with avatar, name, unit number, role
- Grouped list sections:
  - Management (if role = Management): Residents, Vendors, Staff, Parking
  - Community: Polls, Document Repository, Classifieds
  - Support: Emergency Contacts, Help & FAQ
  - Settings: Notifications, Theme, About
  - Account: Log Out

## Design System

### Color Palette
**Primary Colors:**
- Primary: #2563EB (Blue 600) - Main actions, active states
- Primary Dark: #1E40AF (Blue 700) - Pressed states
- Primary Light: #DBEAFE (Blue 100) - Subtle backgrounds

**Role Colors:**
- Resident: #10B981 (Emerald 500)
- Management: #8B5CF6 (Violet 500)
- Security: #F59E0B (Amber 500)
- Maintenance: #3B82F6 (Blue 500)

**Semantic Colors:**
- Success: #10B981 (Emerald 500)
- Warning: #F59E0B (Amber 500)
- Error: #EF4444 (Red 500)
- Info: #3B82F6 (Blue 500)

**Neutral Colors:**
- Text Primary: #111827 (Gray 900)
- Text Secondary: #6B7280 (Gray 500)
- Border: #E5E7EB (Gray 200)
- Background: #F9FAFB (Gray 50)
- Surface: #FFFFFF

### Typography
**Font Family:** System default (San Francisco on iOS, Roboto on Android)

**Scale:**
- Hero: 32px, Bold (Dashboard greeting)
- Title1: 24px, Bold (Screen titles)
- Title2: 20px, Semibold (Section headers)
- Body: 16px, Regular (Main content)
- Caption: 14px, Regular (Metadata, labels)
- Small: 12px, Regular (Tiny labels, badges)

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

### Component Specifications

**Cards:**
- Background: Surface color
- Border radius: 12px
- Padding: Spacing.lg
- No shadow (flat design)
- Border: 1px solid Border color
- Pressed state: Subtle gray background (#F3F4F6)

**Buttons:**
- Primary: Blue background, white text, height 48px, border radius 8px
- Secondary: White background, blue text, blue border, height 48px
- Text: No background, blue text, height 44px
- All buttons: Pressed state reduces opacity to 0.7

**Floating Action Button:**
- Size: 56x56px
- Border radius: 28px (circular)
- Primary color background
- White icon (Plus or specific action icon)
- Shadow: width: 0, height: 2, opacity: 0.10, radius: 2
- Pressed state: Primary Dark background

**Form Inputs:**
- Height: 48px
- Border: 1px solid Border color
- Border radius: 8px
- Padding: Spacing.md horizontal
- Focus state: Blue border
- Error state: Red border with error text below

**Status Badges:**
- Height: 24px
- Border radius: 12px (pill)
- Padding: Spacing.sm horizontal
- Text: Small size, Semibold
- Colors: Success (Paid/Resolved), Warning (Pending), Error (Overdue/Open)

**List Items:**
- Height: Auto (min 64px)
- Padding: Spacing.lg vertical, Spacing.lg horizontal
- Border bottom: 1px solid Border color
- Pressed state: Light gray background

**Icons:**
- Use Feather icons from @expo/vector-icons
- Standard size: 24px
- Tab bar icons: 24px
- Button icons: 20px
- Badge icons: 16px

### Accessibility
- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 for text, 3:1 for UI elements
- All interactive elements have clear pressed states
- Form inputs have labels and error messages
- Screen reader support for all navigation and actions

### Critical Assets
Generate the following assets for the app:
1. **App Icon** (1024x1024): Modern apartment building silhouette with blue gradient
2. **Role Avatars** (4 variations, 200x200): Professional avatar illustrations for each role (color-coded)
3. **Facility Images** (4 images, 800x600): Gym, Party Hall, Clubhouse, Swimming Pool interiors
4. **Empty States** (3 illustrations, 400x300): No tickets, No payments, No visitors

**Visual Style for Assets:** Clean, modern, slightly rounded geometric illustrations with the app's primary blue color palette.