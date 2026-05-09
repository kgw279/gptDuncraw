# gptDuncraw

A minimal dungeon crawler for the modern browser, designed for GitHub Pages.

The first prototype focuses on procedural dungeon generation and simple graphical tiles rather than ASCII rendering. Rooms are carved from solid rock, then connected by L-shaped corridors. The generated map marks the player start and the stairs down so later gameplay systems have stable spawn points.

## Run locally

Open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Current prototype

- Static HTML/CSS/JavaScript with no build step.
- Browser-native ES modules.
- Procedural room-and-corridor dungeon generation.
- Simple graphical tiles, including a white tileable floor SVG.
- Regenerate button for previewing different dungeon layouts.

## Next gameplay steps

1. Add keyboard movement and collision against walls.
2. Add fog of war and exploration memory.
3. Place monsters, items, traps, and treasure in generated rooms.
4. Add stairs-based dungeon depth progression.
