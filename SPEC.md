# FlipCard Lite - Multi-Page Website Specification

## Project Overview
- **Name**: FlipCard Lite
- **Type**: Multi-page card showcase website
- **Core Functionality**: Interactive flipcard gallery with images, prices, and smooth animations
- **Target Users**: Product showcase, portfolio display, catalog browsing

## Site Structure
1. **index.html** - Home/Navigation page
2. **cards.html** - Flipcard gallery page
3. **about.html** - About/Info page

## UI/UX Specification

### Color Palette
- **Background**: #0a0a0f (deep dark)
- **Card Front**: #1a1a24 (dark slate)
- **Card Back**: #12121a (darker slate)
- **Primary Accent**: #ff6b35 (vibrant orange)
- **Secondary Accent**: #00d4aa (teal mint)
- **Text Primary**: #ffffff
- **Text Secondary**: #8a8a9a
- **Glow Effect**: rgba(255, 107, 53, 0.4)

### Typography
- **Headings**: "Outfit", sans-serif (700 weight)
- **Body**: "DM Sans", sans-serif (400/500 weight)
- **Prices**: "Space Mono", monospace

### Layout
- Responsive grid: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Card size: 320px width, 420px height
- Gap between cards: 32px

### Visual Effects
- Card flip: 3D transform with 0.8s ease transition
- Hover glow: Box shadow with accent color
- Card tilt on hover: Subtle 3D rotation
- Page transitions: Fade in with slight scale
- Staggered reveal animation on page load

## Flipcard Components

### Card Structure (Each Card)
**Front Side:**
- Product image (centered, cover fit)
- Product name
- Quick view hint

**Back Side:**
- Product name (large)
- Description (2-3 lines)
- Price in accent color
- "Buy Now" button
- Rating stars

### Sample Products (6 Cards)
1. Aurora Wireless Headphones - $299
2. Nova Smart Watch - $449
3. Zenith Gaming Mouse - $159
4. Apex Mechanical Keyboard - $349
5. Pulse Bluetooth Speaker - $199
6. Drift ANC Earbuds - $249

## Functionality Specification

### Navigation
- Persistent header with logo and nav links
- Active page highlight
- Smooth scroll behavior

### Flipcard Interactions
- Click to flip (desktop)
- Tap to flip (mobile)
- Hover flip option (toggle)
- Keyboard accessible (Enter/Space to flip)

### Animations
- Cards flip on click/tap
- Hover: subtle lift + glow
- Page load: staggered card reveal (100ms delay each)
- Smooth CSS-only animations

## Acceptance Criteria
1. Three pages navigable from header
2. 6 flipcards with images and prices displayed
3. Cards flip smoothly on click/tap
4. Responsive across all devices
5. All colors match spec exactly
6. Fonts load correctly
7. No console errors