export const TILE = Object.freeze({
  WALL: "wall",
  FLOOR: "floor",
});

const DEFAULT_OPTIONS = Object.freeze({
  width: 48,
  height: 32,
  maxRooms: 18,
  minRoomSize: 4,
  maxRoomSize: 9,
  roomPadding: 1,
});

export function generateDungeon(options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const grid = createGrid(config.width, config.height, TILE.WALL);
  const rooms = [];

  for (let attempt = 0; attempt < config.maxRooms * 6 && rooms.length < config.maxRooms; attempt += 1) {
    const room = createRandomRoom(config);

    if (rooms.some((existingRoom) => roomsOverlap(room, existingRoom, config.roomPadding))) {
      continue;
    }

    carveRoom(grid, room);

    const previousRoom = rooms.at(-1);
    if (previousRoom) {
      carveCorridor(grid, previousRoom.center, room.center);
    }

    rooms.push(room);
  }

  if (rooms.length < 2) {
    return generateDungeon({ ...config, maxRooms: config.maxRooms + 4 });
  }

  return {
    width: config.width,
    height: config.height,
    grid,
    rooms,
    playerStart: rooms[0].center,
    stairs: rooms.at(-1).center,
  };
}

function createGrid(width, height, fill) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => fill));
}

function createRandomRoom({ width, height, minRoomSize, maxRoomSize }) {
  const roomWidth = randomInt(minRoomSize, maxRoomSize);
  const roomHeight = randomInt(minRoomSize, maxRoomSize);
  const x = randomInt(1, width - roomWidth - 2);
  const y = randomInt(1, height - roomHeight - 2);

  return {
    x,
    y,
    width: roomWidth,
    height: roomHeight,
    center: {
      x: Math.floor(x + roomWidth / 2),
      y: Math.floor(y + roomHeight / 2),
    },
  };
}

function roomsOverlap(a, b, padding) {
  return (
    a.x - padding <= b.x + b.width &&
    a.x + a.width + padding >= b.x &&
    a.y - padding <= b.y + b.height &&
    a.y + a.height + padding >= b.y
  );
}

function carveRoom(grid, room) {
  for (let y = room.y; y < room.y + room.height; y += 1) {
    for (let x = room.x; x < room.x + room.width; x += 1) {
      grid[y][x] = TILE.FLOOR;
    }
  }
}

function carveCorridor(grid, from, to) {
  const horizontalFirst = Math.random() > 0.5;

  if (horizontalFirst) {
    carveHorizontal(grid, from.x, to.x, from.y);
    carveVertical(grid, from.y, to.y, to.x);
  } else {
    carveVertical(grid, from.y, to.y, from.x);
    carveHorizontal(grid, from.x, to.x, to.y);
  }
}

function carveHorizontal(grid, startX, endX, y) {
  for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x += 1) {
    grid[y][x] = TILE.FLOOR;
  }
}

function carveVertical(grid, startY, endY, x) {
  for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y += 1) {
    grid[y][x] = TILE.FLOOR;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
