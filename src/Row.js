class Row {

  constructor(id, y) {
    
    this.id = id;
    this.y = y;
    this.startingY = this.y;
    this.direction = 'RIGHT';
    this.edgeDetected = false;
    this.changeInProgress = false;
    this.speed = 5;

  }

  update(deltatime) {

    // this.x += this.speedX;
    // this.radius += 0.3;
    // if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
  }
  draw(ctx) {

  }

}

export default Row;