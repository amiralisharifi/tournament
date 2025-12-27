# TourneyPro - Tournament Management Application

A full-stack web application for creating and managing sports tournaments with support for multiple formats and sports.

## Features

- **Multiple Sports**: Padel, Tennis (singles/doubles), Badminton (singles/doubles), Basketball, Volleyball, Football (8v8 and 5v5)
- **Tournament Formats**: Single Elimination, Round Robin, Multi-Stage (group + knockout), and Americano
- **Americano Padel**: Individual players with rotating partners and points-based scoring
- **Real-time Scoring**: Track match scores as games progress
- **Bracket Visualization**: View tournament brackets for elimination formats
- **Standings Tables**: Round-robin and group stage standings with automatic calculation
- **Leaderboards**: Individual player rankings for Americano tournaments

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **State Management**: TanStack React Query
- **Routing**: Wouter (client-side), Express (API)
- **Validation**: Zod with Drizzle-Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tourneypro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
├── server/                 # Backend Express server
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   └── index.ts           # Server entry point
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts          # Data models and Zod schemas
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tournaments` | List all tournaments |
| GET | `/api/tournaments/:id` | Get tournament details |
| POST | `/api/tournaments` | Create a new tournament |
| PATCH | `/api/tournaments/:id` | Update tournament |
| DELETE | `/api/tournaments/:id` | Delete tournament |
| PATCH | `/api/tournaments/:id/matches/:matchId` | Update match score |

## License

MIT
