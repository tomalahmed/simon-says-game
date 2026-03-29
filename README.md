# Simon Says Game

A neon-themed Simon Says memory game built with vanilla JavaScript and Vite.

## Features

- Classic Simon sequence gameplay (watch, remember, repeat)
- Four color pads with sound feedback
- Dynamic speed increase as rounds progress
- Score and best-score tracking (saved in `localStorage`)
- Game-over overlay with `Try Again` restart flow
- Custom game-over sound using `src/assets/faaah.mp3`

## Tech Stack

- JavaScript (ES modules)
- HTML/CSS
- Vite
- Web Audio API + HTML audio element

## Project Structure

- `index.html` - Main game layout and UI elements
- `src/main.js` - App bootstrap
- `src/game.js` - Core game state and gameplay logic
- `src/audio.js` - Tone generation and game-over audio playback
- `src/style.css` - Styling and responsive layout
- `src/assets/faaah.mp3` - Game-over sound asset

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## How To Play

1. Press `START`.
2. Watch the color sequence.
3. Repeat the sequence by clicking/tapping the colored pads.
4. If you make a mistake, the game-over screen appears.
5. Press `Try Again` to restart immediately.

## Notes

- Audio starts after user interaction due to browser autoplay policies.
- Best score is stored in your browser, so clearing site data resets it.
