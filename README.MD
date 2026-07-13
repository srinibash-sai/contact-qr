# ContactQR

ContactQR is a simple web app for creating, editing, and sharing contact profiles as QR codes.

## Features

- Create and manage multiple contact profiles
- Generate QR codes from contact details
- Edit, duplicate, delete, and import profiles
- Dark/light theme toggle
- Local data storage with IndexedDB
- Smooth scrolling and animated UI

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- IndexedDB via `idb`
- `qrcode`
- `react-router-dom`
- `sonner`
- `framer-motion`
- `lenis`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

- `src/components` - UI and feature components
- `src/hooks` - custom hooks
- `src/lib` - database and utility helpers
- `src/styles.css` - global styles

## Notes

- Data is stored locally in the browser.
- No backend is required.
