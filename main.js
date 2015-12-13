var GRID_SIZE = 10;
var FIELD_SIZE = 500;

var gameOver = false;
var move = function() {};

var Game = React.createClass({
  getInitialState: function() {
    return {
      gameStatus: '',
      gameScore: 0,
      snake: [ {x:10, y:10} ],
      foodX: 50,
      foodY: 50
    }
  },

  changeDirection: function(e) {
    var newState = {
      'ArrowUp': function(currentX, currentY) {
        newY = currentY - GRID_SIZE;
        return {x: currentX, y: newY};
      },
      'ArrowDown': function(currentX, currentY) {
        newY = currentY + GRID_SIZE;
        return {x: currentX, y: newY}
      },
      'ArrowLeft': function(currentX, currentY) {
        newX = currentX - GRID_SIZE;
        return {x: newX, y: currentY}
      },
      'ArrowRight': function(currentX, currentY) {
        newX = currentX + GRID_SIZE;
        return {x: newX, y: currentY}
      }
    };

    var that = this;
    var newPosition =  newState[e.key];
    if(newPosition) {
      move = function() {
        var currentSnake = that.state.snake;
        var snakeHead = currentSnake[0];
        var futureHead = newPosition(snakeHead.x, snakeHead.y);

        if(that.runIntoWall(futureHead) || that.runIntoSelf(futureHead)) {
          gameOver = true;
          that.setState( { gameStatus: 'GAME OVER' } );
          return;
        }

        if( that.foundFood(futureHead) ) {
          var newFood = that.newFoodPosition();
          that.setState( { gameScore: that.state.gameScore + 1, snake: [futureHead].concat( currentSnake ), foodX: newFood.x, foodY: newFood.y });
        } else {
          that.setState( { snake: [futureHead].concat( currentSnake.slice(0, currentSnake.length - 1) )});
        }
      };
    }
  },

  runIntoWall: function(head) {
    if(head.x < 0 || head.x >= FIELD_SIZE || head.y < 0 || head.y >= FIELD_SIZE) {
      return true;
    }
    return false;
  },

  runIntoSelf: function(head) {
    var snake = this.state.snake;

    var found = false;
    for(var i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y ) {
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
    return { x: randomPoint(), y: randomPoint()};
  },

  render: function() {
    segments = [];
    for(var i=0; i< this.state.snake.length; i++) {
      var segment = this.state.snake[i];
      segments.push( React.createElement(SnakeSegment, { x: segment.x, y: segment.y, key: i}) );
    }

    return React.createElement('div', {},
      React.createElement(StatusBar, { gameStatus: this.state.gameStatus, gameScore: this.state.gameScore }),
      React.createElement('svg', { 'width': FIELD_SIZE, 'height': FIELD_SIZE, tabIndex: '1', onKeyDown: this.changeDirection },
        segments,
        React.createElement(Food, { cx: this.state.foodX, cy: this.state.foodY })
      )
    )
  }

});

var StatusBar = React.createClass({
  render: function() {
    return React.createElement('div', {style: { 'display': 'flex', 'justifyContent': 'space-around'} },
      React.createElement('div', {}, this.props.gameStatus),
      React.createElement('div', {}, this.props.gameScore)
    )
  }
});

var SnakeSegment = React.createClass({
  render: function() {
    return React.createElement('rect',{
      x: this.props.x,
      y: this.props.y,
      width: GRID_SIZE,
      height: GRID_SIZE,
      stroke: 'black',
      fill: 'black'
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
  if(!gameOver) {
    move();
  }
}

setInterval(runGame, 100);
