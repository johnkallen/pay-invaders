import invoiceImg from './images/invoices.png';
import Paid from './Paid';
import Explosion from './Explosion';


class Invoice {

  constructor(type, x, y, getCards, addToScore, pushPaids, pushExplosion, row, player, gameLost, setEdgeDetected) {
    this.spriteWidth = 500;
    this.spriteHeight = 500;
    this.sizeModifier = 0.3;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x;
    this.y = y;
    this.lastX = this.x;
    this.row = row;
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
    this.player = player;
    this.gameLost = gameLost;
    this.setEdgeDetected = setEdgeDetected;
    
    
  }

  update(deltatime) {
    
    this.timeSinceLastFrame += deltatime;

    if (this.timeSinceLastFrame > this.frameInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else this.frame++;
      this.timeSinceLastFrame = 0;
    }
    
    // Move Invoice
    if (this.row.direction === 'RIGHT') {
      this.x += this.row.speed;
    } else if (this.row.direction === 'LEFT') {
      this.x += -this.row.speed;
    }

    this.y = this.row.y; // updated via row object

    if (!this.row.changeInProgress) {
      // Check for Edge
      if (this.row.direction === 'RIGHT' && this.x > window.innerWidth - this.width) {
        this.setEdgeDetected(true);
      } else if (this.row.direction === 'LEFT' && this.x < 0) {
        this.setEdgeDetected(true);
      }
    }
    
    

    if (this.type < 6) {
      // Check for Collisions
      const cards = this.getCards();

      // Adjust for space around image
      const myX = this.x + this.width * 0.25;
      const myW = this.width * 0.5;
      const myY = this.y + this.height * 0.25;
      const myH = this.height * 0.55;

      // Check for Player Collision
      const pX = this.player.x + this.player.width * 0.25;
      const pW = this.player.width * 0.55;
      const pY = this.player.y + this.player.height * 0.10;
      const pH = this.player.height * 0.95;
      if (pX > myX + myW ||
        pX + pW < myX ||
        pY > myY + myH ||
        pY + pH < myY) {
          // no collision       
      } else {
        // *** collision with PLAYER detected ***
        console.log('pX: ' + pX + '  pW: ' + pW + '  pY: ' + pY + '  pH: ' + pH);
        console.log('mX: ' + myX + '  mW: ' + myW + '  mY: ' + myY + '  mH: ' + myH);
        this.gameLost();
      }

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
              this.addToScore(300);
              this.markedForDeletion = true;
              this.pushPaids(new Paid(this.x, this.y, this.frame));
              break;
            case 2:
              object.markedForDeletion = true;
              this.type = 1;
              this.addToScore(150);
              this.pushPaids(new Paid(this.x, this.y, this.frame));
              break;
            case 3:
              object.markedForDeletion = true;
              this.type = 2;
              this.addToScore(100);
              this.pushPaids(new Paid(this.x, this.y, this.frame));
              break;
              case 4:
              object.markedForDeletion = true;
              this.type = 7;
              this.addToScore(400);
              this.pushExplosion(new Explosion(this.x, this.y, this.width));
              break;
              case 5:
              object.markedForDeletion = true;
              this.type = 7;
              this.addToScore(5);
              this.pushExplosion(new Explosion(this.x, this.y, this.width));
              break;
            default:
              object.markedForDeletion = true;
              this.type = 6;
              this.addToScore(100);
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