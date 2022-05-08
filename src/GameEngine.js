import  React  from 'react';
import Canvas from './Canvas';
import Raven from './Raven';
import Explosion from './Explosion';

import './GameEngine.css';


let ravens = [];
let explosions = [];
let particles = [];

let score = 0;
let timeToNextObject = 0
let timeInterval = 500;
let lastTime = 0;



window.addEventListener('click', function(e) {
  const canvas = document.getElementById('canvas2');
  const collisonCtx = canvas.getContext('2d');
  const detectPixelColor = collisonCtx.getImageData(e.x, e.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach(object => {
    if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
      // collision detected
      object.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(object.x, object.y, object.width));
    }
  })

});



class GameEngine extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gamePaused: false
    }
  }

  gameLost = () => {
    const num = Math.random();
    this.setState({
      gamePaused: true
    }, () => {
      // console.log("Game Paused");
    });
  }

  drawScore = (ctx) => {
    ctx.font = '50px Impact';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 45, 70);
  }

  drawGameOver = (ctx) => {
    ctx.font = '100px Avengeance';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER', window.innerWidth / 2, window.innerHeight / 2);
    ctx.fillStyle = 'gray';
    ctx.fillText('GAME OVER', window.innerWidth / 2 - 5, window.innerHeight / 2 - 5);
  }

  pushParticle = (oarticle) => {
    particles.push(oarticle);
  }


  animate = (ctx, collisionCtx, timestamp) => {
    
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    collisionCtx.canvas.width = window.innerWidth;
    collisionCtx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    collisionCtx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextObject += deltatime;
    if (timeToNextObject > timeInterval) {
      ravens.push(new Raven(this.gameLost, this.pushParticle));
      timeToNextObject = 0;
      ravens.sort(function(a,b){
        return a.width - b.width;
      })
    }
  
    this.drawScore(ctx, collisionCtx);
  
    // Draw and Animate Objects
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltatime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw(ctx, collisionCtx));
    
    // Remove deleted objects
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);

    if (this.state.gamePaused) this.drawGameOver(ctx);
  
  }


  render() {
    return (
      <Canvas draw={this.animate} gamePaused={this.state.gamePaused} />
    );
  }
}

export default GameEngine;