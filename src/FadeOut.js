class FadeOut {

  constructor(changeScene) {
    
    this.fadeOutTime = 2000;
    this.currentTime = 0;
    this.changeScene = changeScene;

  }

  update(deltatime) {

    // Fade Object
    this.currentTime += deltatime;
    if (this.currentTime < 0) this.markedForDeletion = true;
    this.alpha = this.currentTime / this.fadeOutTime;
    if (this.alpha < 0) this.alpha = 0;
    if (this.alpha > 0.9)  this.changeScene(3);
    if (this.alpha > 1) this.alpha = 1;
  }

  
  draw(ctx) {

    
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
    
  }

}

export default FadeOut;