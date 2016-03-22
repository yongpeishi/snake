var gameStarted = false;
var gameOver = false;
var move = function() {};

var Game = React.createClass({
  getInitialState: function() {
    return {
      isGameOver: false,
      players: [Player(100,100), Player(150,100)],
      foodX: 50,
      foodY: 50
    }
  },

  componentDidMount: function() {
    this.refs.svgContainer.focus();
    move = this.move;
  },

  updatePlayer: function(playerNumber, newPlayer) {
    var newPlayersSet = this.state.players;
    newPlayersSet[playerNumber] = newPlayer;
    this.setState( { players: newPlayersSet } );
  },

  changeDirection: function(e) {
    var keyCodes = {
      65 : { playerNumber: 0, rotation: -1},
      83 : { playerNumber: 0, rotation: 1},
      75 : { playerNumber: 1, rotation: -1},
      76 : { playerNumber: 1, rotation: 1}
    }

    var keyCode = keyCodes[e.keyCode];
    if(keyCode) {
      gameStarted = true;

      var player = this.state.players[keyCode.playerNumber];
      var newDirectionIndex = ( COMPASS.indexOf(player.direction) + keyCode.rotation + 4 ) % 4;
      player.direction = COMPASS[newDirectionIndex];
      this.updatePlayer(keyCode.playerNumber, player);
    }
  },

  move: function() {
    var players = this.state.players;
    var playersFutureState = [];
    var makeNewFood = false;

    for(var i=0; i < players.length; i++) {
      var player = players[i];
      var currentSnake = player.snake;
      var snakeHead = currentSnake[0];
      var movement = MOVEMENT[player.direction];

      var futureHead = { x: snakeHead.x + movement.x, y: snakeHead.y + movement.y };

      if(this.runIntoWall(futureHead) || player.isSnakeSegment(futureHead)) {
        gameOver = true;
      } else if( this.foundFood(futureHead) ) {
        makeNewFood = true;
        player.incrementScore();
        player.snake = [futureHead].concat( currentSnake );
      } else {
        player.snake = [futureHead].concat( currentSnake.slice(0, currentSnake.length-1) );
      }

      playersFutureState.push(player);
    }

    if(!gameOver && makeNewFood) {
      var newFood = this.newFoodPosition();
      this.setState({ players: playersFutureState, foodX: newFood.x, foodY: newFood.y });
    } else {
      this.setState({ players: playersFutureState, isGameOver: gameOver });
    }
  },

  runIntoWall: function(head) {
    if(head.x < 0 || head.x >= FIELD_SIZE || head.y < 0 || head.y >= FIELD_SIZE) {
      return true;
    }
    return false;
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
      if(!this.state.players[0].isSnakeSegment({x: foodX, y: foodY})) {
        positionFound = true;
      }
    }

    return { x: foodX, y: foodY};
  },

  render: function() {
    var snakes = [];

    for(var p=0; p < this.state.players.length; p++) {
      var player = this.state.players[p];
      var segments = [];
      segments.push( React.createElement(SnakeHead, { x: player.snake[0].x, y: player.snake[0].y, key: 0}) );
      for(var i=1; i< player.snake.length; i++) {
        var segment = player.snake[i];
        segments.push( React.createElement(SnakeSegment, { x: segment.x, y: segment.y, key: i}) );
      }
      snakes.push(segments);
    }

    return React.createElement('div', {},
      React.createElement(StatusBar, { isGameOver: this.state.isGameOver, playerScore: this.state.players[0].score }),
      React.createElement('div', { id: 'svg-container', ref: 'svgContainer', style: { display: 'flex', justifyContent: 'center' }, tabIndex: '1', onKeyDown: this.changeDirection },
        React.createElement('svg', { style: { border: '1px solid black' }, 'width': FIELD_SIZE, 'height': FIELD_SIZE, tabIndex: '1', onKeyDown: this.changeDirection },
          snakes[0],
          snakes[1],
          React.createElement(Food, { cx: this.state.foodX, cy: this.state.foodY })
        )
      )
    )
  }

});

var StatusBar = React.createClass({
  render: function() {
    var gameStatus = this.props.isGameOver ? 'GAME OVER' : '';
    return React.createElement('div', { style: { display: 'flex', justifyContent: 'space-around', padding: '5px 0' } },
      React.createElement('div', {}, gameStatus),
      React.createElement('div', {}, 'Score: ' + this.props.playerScore)
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
