import playerImg from './images/player.png';
import throwSnd from './sounds/throw.wav';
import Card from './Card';
import BigCard from './BigCard';


class Player {

  constructor(gameLost, getKeys, pushCard, getBossStatus, pushParticle, getBoss, changeScene, setFadeOut) {
    this.spriteWidth = 512;
    this.spriteHeight = 512;
    this.sizeModifier = 0.5;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = window.innerWidth/2 - (this.spriteWidth * this.sizeModifier)/2;
    this.y = window.innerHeight - (this.spriteHeight * this.sizeModifier) - (window.innerHeight * 0.03);
    this.lastX = this.x;
    this.speed = 5;
    this.directionX = this.speed;
    this.directionY = 0;
    this.markedForDeletion = false;
    this.facingLeft = false;
    this.image = new Image();
    this.image.src = playerImg;
    this.sound = new Audio();
    this.sound.src = throwSnd;
    this.action = 0;
    this.frame = 0;
    this.idleMaxFrame = 6;
    this.walkMaxFrame = 6;
    this.throwMaxFrame = 6;
    this.shakeLeft = false;
    this.timeSinceLastFrame = 0;
   
    this.walkFrameInterval = 100;
    this.throwFrameInterval = 100;
    this.shakeFrameInterval = 50;
    this.throwInProgress = false;
    
    this.gameLost = gameLost;
    this.getKeys = getKeys;
    this.pushCard = pushCard;
    this.getBossStatus = getBossStatus;
    this.pushParticle = pushParticle;
    this.getBoss = getBoss;
    this.changeScene = changeScene;
    this.setFadeOut = setFadeOut;

  }

  update(deltatime) {

    const bossStatus = this.getBossStatus();

    if (bossStatus === 2) {
      if (this.x + this.width/2 > window.innerWidth/2) this.facingLeft = true;
      else this.facingLeft = false;
      this.action = 3;
    }
    if (this.action === 3 && bossStatus === 4) this.action = 0;

    if (bossStatus !== 2) {
      // Update Player Controls
      const keys = this.getKeys();
      if (!this.throwInProgress && (keys['a'] || keys['ArrowLeft'])) {
        // Move Left
        this.facingLeft = true;
        if (this.x > 10) {
          this.x -= this.directionX;
          this.action = 2;
        }
      }
      if (!this.throwInProgress && (keys['d'] || keys['ArrowRight'])) {
        // Move Right;
        this.facingLeft = false;
        if (this.x < window.innerWidth - this.width) {
          this.x += this.directionX;
          this.action = 2;
        }
      }
      if (keys['Shift']) {
        // Throw Virtual Payment
        if (!this.throwInProgress) {
          this.throwInProgress = true;
          this.frame = 0; // Insure we start at frame 0
          this.action = 1;
        }

      }

    }

    if (this.action === 2 && this.lastX === this.x) this.action = 0;
    this.lastX = this.x;

    
    this.timeSinceLastFrame += deltatime;
    switch(this.action) {
      case 1:
        // Update Throw Animation
        if (this.timeSinceLastFrame > this.throwFrameInterval) {
          if (this.frame > this.throwMaxFrame) {
            this.frame = 0;
            this.throwInProgress = false;
            this.action = 0;
          }
          else {
            this.frame++;
          }
          if (this.frame === 1) this.sound.play();
          if (this.frame === 3) {
            if (this.facingLeft) {
              if (bossStatus === 4) {
                this.pushCard(new BigCard(this.x + this.width * 0.19, this.y + this.height * 0.1, 0.1,this.pushParticle, this.getBoss, this.changeScene, this.setFadeOut));
              } else {              
                this.pushCard(new Card(this.x + this.width * 0.19, this.y + this.height * 0.1, this.sizeModifier));
              }
            } else {
              if (bossStatus === 4) {
                this.pushCard(new BigCard(this.x + this.width * 0.7, this.y + this.height * 0.1, 0.1, this.pushParticle, this.getBoss, this.changeScene, this.setFadeOut));
              } else {
                this.pushCard(new Card(this.x + this.width * 0.7, this.y + this.height * 0.1, this.sizeModifier));
              }
            }
          }
          this.timeSinceLastFrame = 0;
        }
        break;
      case 2:
        // Update Walk Animation
        if (this.timeSinceLastFrame > this.walkFrameInterval) {
          if (this.frame > this.walkMaxFrame) this.frame = 0;
          else this.frame++;
          this.timeSinceLastFrame = 0;
        }
        break;
      case 3:
        // Scared Mode
        this.frame = 0;
        if (this.timeSinceLastFrame > this.shakeFrameInterval) {
          this.timeSinceLastFrame = 0;
          if (this.shakeLeft) { 
            this.shakeLeft = false;
            this.x -= 3;
          } else {
            this.shakeLeft = true;
            this.x += 3 ;
          }
        }

        break;
      default:
        // Update Idle Animation
        if (this.timeSinceLastFrame > this.idleFrameInterval) {
          if (this.frame > this.idleMaxFrame) this.frame = 0;
          else this.frame++;
          this.timeSinceLastFrame = 0;
          this.idleFrameInterval = Math.random() * 400 + 200;
        }
    }

    // if (this.x < 0 - this.width) this.gameLost();
    
  }
  draw(ctx) {
    
    const sprW = this.width;
    const sprH = this.height;
    const x = this.x;
    const y = window.innerHeight - (this.spriteHeight * this.sizeModifier) - (window.innerHeight * 0.03);


    // ctx.strokeRect(this.x,this.y,this.width,this.height);

    if (this.facingLeft) {
      // FLIP IMAGE
      ctx.save();
      ctx.scale(-1,1);
      ctx.drawImage(this.image, this.frame * this.spriteWidth, this.spriteHeight * this.action, this.spriteWidth, this.spriteHeight, -x, y, -sprW, sprH);
      ctx.restore();
    } else {
      // NORMAL IMAGE
      ctx.drawImage(this.image, this.frame * this.spriteWidth, this.spriteHeight * this.action, this.spriteWidth, this.spriteHeight, x, y, sprW, sprH);
    }
  }

}

export default Player;