# Tennis Ladder Score Tracker

A Next.js application for tracking tennis match scores in a ladder format. Players can submit match results (best-of-3 sets with a 10-point tiebreaker for the third set) and view grouped ladder standings.

## Features

- **Player Management**: Add players to the ladder
- **Match Submission**: Submit match scores with validation
  - Sets 1 & 2: Standard game scoring (e.g., 6-4, 7-5)
  - Set 3: 10-point tiebreaker (only if each player wins one set)
- **Ladder View**: Grouped standings sorted by win percentage
- **Player Details**: View individual player records and match history

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- shadcn/ui + Tailwind CSS
- Drizzle ORM
- SQLite (better-sqlite3)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The database will be created automatically on first run. If you need to generate migrations manually, you can run:
```bash
npm run db:generate
```

## Database

The application uses SQLite with a local `database.db` file. The database will be created automatically when you run the initialization script.

### Schema

- **players**: Stores player information
- **matches**: Stores match results with per-set scores

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations

## Usage

1. **Add Players**: Click "Add Player" on the ladder page to add new players
2. **Submit Matches**: Navigate to "Submit Match" to enter match results
3. **View Ladder**: The home page shows all players grouped by their win-loss record, sorted by win percentage
4. **View Player Details**: Click on any player name to see their match history

## Match Scoring Rules

- Sets 1 and 2 use standard game scoring (winner must have at least 6 games)
- Set 3 is a 10-point tiebreaker (only played if each player wins one set)
- The tiebreaker winner must reach 10 points and win by at least 2 points
