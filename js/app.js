 /** @type {HTMLCanvasElement} */
import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { EnergyBar, UI } from "./UI.js";

window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 40;
            this.speed = 4;
            this.player = new Player(this, this.speed);
            this.input = new InputHandler(this);
            this.background = new Background(this);
            this.UI = new UI(this);
            this.energyBar = new EnergyBar(this, 22, 135, 85, 10, 100, "white");
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = "black";
            this.time = 0;
            this.gameOver = false;
            this.lives = 3;
            this.player.currentState = this.player.states[1];
            this.player.currentState.enter();
        }
        update(deltatime){
            this.time += deltatime;
            this.background.update();
            this.player.update(this.input.keys, deltatime);
            // handleEnemies
            if (this.enemyTimer >= this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltatime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltatime);
            });
            // handleParticles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }
            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltatime);
            });
            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.energyBar.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.UI.draw(context);
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if (this.speed > 0){
                this.enemies.push(new ClimbingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltatime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltatime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});
