var move = function() {};

var SnakeSegment = React.createClass({
  getInitialState: function() {
    return {
      x: 10,
      y: 10
    }
  },

  changeDirection: function(e) {
    var newState = {
      'ArrowUp': function(currentX, currentY) {
        newY = Math.max(currentY - 10, 0);
        return {x: currentX, y: newY}
      },
      'ArrowDown': function(currentX, currentY) {
        newY = Math.min(currentY + 10, 500-10);
        return {x: currentX, y: newY}
      },
      'ArrowLeft': function(currentX, currentY) {
        newX = Math.max(currentX - 10, 0);
        return {x: newX, y: currentY}
      },
      'ArrowRight': function(currentX, currentY) {
        newX = Math.min(currentX + 10, 500-10);
        return {x: newX, y: currentY}
      }
    };

    var that = this;
    var pressedKey = e.key;
    move = function() { that.setState(newState[pressedKey](that.state.x, that.state.y)); };
  },

  render: function() {
    return React.createElement('svg', { 'width': '500', 'height': '500', tabIndex: '1', onKeyDown: this.changeDirection },
      React.createElement('rect',{
        x: this.state.x,
        y: this.state.y,
        width: 10,
        height: 10,
        stroke: 'black',
        fill: 'black'
      })
  )}
});


ReactDOM.render(
  React.createElement(SnakeSegment), document.getElementById('field')
);

setInterval(function() { move() }, 1000);
