# ddangit

Quick mini-games to kill time.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── games/
│   │   └── [game-name]/      # Game routes
│   ├── layout.tsx
│   └── page.tsx              # Home (game list)
│
├── games/                    # Game modules (independent)
│   └── [game-name]/
│       ├── components/       # Game UI
│       ├── hooks/            # Game logic
│       ├── types/            # Type definitions
│       └── constants/        # Config values
│
└── shared/                   # Shared modules
    ├── components/
    │   ├── ui/               # Base UI (Button, etc.)
    │   └── game/             # GameLayout, GameCard, etc.
    ├── hooks/                # useGameState, etc.
    ├── types/                # GameMeta, GameState, etc.
    └── constants/            # GAMES list
```

## Quick Start

### Docker

```bash
make dev        # Start dev server
make build      # Build for production
make prod       # Run production server
make down       # Stop containers
```

### Local

```bash
npm install
npm run dev
```

## Adding a New Game

1. Create `src/games/[game-name]/` folder structure
2. Create `src/app/games/[game-name]/page.tsx` route
3. Add game info to `src/shared/constants/games.ts`

## Games

- Reaction - Test your reflexes
- Aim - Hit the targets
- Memory - Remember the numbers
- Typing - Type as fast as you can
