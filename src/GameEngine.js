import  React  from 'react';
import Canvas from './Canvas';
import BGScene from './BGScene';
import Player from './Player';
import Invoice from './Invoice';

import './GameEngine.css';
import Row from './Row';
import Boss from './Boss';
import beat1Snd from './sounds/invaders_01.wav';
import beat2Snd from './sounds/invaders_02.wav';
import beat3Snd from './sounds/invaders_03.wav';
import beat4Snd from './sounds/invaders_04.wav';
import amexImg from './images/amex_vpay.jpg';
import FadeIn from './FadeIn';


const startSpeed = 0.5;
const maxSpeed = 4.5;
const startCadence = 1000;
const maxCadence = 90;
const invadersPerRow = 5;
const invadersRows = 3;
const beat1 = new Audio();
const beat2 = new Audio();
const beat3 = new Audio();
const beat4 = new Audio();

let player = undefined;
let boss = undefined;
let fadeOut = undefined;
let fadeIn = undefined;
let logo = undefined;
let keys = {};
let cards = [];
let invoices = [];
let paids = [];
let bits = [];
let explosions = [];
let rows = [];
let particles = [];
let score = 0;
let gameSpeed = 0;
let pauseGame = false;
let totalInvaders = 10;
let beginningInvaders = 0;
let edgeDetected = false;
let bossStatus = 0;
let bossPause = 0;
let cadenceTime = 0;
let currentCadence = 0;
let beatNumber = 1;


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
  // console.log('CLICK');
  if (pauseGame) {
    lastScene = -1;
    pauseGame = false;
  }
  if (scene === 3) {
    window.location.href = "https://www.americanexpress.com/en-us/business/payments/vpayment/?linknav=US-oneAmex-axpSearchResults-1&searchresult=vpayment";
  }
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
    // console.log('Game Lost');
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


    ctx.font = '50px Avengeance';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Play Again', window.innerWidth / 2, window.innerHeight / 2 + 150);
    ctx.fillStyle = 'gray';
    ctx.fillText('Play Again', window.innerWidth / 2 - 5, window.innerHeight / 2 + 145);
  }

  drawYouWin = (ctx) => {
    ctx.font = '80px Avengeance';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'gray';
    ctx.fillText('YOU WIN', window.innerWidth / 2, window.innerHeight / 2 - 60);
    ctx.fillStyle = 'white';
    ctx.fillText('YOU WIN', window.innerWidth / 2 - 5, window.innerHeight / 2 - 65);
  }

  onlyTakesOne = (ctx) => {
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('It only takes one virtual payment', window.innerWidth / 2, window.innerHeight / 2 + 50);
    ctx.fillStyle = 'blue';
    ctx.fillText('It only takes one virtual payment', window.innerWidth / 2 - 5, window.innerHeight / 2 + 45);
  }

  noMatter = (ctx) => {
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('no matter the size of your invoice', window.innerWidth / 2, window.innerHeight / 2 + 120);
    ctx.fillStyle = 'blue';
    ctx.fillText('no matter the size of your invoice', window.innerWidth / 2 - 5, window.innerHeight / 2 + 115);

    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('Learn more about vPayment', window.innerWidth / 2, window.innerHeight / 2 + 220);
    ctx.fillStyle = 'white';
    ctx.fillText('Learn more about vPayment', window.innerWidth / 2 - 5, window.innerHeight / 2 + 215);
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

  subtractInvader = () => {
    totalInvaders--;
    if (totalInvaders === 0) {
      bossPause = 2000;
      bossStatus = 1;
    } else {
      // Adjust speed
      const ratio = 1 - totalInvaders/beginningInvaders;
      let tempSpeed = ratio * maxSpeed;
      if (tempSpeed < startSpeed) tempSpeed = startSpeed;
      let tempCadence = startCadence * (totalInvaders/beginningInvaders);
      if (tempCadence < maxCadence) tempCadence = maxCadence;

      gameSpeed = tempSpeed;
      cadenceTime = tempCadence;
      
    }
    
  }

  getBossStatus = () => {
    return bossStatus;
  }
  setBossStatus = (status) => {
    bossStatus = status;
  }

  getBoss = () => {
    return boss;
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

  getSpeed = () => {
    return gameSpeed;
  }

  setEdgeDetected = (status) => {
    edgeDetected = status;
  }
  getEdgeDetected = () => {
    return edgeDetected;
  }

  setFadeOut= (fo) => {
    fadeOut = fo;
  }

  changeScene = (number) => {
    scene = number;
  }

  playBGSound = (deltatime) => {
    if (!pauseGame) {
      if (bossStatus === 0 || bossStatus === 4) {
        currentCadence += deltatime;
        if (currentCadence > cadenceTime) {
          currentCadence = 0;
          if (beatNumber === 1) beat1.play();
          if (beatNumber === 2) beat2.play();
          if (beatNumber === 3) beat3.play();
          if (beatNumber === 4) beat4.play();
          beatNumber++;
          if (beatNumber > 4) beatNumber = 1;

        }
      }
    }
  };


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
          bits = []; explosions = []; particles = []; score = 0; bossStatus = 0;
          gameSpeed = startSpeed; pauseGame = false; totalInvaders = 0; edgeDetected = false;
          cadenceTime = startCadence;

          player = new Player(this.gameLost, this.getKeys, this.pushCard, this.getBossStatus, this.pushParticle, this.getBoss, this.changeScene, this.setFadeOut);

          beat1.src = beat1Snd;
          beat2.src = beat2Snd;
          beat3.src = beat3Snd;
          beat4.src = beat4Snd;

          const screenCenter = window.innerWidth/2;
          const testInvoice = new Invoice(0, window.innerWidth/2, window.innerHeight/3, this.getCards, this.addToScore, this.pushPaid, this.pushExplosion, new Row());
          const invaderWidth = testInvoice.width;
          const invaderHeight = testInvoice.height;
          const invaderSpacing = invaderWidth * 0.2;

          let maxFraud = 2;
          let maxOverCharge = 2;
          let maxMultiPay = 2;
          for (let i = 0; i < invadersRows; i++) {

            const rowHeight = invaderHeight;
            const rowSpacing = 30;
            const row = new Row(i, rowHeight * i + rowSpacing, rowHeight, this.getSpeed, this.getEdgeDetected, this.setEdgeDetected);
            rows.push(row);
            let pos = screenCenter - (((invadersPerRow * invaderWidth) + (invadersPerRow - 1) * invaderSpacing))/2;
            
            for (let j = 0; j < invadersPerRow; j++) {
              const randNum = Math.random() * 100 + 1;
              let invaderType = 0;
              if (maxFraud > 0 && randNum > 90) { invaderType = 5; maxFraud--;}
              if (maxOverCharge > 0 && randNum > 80 && randNum < 91) { invaderType = 4; maxOverCharge--;}
              if (maxMultiPay > 0 && randNum > 40 && randNum < 81) {invaderType = 3; maxMultiPay--;}
              // Force at least 1 of each
              if (maxFraud > 0 && i === 0 && j === 1) { invaderType = 5; maxFraud--;}
              if (maxOverCharge > 0 && i === 0 && j === 3) { invaderType = 4; maxOverCharge--;}
              
              const invoice = new Invoice(invaderType, pos, row.y, this.getCards, this.addToScore, this.pushPaid, this.pushExplosion, row, 
                player, this.gameLost, this.setEdgeDetected, this.subtractInvader);
              invoices.push(invoice);
              pos = pos + invaderWidth + invaderSpacing;
            }
          }
          totalInvaders = invoices.length;
          beginningInvaders = totalInvaders;

          lastScene = scene;
        } else {

           // Manage Game Scene
           this.drawScore(ctx);
           this.playBGSound(deltatime);

          if (bossStatus === 1) {
            bossPause -= deltatime;
            if (bossPause < 0) {
              boss = new Boss(window.innerWidth/2, -500, this.setBossStatus, this.getCards);
              bossStatus = 2;
            }
          }
          if (bossStatus === 3) {
            cadenceTime = 90;
            bossStatus = 4;
          }

          if (!pauseGame) {
            
            // Update Objects
            player.update(deltatime);
            [ ...explosions, ...invoices, ...cards, ...paids, ...rows, ...particles].forEach(object => object.update(deltatime));

            if (boss !== undefined) boss.update(deltatime);
            if (fadeOut !== undefined) fadeOut.update(deltatime);


          }

          // Draw Objects
          player.draw(ctx);
          if (boss !== undefined) boss.draw(ctx);
          [ ...explosions, ...invoices, ...cards, ...paids].forEach(object => object.draw(ctx));
          if (fadeOut !== undefined) fadeOut.draw(ctx);
          [ ...particles].forEach(object => object.draw(ctx));
          
          // Remove deleted objects
          explosions = explosions.filter(object => !object.markedForDeletion);
          particles = particles.filter(object => !object.markedForDeletion);
          cards = cards.filter(object => !object.markedForDeletion);
          invoices = invoices.filter(object => !object.markedForDeletion);
          paids = paids.filter(object => !object.markedForDeletion);
          if (boss !== undefined && boss.markedForDeletion) boss = undefined;

          if (pauseGame) this.drawGameOver(ctx);
          

        }
        break;
      case 3:
        if (scene !== lastScene) {
          // Setup End Scene
          fadeIn = new FadeIn();
          logo = new Image();
          logo.src = amexImg;

          lastScene = scene;
        } else {
          // Manage End Scene
          // Black Screen
          
          if (fadeIn !== undefined) fadeIn.update(deltatime);

          
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

          this.drawYouWin(ctx);
          this.onlyTakesOne(ctx);
          this.noMatter(ctx);
          
          if (logo !== undefined) ctx.drawImage(logo, 0, 0, 740, 555, window.innerWidth/2 - 150, window.innerHeight * 0.05, 300, 225);

          if (fadeIn !== undefined) fadeIn.draw(ctx);
          
          
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