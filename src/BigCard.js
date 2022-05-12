import FadeOut from './FadeOut';
import cardImg from './images/virtpymt.png';
import Particle from './Particle';
import paidSnd from './sounds/ka-ching.mp3';


class BigCard {

  constructor(x, y, sizeModifier, pushParticle, getBoss, changeScene, setFadeOut) {
    
    this.spriteWidth = 330;
    this.spriteHeight = 500;
    this.sizeModifier = sizeModifier;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.image = new Image();
    this.image.src = cardImg;
    this.x = x;
    this.y = y;
    this.startY = y;
    this.speedY = 10;
    this.stage = 0;
    this.pushParticle = pushParticle;
    this.getBoss = getBoss;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 500;
    this.paidSound = new Audio();
    this.paidSound.src = paidSnd;
    this.changeScene = changeScene;
    this.setFadeOut = setFadeOut;

  }

  update(deltatime) {

    if (this.y > 200) {
      this.y -= this.speedY;
    } else {
      
      let blue = true;
      let boss = this.getBoss();
      if (this.stage === 0) {
        // Create Particles
        for (let i = boss.y - boss.height/2 - 20; i < boss.y + boss.height/2; i = i + 10) {
          for (let j = boss.x - boss.width/2 - 40; j < boss.x + boss.width/2; j = j +10 ) {

            if (blue) {this.pushParticle(new Particle(j, i, 50, '#016FD0')); blue = false;}
            else {this.pushParticle(new Particle(j, i, 50, '#FFFFFF')); blue = true;}
          }
        }

        const fadeOut = new FadeOut(this.changeScene);
        this.setFadeOut(fadeOut);

        this.stage = 1;
      } if (this.stage === 1) {
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
          boss.markedForDeletion = true;
          this.markedForDeletion = true;
          this.paidSound.play();
          this.stage = 2;
        }
      }

    }
    

    const dist = 1 - this.sizeModifier;
    const gap = 1 - (this.y / this.startY);
    const modifier = this.sizeModifier +  (gap * dist); 

    this.width = this.spriteWidth * modifier;
    this.height = this.spriteHeight * modifier;


    if (this.y < 0 - this.height) {
      this.markedForDeletion = true;
    }

  }
  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x - this.width/2, this.y, this.width, this.height);
  }

}

export default BigCard;