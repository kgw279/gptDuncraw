import test from "node:test";
import assert from "node:assert/strict";
import { TILE, generateDungeon } from "../src/dungeon.js";

test("generateDungeon creates connected floor rooms with endpoints", () => {
  const dungeon = generateDungeon({ width: 48, height: 32, maxRooms: 14 });

  assert.equal(dungeon.width, 48);
  assert.equal(dungeon.height, 32);
  assert.ok(dungeon.rooms.length >= 2);
  assert.equal(dungeon.grid[dungeon.playerStart.y][dungeon.playerStart.x], TILE.FLOOR);
  assert.equal(dungeon.grid[dungeon.stairs.y][dungeon.stairs.x], TILE.FLOOR);

  const reachable = floodFill(dungeon, dungeon.playerStart);
  assert.ok(reachable.has(`${dungeon.stairs.x},${dungeon.stairs.y}`));

  for (const room of dungeon.rooms) {
    assert.ok(reachable.has(`${room.center.x},${room.center.y}`));
  }
});

function floodFill(dungeon, start) {
  const frontier = [start];
  const seen = new Set([`${start.x},${start.y}`]);

  while (frontier.length > 0) {
    const current = frontier.shift();

    for (const neighbor of neighbors(current)) {
      const key = `${neighbor.x},${neighbor.y}`;

      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x >= dungeon.width ||
        neighbor.y >= dungeon.height ||
        seen.has(key) ||
        dungeon.grid[neighbor.y][neighbor.x] !== TILE.FLOOR
      ) {
        continue;
      }

      seen.add(key);
      frontier.push(neighbor);
    }
  }

  return seen;
}

function neighbors({ x, y }) {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];
}
