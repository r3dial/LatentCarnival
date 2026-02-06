# Latent Carnival

**An infinite, AI-generated carnival midway of mini-games.**

**[Visit the Carnival](https://r3dial.github.io/LatentCarnival/)**

---

## How It Works

1. You [open an issue](https://github.com/r3dial/LatentCarnival/issues/new) describing a game idea
2. A GitHub Actions workflow sends your idea to the Claude API
3. Claude creatively re-interprets your concept into a playable HTML/JS game
4. The game is committed to the repo and appears as a new booth on the midway

The carnival grows with every idea submitted.

## The Midway

The site is a horizontally-scrolling carnival road. Each game lives in its own booth — a sandboxed iframe with a striped awning, marquee lights, and a velvet curtain that opens when the game loads. Scroll through with mouse wheel, drag, touch, or arrow keys.

## Submit a Game Idea

See [CONTRIBUTING.md](CONTRIBUTING.md) for details. The short version:

- Open an issue with a game concept (no code needed)
- The bot builds it and adds it to the carnival
- You get a link to play when it's ready

## Tech Stack

- Pure static site — vanilla HTML/CSS/JS, no build tools
- Games are single self-contained HTML files in `games/`
- Iframe sandboxing (`allow-scripts` only) for isolation
- Lazy loading via IntersectionObserver
- GitHub Pages for hosting
- GitHub Actions + Claude API for game generation

## License

MIT
