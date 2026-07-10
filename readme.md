# Social Media Automation

A modern web app for managing social media publishing workflows from a single dashboard. The project currently provides a polished frontend experience for viewing analytics, connecting accounts, composing content, and scheduling posts across multiple platforms.

## Overview

This application is designed to help users:

- manage connected social accounts
- create and schedule posts for multiple platforms
- review dashboard activity and post status
- explore an AI-assisted composer experience for content creation

## Features

- Landing page with product overview and call-to-action sections
- Dashboard with summary cards and recent activity
- Connected accounts management UI
- Post composer with media upload and scheduling controls
- Responsive layout built with React and Tailwind CSS

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router
- Styling: Tailwind CSS
- Icons: lucide-react, react-simple-icons
- Backend: Node.js server scaffold

## Project Structure

```text
client/          # Vite + React frontend
server/          # Backend scaffold
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### Run the frontend locally

```bash
cd client
npm run dev
```

Then open your browser at http://localhost:5173.

### Build for production

```bash
cd client
npm run build
```

## Current Status

The current implementation includes a functional UI experience with demo data for accounts, posts, and activity. The backend server is still a basic scaffold, so real account integration and publishing workflows would need additional API development.

## License

ISC
