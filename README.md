# ddangit

Quick mini-games to kill time.

**Live:** https://ddangit.vercel.app

## Games

| Game | Description | Status |
|------|-------------|--------|
| ⚡ Reaction | Test your reflexes | ✅ |
| 🎯 Aim | Hit the targets | ✅ |
| 🔢 Memory | Remember the numbers | ✅ |
| ⌨️ Typing | Type as fast as you can | ✅ |
| 🏜️ Sand Tetris | Connect colors left to right | ✅ |

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── games/
│   │   ├── reaction-speed/
│   │   ├── aim-trainer/
│   │   ├── number-memory/
│   │   ├── typing-speed/
│   │   └── sand-tetris/
│   ├── privacy/              # Privacy Policy (for AdSense)
│   ├── layout.tsx
│   └── page.tsx
│
├── games/                    # Game modules (independent)
│   └── [game-name]/
│       ├── components/       # Game UI
│       ├── hooks/            # Game logic
│       ├── types/            # Type definitions
│       ├── constants/        # Config values
│       └── utils/            # Utilities
│
└── shared/                   # Shared modules
    ├── components/
    │   ├── ui/               # Button, etc.
    │   ├── game/             # GameLayout, GameCard
    │   └── ad/               # AdSlot
    ├── hooks/
    ├── types/
    └── constants/

public/
└── ads.txt                   # AdSense verification
```

## Quick Start

### Local

```bash
npm install
npm run dev
```

### Docker

```bash
make dev        # Dev server
make build      # Production build
make prod       # Production server
make down       # Stop containers
```

## Deploy

```bash
make deploy          # Production deploy
make deploy-preview  # Preview deploy
```

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Canvas 2D (Sand Tetris)
- Vercel
- Google AdSense

---

## Game Ideas

### Classic Game Variations

| Game | Description | Inspiration |
|------|-------------|-------------|
| Sand Tetris | Connect same colors from wall to wall | Tetris + Falling Sand |
| Snake Puzzle | Snake game but solve puzzles | Snake |
| Breakout Tap | One-tap brick breaker | Breakout |
| Flappy Tap | Simplified flappy bird | Flappy Bird |
| 2048 Hex | 2048 on hexagonal grid | 2048 |
| Minesweeper Mini | Quick 5x5 minesweeper | Minesweeper |

### Reflex & Speed Games

| Game | Description |
|------|-------------|
| Color Match | Tap when colors match |
| Word Flash | Remember flashing words |
| Math Speed | Quick arithmetic |
| Pattern Copy | Copy the shown pattern |
| Sequence Memory | Remember growing sequences |
| Sound Memory | Audio version of memory game |

### Puzzle & Brain Games

| Game | Description |
|------|-------------|
| Sliding Puzzle | Classic 15-puzzle |
| Connect Dots | Draw lines without crossing |
| Color Sort | Sort colored balls into tubes |
| Word Search | Find hidden words |
| Sudoku Mini | 4x4 quick sudoku |
| Match 3 | Simple match-3 puzzle |

### Casual & Fun

| Game | Description |
|------|-------------|
| Doodle Jump | Endless vertical jumper |
| Stack Tower | Stack blocks as high as possible |
| Fruit Slice | Swipe to cut fruits |
| Bubble Pop | Pop bubbles before they escape |
| Paper Toss | Throw paper into trash |
| Fishing | Simple tap fishing game |

---

## Development Log

### 2025-01-10
- Sand Tetris major update
  - New mechanic: Connect same color from left wall to right wall
  - Clear animation with flashing effect
  - 4 distinct colors
  - Block spawns from top, game over when sand reaches danger zone

### 2025-01-09
- Initial project setup (Next.js + TypeScript + Tailwind)
- Clean architecture folder structure
- Docker + Makefile setup
- 4 games implemented (Reaction, Aim, Memory, Typing)
- AdSlot component for flexible ad placement
- Vercel deployment (make deploy)
- Privacy Policy page
- Google AdSense integration
- Sand Tetris initial implementation
