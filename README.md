# Sheesh - Screentime Competition App

A social screentime tracking app that gamifies phone usage habits through friendly competition.

## Features

- 📱 Upload daily screentime data from iPhone Settings
- 👥 Create and join groups with friends
- 🏆 Real-time leaderboards (daily, weekly, improvement)
- 📊 Personal analytics and progress tracking
- 🔒 Privacy controls (public/private accounts)
- 💬 Group-based competitions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** with Express 5
- **TypeScript** for type safety
- **SQLite** database with Kysely query builder
- **RESTful API** design

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd sheesh
```

2. Install dependencies
```bash
npm install
```

3. Start development servers
```bash
npm run start
```

This starts:
- Frontend (Vite dev server): http://localhost:3000
- Backend (Express API): http://localhost:3001

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run prod
```

## Project Structure

```
sheesh/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   └── index.html          # HTML template
├── server/                 # Express backend
│   ├── index.ts            # Main server file
│   ├── database.ts         # Database configuration
│   └── static-serve.ts     # Static file serving
├── scripts/                # Development scripts
│   └── dev.ts              # Development server
├── dist/                   # Production build output
├── data/                   # SQLite database location
└── config files...
```

## Environment Variables

### Development
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `DATA_DIRECTORY` - Database location (default: ./data)

### Production
- `NODE_ENV=production` - Enables production mode
- `PORT` - Application port
- `DATA_DIRECTORY` - Absolute path to data directory

## Database Schema

The app uses SQLite with four main tables:

- **users** - User accounts and profiles
- **groups** - Competition groups
- **group_members** - Group membership relationships
- **screentime_entries** - Daily screentime data

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/users` - Create account

### Users
- `GET /api/users/:userId/groups` - Get user's groups
- `PUT /api/users/:userId` - Update user profile

### Screentime
- `POST /api/screentime` - Upload screentime data
- `GET /api/screentime/:userId` - Get user's screentime history

### Groups
- `GET /api/groups` - List all public groups
- `POST /api/groups` - Create new group
- `POST /api/groups/:groupId/join` - Join public group
- `POST /api/groups/join-by-code` - Join private group with code
- `GET /api/groups/:groupId/leaderboard` - Get group leaderboard

## Features In Detail

### Screentime Tracking
- Manual upload from iPhone Settings → Screen Time
- Daily, weekly, and improvement analytics
- Personal progress charts and statistics

### Group Competition
- Create public or private groups
- Private groups use 6-character join codes
- Real-time leaderboards with multiple ranking types:
  - Today's usage
  - Yesterday's results
  - Weekly averages
  - 3-day improvement trends

### Privacy Controls
- Public accounts: Visible in all leaderboards
- Private accounts: Only visible in joined groups, shows as "Private" in main group

### Responsive Design
- Mobile-first design with touch-friendly interfaces
- Optimized for iPhone screentime data entry
- Progressive enhancement for desktop

## Development

### Scripts
- `npm run start` - Start development servers
- `npm run build` - Build for production
- `npm run prod` - Start production server
- `npm run clean` - Clean build artifacts

### Adding Features
1. Create components in `client/src/components/`
2. Add API endpoints in `server/index.ts`
3. Update database schema if needed
4. Follow existing TypeScript patterns

## Deployment

### Requirements
- Node.js 18+ runtime
- Persistent storage for SQLite database
- Environment variables configured

### Build Process
1. `npm ci --omit=dev` - Install production dependencies
2. `npm run build` - Build application
3. `node dist/server/index.js` - Start production server

### File Structure After Build
```
dist/
├── public/          # Frontend static files
└── server/          # Compiled backend code
data/
└── database.sqlite  # SQLite database
```

## License

MIT License - see LICENSE file for details
