class FadeIn {

  constructor() {
    
    this.fadeOutTime = 2000;
    this.currentTime = 0;
    this.markedForDeletion = false;

  }

  update(deltatime) {

    // Fade Object
    this.currentTime += deltatime;
    if (this.currentTime > this.fadeOutTime) this.markedForDeletion = true;
    this.alpha = 1 - this.currentTime / this.fadeOutTime;
    if (this.alpha < 0) this.alpha = 0;
    if (this.alpha > 1) this.alpha = 1;
    // console.log('alpha: ' + this.alpha);

  }

  
  draw(ctx) {

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
    
  }

}

export default FadeIn;