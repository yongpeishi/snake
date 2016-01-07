var GRID_SIZE = 10;
var FIELD_SIZE = 200;

var NORTH = "NORTH";
var EAST = "EAST";
var SOUTH = "SOUTH";
var WEST = "WEST";

var COMPASS =  [ NORTH, EAST, SOUTH, WEST ]

var MOVEMENT = {
  NORTH: { x: 0, y: GRID_SIZE*-1 },
  EAST:  { x: GRID_SIZE, y: 0 },
  SOUTH: { x: 0, y: GRID_SIZE },
  WEST:  { x: GRID_SIZE*-1, y: 0}
}

