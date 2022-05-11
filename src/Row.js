class Row {

  constructor(id, y, distanceToNextRow, getGameSpeed) {
    
    this.id = id;
    this.y = y;
    this.distanceToNextRow = distanceToNextRow;
    this.targetY = this.y;
    this.direction = 'RIGHT';
    this.prevDirection = '';
    this.edgeDetected = false;
    this.changeInProgress = false;
    this.speed = 0;
    this.getGameSpeed = getGameSpeed;

  }

  update(deltatime) {

    this.speed = this.getGameSpeed();

    if (this.direction !== 'DOWN' && this.edgeDetected) {
      this.prevDirection = this.direction;
      this.direction = 'DOWN';
      this.targetY = this.y + this.distanceToNextRow;
    } else if (this.direction === 'DOWN') {
      this.y += this.speed * 4;
      if (this.y > this.targetY) {
        if (this.prevDirection === 'RIGHT') {
          this.direction = 'LEFT';
        } else {
          this.direction = 'RIGHT';
        }
        
        this.edgeDetected = false;
      }


    }


    // this.x += this.speedX;
    // this.radius += 0.3;
    // if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;


  }
  draw(ctx) {

  }

}

export default Row;