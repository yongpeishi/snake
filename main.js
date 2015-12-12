var SnakeSegment = React.createClass({
  getInitialState: function() {
    return {
      x: 10,
      y: 10
    }
  },

  changeDirection: function(e) {
    console.log('haha');
  },

  render: function() {
    return React.createElement('svg', { 'width': '500', 'height': '500', tabIndex: '1', onKeyPress: this.changeDirection },
      React.createElement('rect',{
        x: this.state.x,
        y: this.state.y,
        width: 10,
        height: 10,
        stroke: 'black',
        strokeWidth: 10,
        fill: 'black'
      })
  )}
});


ReactDOM.render(
  React.createElement(SnakeSegment), document.getElementById('field')
);

