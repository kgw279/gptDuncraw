import { TILE, generateDungeon } from "./dungeon.js";

const mapElement = document.querySelector("#dungeon-map");
const summaryElement = document.querySelector("#generation-summary");
const regenerateButton = document.querySelector("#regenerate");

regenerateButton.addEventListener("click", () => {
  renderDungeon(generateDungeon());
});

renderDungeon(generateDungeon());

function renderDungeon(dungeon) {
  mapElement.replaceChildren();
  mapElement.style.setProperty("--map-width", dungeon.width);

  const fragment = document.createDocumentFragment();

  for (let y = 0; y < dungeon.height; y += 1) {
    for (let x = 0; x < dungeon.width; x += 1) {
      const tile = document.createElement("div");
      tile.className = `tile tile--${getTileClass(dungeon, x, y)}`;
      tile.title = getTileLabel(dungeon, x, y);
      fragment.append(tile);
    }
  }

  mapElement.append(fragment);
  summaryElement.textContent = `${dungeon.rooms.length} rooms carved into a ${dungeon.width}×${dungeon.height} map.`;
}

function getTileClass(dungeon, x, y) {
  if (samePoint(dungeon.playerStart, x, y)) {
    return "player";
  }

  if (samePoint(dungeon.stairs, x, y)) {
    return "stairs";
  }

  return dungeon.grid[y][x] === TILE.FLOOR ? "floor" : "wall";
}

function getTileLabel(dungeon, x, y) {
  if (samePoint(dungeon.playerStart, x, y)) {
    return "Player start";
  }

  if (samePoint(dungeon.stairs, x, y)) {
    return "Stairs down";
  }

  return dungeon.grid[y][x] === TILE.FLOOR ? "Floor" : "Wall";
}

function samePoint(point, x, y) {
  return point.x === x && point.y === y;
}
