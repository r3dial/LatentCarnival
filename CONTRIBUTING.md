# Contributing to Latent Carnival

## How to Submit a Game Idea

1. **Open an issue** on [this repo](https://github.com/r3dial/LatentCarnival/issues/new)
2. **Title**: A short, catchy name for your game idea (e.g., "Duck Shooting Gallery")
3. **Body**: Describe the game concept. What does the player do? What makes it fun?

That's it! Our Carnival Barker Bot will read your idea, creatively re-interpret it into a playable HTML game, and add it to the midway automatically.

## What Happens Next

- A GitHub Actions workflow picks up your issue
- The Claude API generates a self-contained HTML/JS game inspired by your idea
- The game gets committed to the repo and appears on the live carnival
- Your issue gets a comment with a direct link to play, then closes

## Guidelines for Game Ideas

- **Be creative** — weird, wild, and whimsical ideas are welcome
- **Keep it simple** — games should be playable in 15-60 second sessions
- **No code needed** — just describe the concept; the bot handles implementation
- **Carnival theme** — think midway games, arcade classics, sideshow attractions

## Technical Notes

If you're curious about the format, each game is:
- A single self-contained HTML file (inline CSS/JS, no external resources)
- Designed for a 380x500 pixel viewport
- Rendered inside a sandboxed iframe
- Styled with a dark background and neon carnival colors

## Labels

- Issues are processed automatically unless they have the `skip-agent` label
- Non-game issues should be tagged `skip-agent` to prevent the bot from processing them
