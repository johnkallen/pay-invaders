import  React  from 'react';
import Canvas from './Canvas';
import BGScene from './BGScene';
import Player from './Player';
import Invoice from './Invoice';
import Explosion from './Explosion';

import './GameEngine.css';

let invoice = undefined;

let player = undefined;
let keys = {};
let cards = [];
let invoices = [];
let paids = [];
let bits = [];
let explosions = [];
let particles = [];
let score = 0;


let lastTime = 0;
let scene = 2;
let lastScene = -1;

window.addEventListener("keydown", function(e) {
  keys[e.key] = true;
});
window.addEventListener("keyup",  function(e) {
  keys[e.key] = false;
});


window.addEventListener('click', function(e) {
  const canvas = document.getElementById('canvas2');
  // const collisonCtx = canvas.getContext('2d');
  // const detectPixelColor = collisonCtx.getImageData(e.x, e.y, 1, 1);
  // const pc = detectPixelColor.data;
  // ravens.forEach(object => {
  //   if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
  //     // collision detected
  //     object.markedForDeletion = true;
  //     score++;
  //     explosions.push(new Explosion(object.x, object.y, object.width));
  //   }
  // })

});


class GameEngine extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gamePaused: false
    }
  }

  getKeys = () => {
    return keys;
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
    
    ctx.font = '50px Avengeance';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = '#016FD0';
    ctx.fillText('Score: ' + score, 48, 73);
    
  }

  drawGameOver = (ctx) => {
    ctx.font = '100px Avengeance';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER', window.innerWidth / 2, window.innerHeight / 2);
    ctx.fillStyle = 'gray';
    ctx.fillText('GAME OVER', window.innerWidth / 2 - 5, window.innerHeight / 2 - 5);
  }

  pushParticle = (particle) => {
    particles.push(particle);
  }

  pushCard = (card) => {
    cards.push(card);
  }

  getCards = () => {
    return cards;
  }

  pushPaid = (paid) => {
    paids.push(paid);
  }

  pushExplosion = (explosion) => {
    explosions.push(explosion);
  }

  pushBits = (bit) => {
    bits.push(bit);
  }

  addToScore = (points) => {
    score += points;
  }

  collisionDetected = (obj1, obj2) => {
    if (obj1.x > obj2.x + obj2.width ||
      obj1.x + obj1.width < obj2.x ||
      obj1.y > obj2.y + obj2.width ||
      obj1.y + obj1.width < obj2.y) {
        // no collision
        return false;
    } else {
      // collision detected
      return true;
    }
  }


  animate = (ctx, timestamp) => {

    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;

    switch(scene) {
      case 0:
        if (scene !== lastScene) {
          // Setup Title Scene


          lastScene = scene;
        } else {
          // Manage Title Scene

          
        }
        break;
      case 1:
        if (scene !== lastScene) {
          // Setup Instunctions Scene


          lastScene = scene;
        } else {
          // Manage Instructions Scene

          
        }
        break;
      case 2:
        if (scene !== lastScene) {
          // Setup Game Scene / Reset Varaiables
          keys = {}; cards = []; invoices = []; paids = [];
          bits = []; explosions = []; particles = []; score = 0;

          invoice = new Invoice(3, window.innerWidth/2, window.innerHeight/3, this.getCards, this.addToScore, this.pushPaid, this.pushExplosion);
          invoices.push(invoice);
          player = new Player(this.gameLost, this.getKeys, this.pushCard);

          lastScene = scene;
        } else {
          // Manage Game Scene
          this.drawScore(ctx);
  
          // Update Objects
          player.update(deltatime);
          [...particles, ...explosions, ...invoices, ...cards, ...paids].forEach(object => object.update(deltatime));

          // Draw Objects
          player.draw(ctx);
          [...particles, ...explosions, ...invoices, ...cards, ...paids].forEach(object => object.draw(ctx));
          
          // Remove deleted objects
          explosions = explosions.filter(object => !object.markedForDeletion);
          particles = particles.filter(object => !object.markedForDeletion);
          cards = cards.filter(object => !object.markedForDeletion);
          invoices = invoices.filter(object => !object.markedForDeletion);
          paids = paids.filter(object => !object.markedForDeletion);

          if (this.state.gamePaused) this.drawGameOver(ctx);

        }
        break;
    }
    
  }


  render() {
    return (
      <div>
        <BGScene />
        <Canvas draw={this.animate} gamePaused={this.state.gamePaused} />
      </div>
    );
  }
}

export default GameEngine;