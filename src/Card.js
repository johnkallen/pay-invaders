import cardImg from './images/virtpymtSM.png';


class Card {

  constructor(x, y, sizeModifier) {
    
    this.spriteWidth = 66;
    this.spriteHeight = 100;
    this.sizeModifier = sizeModifier;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.image = new Image();
    this.image.src = cardImg;
    this.x = x;
    this.y = y;
    this.speedY = 10;

  }

  update(deltatime) {

    this.y -= this.speedY;
    if (this.y < 0 - this.height) {
      this.markedForDeletion = true;
    }

  }
  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }

}

export default Card;