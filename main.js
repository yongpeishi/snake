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

var gameStarted = false;
var gameOver = false;
var move = function() {};

var Game = React.createClass({
  getInitialState: function() {
    return {
      gameStatus: '',
      gameScore: 0,
      snake: [ {x:100, y:100} ],
      direction: NORTH,
      foodX: 50,
      foodY: 50
    }
  },

  componentDidMount: function() {
    this.refs.svgContainer.focus();
    move = this.move;
  },

  changeDirection: function(e) {
    var turn = {
      'ArrowLeft' : -1,
      'ArrowRight' : 1
    }

    var arrowPressed = turn[e.key];
    if(arrowPressed) {
      gameStarted = true;

      var newDirectionIndex = ( COMPASS.indexOf(this.state.direction) + arrowPressed + 4 ) % 4;
      this.setState( { direction: COMPASS[newDirectionIndex] } );
    }
  },

  move: function() {
    var currentSnake = this.state.snake;
    var snakeHead = currentSnake[0];
    var movement = MOVEMENT[this.state.direction];
    var futureHead = { x: snakeHead.x + movement.x, y: snakeHead.y + movement.y };

    if(this.runIntoWall(futureHead) || this.isSnakeSegment(futureHead)) {
      gameOver = true;
      this.setState( { gameStatus: 'GAME OVER' } );
      return;
    }

    if( this.foundFood(futureHead) ) {
      var newFood = this.newFoodPosition();
      this.setState( { gameScore: this.state.gameScore + 1, snake: [futureHead].concat( currentSnake ), foodX: newFood.x, foodY: newFood.y });
    } else {
      this.setState( { snake: [futureHead].concat( currentSnake.slice(0, currentSnake.length - 1) )});
    }
  },

  runIntoWall: function(head) {
    if(head.x < 0 || head.x >= FIELD_SIZE || head.y < 0 || head.y >= FIELD_SIZE) {
      return true;
    }
    return false;
  },

  isSnakeSegment: function(coordinate) {
    var snake = this.state.snake;

    var found = false;
    for(var i = 0; i < snake.length; i++) {
      if (snake[i].x === coordinate.x && snake[i].y === coordinate.y ) {
        found = true;
        break;
      }
    }
    return found;
  },

  foundFood: function(nextCoordinate) {
    if(nextCoordinate.x === this.state.foodX && nextCoordinate.y === this.state.foodY) {
      return true;
    }
    return false;
  },

  newFoodPosition: function() {
    function randomPoint() {
      var randomNumber = Math.floor(Math.random() * ((FIELD_SIZE-GRID_SIZE) - 0)) + 1;
      var remainder = randomNumber % GRID_SIZE;
      return randomNumber - remainder;
    }

    var foodX, foodY;
    var positionFound = false;
    while(!positionFound) {
      foodX = randomPoint();
      foodY = randomPoint();
      if(!this.isSnakeSegment({x: foodX, y: foodY})) {
        positionFound = true;
      }
    }

    return { x: foodX, y: foodY};
  },

  render: function() {
    segments = [];
    segments.push( React.createElement(SnakeHead, { x: this.state.snake[0].x, y: this.state.snake[0].y, key: 0}) );
    for(var i=1; i< this.state.snake.length; i++) {
      var segment = this.state.snake[i];
      segments.push( React.createElement(SnakeSegment, { x: segment.x, y: segment.y, key: i}) );
    }

    return React.createElement('div', {},
      React.createElement(StatusBar, { gameStatus: this.state.gameStatus, gameScore: this.state.gameScore }),
      React.createElement('div', { id: 'svg-container', ref: 'svgContainer', style: { display: 'flex', justifyContent: 'center' }, tabIndex: '1', onKeyDown: this.changeDirection },
        React.createElement('svg', { style: { border: '1px solid black' }, 'width': FIELD_SIZE, 'height': FIELD_SIZE, tabIndex: '1', onKeyDown: this.changeDirection },
          segments,
          React.createElement(Food, { cx: this.state.foodX, cy: this.state.foodY })
        )
      )
    )
  }

});

var StatusBar = React.createClass({
  render: function() {
    return React.createElement('div', { style: { display: 'flex', justifyContent: 'space-around', padding: '5px 0' } },
      React.createElement('div', {}, this.props.gameStatus),
      React.createElement('div', {}, 'Score: ' + this.props.gameScore)
    )
  }
});

var SnakeHead = React.createClass({
  render: function() {
    return React.createElement('rect',{
      x: this.props.x,
      y: this.props.y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      stroke: 'darkgreen',
      fill: 'darkgreen'
    })
  }
});

var SnakeSegment = React.createClass({
  render: function() {
    return React.createElement('rect',{
      x: this.props.x,
      y: this.props.y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      stroke: 'darkolivegreen',
      fill: 'darkolivegreen'
    })
  }
});

var Food = React.createClass({
  render: function() {
    return React.createElement('circle', {
      cx: this.props.cx + GRID_SIZE/2,
      cy: this.props.cy + GRID_SIZE/2,
      r: (GRID_SIZE/2),
      stroke: 'red',
      fill: 'red'
    });
  }
});

ReactDOM.render(
  React.createElement(Game), document.getElementById('game')
);

function runGame() {
  if(gameStarted && !gameOver) {
    move();
  }
}

setInterval(runGame, 100);
