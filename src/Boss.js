import bossImg from './images/big_invoice.png';
import bossSnd from './sounds/growl.wav';
import musicSnd from './sounds/2001.mp3';


class Boss {

  constructor(x, y, setStatus, getCards) {
    this.spriteWidth = 694;
    this.spriteHeight = 818;
    this.sizeModifier = 0.8;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = x;
    this.y = y;
    this.stage = 0;
    this.wait = 1000;
    this.directionY = 0.5;
    this.setStatus = setStatus;
    this.timeSinceLastFrame = 0;
    this.stompFrameInterval = 350;
    this.runFrameInterval = 50;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = bossImg;
    this.bossSound = new Audio();
    this.bossSound.src = bossSnd;
    this.angle = 0;
    this.goingRight = true;
    this.getCards = getCards;

  }

  update(deltatime) {

    if (this.stage === 0) {
      this.bossSound.play();
      this.wait = 3000;
      this.stage = 1;
    }
    if (this.stage === 1) {
      this.wait -= deltatime;
      if (this.wait < 0) {
        const music = new Audio();
        music.src = musicSnd;
        music.play();
        this.wait = 13000;
        this.stage = 2;
      }
    }
    if (this.stage === 2) {
      this.wait -= deltatime;
      this.y += this.directionY;
      if (this.wait < 0) {
        this.wait = 4500;
        this.stage = 3;
      }
    }
    if (this.stage === 3) {
      this.wait -= deltatime;
      this.y += this.directionY;
      this.timeSinceLastFrame += deltatime;
      if (this.timeSinceLastFrame > this.stompFrameInterval) {
        if (this.angle < 1) {
          this.angle = 10;
        } else {
          this.angle = -10;
        }
        this.timeSinceLastFrame = 0;
      }
      
      if (this.wait < 0) {
        this.wait = 7500;
        this.stage = 4;
      }
    }
    if (this.stage === 4) {
      this.wait -= deltatime;
      this.y += this.directionY;
      
      if (this.wait < 0) {
        this.wait = 3000;
        this.stage = 5;
      }
    }
    if (this.stage === 5) {
      this.wait -= deltatime;
      this.bossSound.play();
      this.y += this.directionY;
      if (this.angle < 1) {
        this.angle = 5;
      } else {
        this.angle = -5;
      }
      if (this.wait < 0) {
        this.wait = 1000;
        this.stage = 6;
      }
    }
    if (this.stage === 6) {
      this.wait -= deltatime;
      this.angle = 0;
      
      if (this.wait < 0) {
        this.setStatus(3);
        this.stage = 7;
       
      }
    }
    if (this.stage === 7) {
      const cards = this.getCards();
      [...cards].forEach(object => {
        
        if (object.x > this.x + this.width ||
          object.x + object.width < this.x ||
          object.y > this.y + this.height ||
          object.y + object.height < this.y) {
            // no collision       
        } else {
          // *** collision detected ***
          this.angle = 0;
          this.stage = 8;
        }
      });

      if (this.goingRight && this. x > window.innerWidth * 0.75) this.goingRight = false;
      if (!this.goingRight && this. x < window.innerWidth * 0.25) this.goingRight = true;

      if (this.goingRight) {
        this.x += 10;
      } else {
        this.x -= 10;
      }
      this.timeSinceLastFrame += deltatime;
      if (this.timeSinceLastFrame > this.runFrameInterval) {
        if (this.angle < 1) {
          this.angle = 5;
        } else {
          this.angle = -5;
        }
        this.timeSinceLastFrame = 0;
      }
    }
    if (this.stage === 8) {
      this.setStatus(5);
      this.angle = 0;
      // this.markedForDeletion = true;
    }

    
  }

  draw(ctx) {

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle * Math.PI/360);

    // ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, -this.width/2, -this.height/2, this.width, this.height);

    ctx.restore();
  }

}

export default Boss;