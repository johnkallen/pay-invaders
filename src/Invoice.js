import invoiceImg from './images/invoices.png';
import paidSnd from './sounds/ka-ching.mp3';
import explodeSnd from './sounds/boom.wav';
import Paid from './Paid';


class Invoice {

  constructor(type, x, y, getCards, addToScore, pushPaids, gameLost, getKeys, pushCard) {
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

    this.paidSound = new Audio();
    this.paidSound.src = paidSnd;
    this.explodeSound = new Audio();
    this.explodeSound.src = explodeSnd;
    this.type = type;
    this.frame = 0;
    this.maxFrame = 2;
  
    this.shakeLeft = false;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 500;


    this.getCards = getCards;
    this.addToScore = addToScore;
    this.pushPaids =pushPaids;
    
  }

  update(deltatime) {
    
    this.timeSinceLastFrame += deltatime;

    if (this.timeSinceLastFrame > this.frameInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceLastFrame = 0;

      switch(this.type) {
        case 6:
          this.frame = 1; // Hold Up


          
          break;
        default:
          // SINGLE INVOICE
      }

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
          // collision detected
          // console.log('*****  COLLISION!!!  *****');
          if (this.type < 4) {
            object.markedForDeletion = true;
            this.type = 6;
            this.paidSound.play();
            this.addToScore(10);
            this.markedForDeletion = true;
            this.pushPaids(new Paid(this.x, this.y, this.frame));
          }
        }
      });
    }


    // if (this.x < 0 - this.width) this.gameLost();
    
  }

  draw(ctx) {
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(this.x,this.y,this.width,this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, this.spriteHeight * this.type, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }

}

export default Invoice;