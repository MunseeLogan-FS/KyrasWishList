# Kyra's Wishlist App

A modern, paper-textured wishlist viewer that pulls items from a Google Doc and displays them with rich preview cards. Built with SvelteKit and optimized for fast loading with progressive enhancement.

## Features

- **Google Doc Integration**: Pulls wishlist items directly from a Google Apps Script endpoint
- **Progressive Loading**: Displays basic items instantly, then enriches with preview images and descriptions in the background
- **Rich Link Previews**: Automatically fetches OpenGraph metadata (images, descriptions, site names) for each URL
- **Real-time Search**: Filter items by title or URL with instant results
- **Responsive Design**: Mobile-first layout with adaptive card grid
- **Paper Aesthetic**: Soft color palette with subtle textures inspired by physical paper
- **Smart Caching**: 30-minute preview cache to minimize redundant fetches

## How It Works

### Data Flow

1. **Initial Load** (`+page.server.js`)
   - Fetches wishlist from Google Apps Script endpoint
   - Parses text/URL pairs from the doc content
   - Returns basic item data immediately (title, URL, hostname)

2. **Progressive Enhancement** (`+page.svelte`)
   - Page renders instantly with basic data
   - After mount, progressively fetches preview metadata for each URL
   - Updates cards in place as previews load

3. **Preview Fetching** (`/api/preview/+server.js`)
   - Scrapes OpenGraph metadata using Cheerio
   - Extracts title, description, image, and site name
   - Caches results for 30 minutes
   - 5-second timeout per fetch to prevent blocking

### Google Doc Format

The wishlist should be structured as alternating title/URL pairs:

```
Item Title
https://example.com/product

Another Item
https://shop.com/thing
```

- Text before a URL is used as the item title
- URLs are auto-detected and paired with the preceding text
- Empty lines are ignored

### Color Palette

- **Mint Green** (`#daf3c9`): Background
- **Sky Blue** (`#c6e6fc`): Borders, accents, pills
- **Soft Pink** (`#ffa8b6`): Hover states
- **Plum** (`#615473`): Text, headings

## Development

Install dependencies:

```sh
bun install
```

Start the dev server:

```sh
bun run dev
```

The app will be available at `http://localhost:5173`

## Building

Create a production build:

```sh
bun run build
```

Preview the production build:

```sh
bun run preview
```

## Configuration

Update the wishlist source URL in `src/routes/+page.server.js`:

```js
const WISHLIST_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
```

## Tech Stack

- **SvelteKit** - App framework
- **Cheerio** - HTML parsing for OpenGraph scraping
- **Vite** - Build tool
- **Bun** - Package manager and runtime
