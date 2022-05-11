import  React  from 'react';
import Canvas from './Canvas';
import BGScene from './BGScene';
import Player from './Player';
import Invoice from './Invoice';

import './GameEngine.css';
import Row from './Row';


let player = undefined;
let keys = {};
let cards = [];
let invoices = [];
let paids = [];
let bits = [];
let explosions = [];
let rows = [];
let particles = [];
let score = 0;
let gameSpeed = 0.5;
let pauseGame = false;
let totalInvaders = 0;



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
    console.log('Game Lost');
    pauseGame = true;
    // const num = Math.random();
    // this.setState({
    //   gamePaused: true
    // }, () => {
    //   // console.log("Game Paused");
    // });
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

  getSpeed =() => {
    return gameSpeed;
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
          gameSpeed = 0.5; pauseGame = false; totalInvaders = 0;

          player = new Player(this.gameLost, this.getKeys, this.pushCard);

          const screenCenter = window.innerWidth/2;
          const testInvoice = new Invoice(0, window.innerWidth/2, window.innerHeight/3, this.getCards, this.addToScore, this.pushPaid, this.pushExplosion, new Row());
          const invaderWidth = testInvoice.width;
          const invaderHeight = testInvoice.height;
          const invaderSpacing = invaderWidth * 0.2;
          const invadersPerRow = 5;
          const invadersRows = 3;

          for (let i = 0; i < invadersRows; i++) {

            const rowHeight = invaderHeight;
            const rowSpacing = 30;
            const row = new Row(i, rowHeight * i + rowSpacing, rowHeight, this.getSpeed);
            rows.push(row);
            let pos = screenCenter - (((invadersPerRow * invaderWidth) + (invadersPerRow - 1) * invaderSpacing))/2;
            
            let maxFraud = 2;
            let maxOverCharge = 2;
            for (let j = 0; j < invadersPerRow; j++) {
              const randNum = Math.random() * 100 + 1;
              let invaderType = 0;
              if (maxFraud > 0 && randNum > 90) { invaderType = 5; maxFraud--;}
              if (maxOverCharge > 0 && randNum > 80 && randNum < 91) { invaderType = 4; maxOverCharge--;}
              if (randNum > 40 && randNum < 81) invaderType = 3;
              // Force at least 1 of each
              if (maxFraud > 0 && i === 0 && j === 1) invaderType = 5;
              if (maxOverCharge > 0 && i === 0 && j === 3) invaderType = 4;
              
              const invoice = new Invoice(invaderType, pos, row.y, this.getCards, this.addToScore, this.pushPaid, this.pushExplosion, row, player, this.gameLost);
              invoices.push(invoice);
              pos = pos + invaderWidth + invaderSpacing;
            }
          }

          lastScene = scene;
        } else {

           // Manage Game Scene
           this.drawScore(ctx);

          if (!pauseGame) {
            
            // Update Objects
            player.update(deltatime);
            [...particles, ...explosions, ...invoices, ...cards, ...paids, ...rows].forEach(object => object.update(deltatime));
          }

          // Draw Objects
          player.draw(ctx);
          [...particles, ...explosions, ...invoices, ...cards, ...paids].forEach(object => object.draw(ctx));
          
          // Remove deleted objects
          explosions = explosions.filter(object => !object.markedForDeletion);
          particles = particles.filter(object => !object.markedForDeletion);
          cards = cards.filter(object => !object.markedForDeletion);
          invoices = invoices.filter(object => !object.markedForDeletion);
          paids = paids.filter(object => !object.markedForDeletion);

          if (pauseGame) this.drawGameOver(ctx);
          

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