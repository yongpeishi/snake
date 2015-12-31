function Player() {
  return {
    score: 0,
    snake: [{x: 100, y: 100}],
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
  }
}
