import paidImg from './images/invoices.png';

class Paid {

  constructor(x, y, frame) {
    this.spriteWidth = 500;
    this.spriteHeight = 500;
    this.sizeModifier = 0.3;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x;
    this.y = y;
    this.paidRow = 6;
    this.alpha = 1;
    this.lastX = this.x;
    this.speed = 5;
    this.directionX = Math.random() * 4 - 2;
    this.directionY = Math.random() * 2 - 3;
    this.spin = Math.random() * 6 - 3;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = paidImg;
    this.frame = frame;
    this.fadeOutTime = 500;
    this.currentTime = this.fadeOutTime;
    this.angle = 0;
    this.spin = Math.random() < 0.5 ? -1 : 1;
    
  }

  update(deltatime) {
    
    // this.angle += 5;
    this.x += this.directionX;
    this.y += this.directionY;

    // Fade Object
    this.currentTime -= deltatime;
    if (this.currentTime < 0) this.markedForDeletion = true;
    this.alpha = this.currentTime / this.fadeOutTime;
    if (this.alpha < 0) this.alpha = 0;
    if (this.alpha > 1) this.alpha = 1;
    
  }

  draw(ctx) {
    // ctx.strokeStyle = 'blue';
    // ctx.strokeRect(this.x,this.y,this.width,this.height);
    ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle * Math.PI/360);
    ctx.globalAlpha = this.alpha;
    // ctx.drawImage(this.image, this.frame * this.spriteWidth, this.spriteHeight * this.paidRow, 
    //   this.spriteWidth, this.spriteHeight, 0, 0, this.width, this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, this.spriteHeight * this.paidRow, 
      this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

}

export default Paid;