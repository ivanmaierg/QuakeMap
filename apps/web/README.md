# QuakeMap Web App 

A modern SvelteKit application with shadcn-svelte components for earthquake monitoring and visualization using interactive maps.

## Features

- **Interactive Earthquake Map**: Real-time earthquake visualization with custom markers
- **Svelte Maplibre Integration**: Uses `svelte-maplibre` for map functionality
- **Advanced Filtering**: Filter earthquakes by magnitude, date, and other criteria
- **Custom Markers**: Color-coded markers based on earthquake magnitude
- **Popup Details**: Click markers to see detailed earthquake information
- **Projection Toggle**: Switch between globe and mercator projections
- **SvelteKit**: Modern full-stack framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn-svelte**: Beautiful, accessible UI components
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Built-in theme switching

## Tech Stack

- SvelteKit 2.22.0
- Svelte 5.0.0
- TypeScript 5.0.0
- Tailwind CSS 4.0.0
- shadcn-svelte 1.0.7
- svelte-maplibre 1.2.1
- maplibre-gl 5.7.1

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run check` - Run type checking

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                    # shadcn-svelte components
│   │   ├── EarthquakeMap.svelte   # Main earthquake map component
│   │   └── EarthquakeFilters.svelte # Earthquake filtering component
│   ├── stores/
│   │   └── earthquakes.ts         # Earthquake data store
│   ├── utils.ts                   # Utility functions
│   └── hooks/                     # Custom hooks
├── routes/
│   ├── api/
│   │   └── earthquakes/           # API proxy for earthquake data
│   ├── map/                       # Earthquake map page
│   ├── +layout.svelte             # Root layout
│   └── +page.svelte               # Home page
└── app.css                        # Global styles
```

## Adding Components

To add new shadcn-svelte components:

```bash
npx shadcn-svelte@latest add [component-name]
```

Example:
```bash
npx shadcn-svelte@latest add button card input
```

## Earthquake Map Features

### Interactive Map
- **Real-time Data**: Fetches earthquake data from the backend API
- **Custom Markers**: Each earthquake is displayed as a colored circle with magnitude
- **Color Coding**: Markers are color-coded by magnitude (green → yellow → orange → red)
- **Size Scaling**: Marker size increases with earthquake magnitude
- **Click Interactions**: Click markers to see detailed earthquake information

### Filtering System
- **Quick Filters**: One-click filters for magnitude ranges (4+, 5+, 6+, 7+)
- **Advanced Filters**: Detailed filtering by magnitude, date range, and result limit
- **Active Filter Display**: Shows currently applied filters
- **Real-time Updates**: Map updates immediately when filters are applied

### Map Controls
- **Projection Toggle**: Switch between globe and mercator projections
- **Refresh Data**: Manual data refresh button
- **Statistics Display**: Shows total earthquakes and last update time
- **Responsive Layout**: Controls positioned to avoid conflicts with map navigation

## Configuration

The project is configured with:
- `components.json` - shadcn-svelte configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `svelte.config.js` - SvelteKit configuration
- `tsconfig.json` - TypeScript configuration

## Development

The app includes:
- Hot module replacement
- TypeScript checking
- Tailwind CSS with JIT compilation
- Component library integration

## Deployment

Build the app for production:

```bash
pnpm run build
```

The built files will be in the `build` directory, ready for deployment to any static hosting service.