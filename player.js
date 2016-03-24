function Player(initX, initY) {
  return {
    score: 0,
    snake: [{x: initX, y: initY}],
    direction: NORTH,
    isAlive: true,
    incrementScore: function() {
      var currentScore = this.score;
      this.score = currentScore + 1;
    },
    isSnakeSegment: function(coordinate) {
      var found = false;
      for(var i = 0; i < this.snake.length; i++) {
        if (this.snake[i].x === coordinate.x && this.snake[i].y === coordinate.y ) {
          found = true;
          break;
        }
      }
      return found;
    },
    processIntersectionWith: function(otherPlayers) {
      var allSnakeSegments = otherPlayers.reduce(function(segments, p) {
        return segments.concat(p.snake);
      }, []);
      var head = this.snake[0];
      var intersected = _.some(allSnakeSegments, head);
      if(intersected) {
        this.isAlive = false;
      }
    }
  }
}
