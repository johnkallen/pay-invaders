import invoiceImg from './images/invoices.png';
import Paid from './Paid';
import Explosion from './Explosion';


class Invoice {

  constructor(type, x, y, getCards, addToScore, pushPaids, pushExplosion) {
    this.spriteWidth = 500;
    this.spriteHeight = 500;
    this.sizeModifier = 0.3;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x;
    this.y = y;
    this.lastX = this.x;
    this.speed = 5;
    this.directionX = this.speed;
    this.directionY = 0;
    this.markedForDeletion = false;
    this.facingLeft = false;
    this.image = new Image();
    this.image.src = invoiceImg;
    this.type = type;
    this.frame = 0;
    this.maxFrame = 2;
  
    this.shakeLeft = false;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 500;

    this.getCards = getCards;
    this.addToScore = addToScore;
    this.pushPaids = pushPaids;
    this.pushExplosion = pushExplosion;
    
  }

  update(deltatime) {
    
    this.timeSinceLastFrame += deltatime;

    if (this.timeSinceLastFrame > this.frameInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceLastFrame = 0;

    }

    if (this.type < 6) {
      // Check for Collisions
      const cards = this.getCards();

      // Adjust for space around image
      const myX = this.x + this.width * 0.25;
      const myW = this.width * 0.55;
      const myY = this.y + this.height * 0.25;
      const myH = this.height * 0.55;

      [...cards].forEach(object => {
        
        if (object.x > myX + myW ||
          object.x + object.width < myX ||
          object.y > myY + myH ||
          object.y + object.height < myY) {
            // no collision       
        } else {
          // *** collision detected ***
          switch(this.type) {
            case 1:
              object.markedForDeletion = true;
              this.type = 6;
              this.addToScore(10);
              this.markedForDeletion = true;
              this.pushPaids(new Paid(this.x, this.y, this.frame));
              break;
            case 2:
              object.markedForDeletion = true;
              this.type = 1;
              this.addToScore(10);
              this.pushPaids(new Paid(this.x, this.y, this.frame));
              break;
            case 3:
              object.markedForDeletion = true;
              this.type = 2;
              this.addToScore(10);
              this.pushPaids(new Paid(this.x, this.y, this.frame));
              break;
              case 4:
              object.markedForDeletion = true;
              this.type = 7;
              this.addToScore(55);
              this.pushExplosion(new Explosion(this.x, this.y, this.width));
              break;
              case 5:
              object.markedForDeletion = true;
              this.type = 7;
              this.addToScore(55);
              this.pushExplosion(new Explosion(this.x, this.y, this.width));
              break;
            default:
              object.markedForDeletion = true;
              this.type = 6;
              this.addToScore(10);
              this.markedForDeletion = true;
              this.pushPaids(new Paid(this.x, this.y, this.frame));
          }
        }
      });
    }
    
  }

  draw(ctx) {
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(this.x,this.y,this.width,this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, this.spriteHeight * this.type, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }

}

export default Invoice;