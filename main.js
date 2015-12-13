var GRID_SIZE = 10;
var FIELD_SIZE = 500;

var move = function() {};

var Game = React.createClass({
  getInitialState: function() {
    return {
      x: 10,
      y: 10,
      foodX: 50,
      foodY: 50
    }
  },

  changeDirection: function(e) {
    var newState = {
      'ArrowUp': function(currentX, currentY) {
        newY = Math.max(currentY - GRID_SIZE, 0);
        return {x: currentX, y: newY}
      },
      'ArrowDown': function(currentX, currentY) {
        newY = Math.min(currentY + GRID_SIZE, FIELD_SIZE-GRID_SIZE);
        return {x: currentX, y: newY}
      },
      'ArrowLeft': function(currentX, currentY) {
        newX = Math.max(currentX - GRID_SIZE, 0);
        return {x: newX, y: currentY}
      },
      'ArrowRight': function(currentX, currentY) {
        newX = Math.min(currentX + GRID_SIZE, FIELD_SIZE-GRID_SIZE);
        return {x: newX, y: currentY}
      }
    };

    var that = this;
    var newPosition =  newState[e.key];
    if(newPosition) {
      move = function() { that.setState(newPosition(that.state.x, that.state.y)); };
    }
    this.generateFood();
  },

  generateFood: function() {
    function randomPoint() {
      var randomNumber = Math.floor(Math.random() * ((FIELD_SIZE-GRID_SIZE) - 0)) + 1;
      var remainder = randomNumber % GRID_SIZE;
      return randomNumber - remainder + (GRID_SIZE/2);
    }
    this.setState({foodX: randomPoint(), foodY: randomPoint() });
  },

  render: function() {
    return React.createElement('svg', { 'width': FIELD_SIZE, 'height': FIELD_SIZE, tabIndex: '1', onKeyDown: this.changeDirection },
      React.createElement(SnakeSegment, { x: this.state.x, y: this.state.y }),
      React.createElement(Food, { cx: this.state.foodX, cy: this.state.foodY })
  )}
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
      cx: this.props.cx,
      cy: this.props.cy,
      r: (GRID_SIZE/2),
      stroke: 'red',
      fill: 'red'
    });
  }
});


ReactDOM.render(
  React.createElement(Game), document.getElementById('field')
);

setInterval(function() { move() }, 1000);
