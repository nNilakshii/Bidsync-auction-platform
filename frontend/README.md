# Bidsync Frontend

React + TypeScript single-page app for the USC Community Exchange that renders live auction data and streams bids over WebSockets (STOMP + SockJS).

## Available Scripts

- `npm install` – install dependencies (requires Node 20.19 or newer)
- `npm run dev` – start the Vite dev server (defaults to port 5173)
- `npm run build` – generate a production build in `dist/`
- `npm run preview` – serve the production build locally
- `npm run lint` – run ESLint across the source files

## Environment Variables

Copy `.env.example` to `.env.local` and adjust as needed:

```
VITE_API_BASE_URL=https://bidsync-auction-platform.onrender.com
VITE_WS_BASE_URL=wss://bidsync-auction-platform.onrender.com/ws
```

## Project Structure

- `src/api` – REST + WebSocket clients and DTOs
- `src/components` – UI building blocks (lists, forms, banners)
- `src/hooks` – reusable hooks (e.g., `useBidSocket`)
- `src/pages` – top-level page layouts
- `src/utils` – helper utilities such as date formatting

The UI defaults to the production backend at `https://bidsync-auction-platform.onrender.com`. Update the env variables if you run the backend in a different environment (e.g., local development).
