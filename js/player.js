import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit, KO } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js"
import { FloatingMessage } from "./floatingMessages.js"

export class Player {
    constructor(game, gameSpeed){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.gravity = 1;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 6;
        this.animationTimerKO = 0;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps;
        this.speed = 0;
        this.maxSpeed = 10;
        this.gameSpeed = gameSpeed;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game), new KO(this.game)];
        this.currentState = null;
    }
    update(input, deltatime){
        this.checkCollision();
        this.currentState.handleInput(input);
        // horizontal movement
        this.x += this.speed;
        if (input.includes("ArrowLeft") && this.currentState !== this.states[6] && this.currentState !== this.states[7]) this.speed = -this.maxSpeed;
        else if (input.includes("ArrowRight") && this.currentState !== this.states[6] && this.currentState !== this.states[7]) this.speed = this.maxSpeed;
        else this.speed = 0;
        // horizontal boundaries
        if (this.x + this.width >= this.game.width) this.x = this.game.width - this.width;
        if (this.x <= 0) this.x = 0;
        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.gravity;
        else this.vy = 0;
        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        if (this.y <= 0) this.y = 0;
        // animate
        if (this.frameTimer >= this.frameInterval && this.animationTimerKO < 1){
            this.frameTimer = 0;
            if (this.frameX >= this.maxFrame) {
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            if (this.currentState === this.states[7] && this.frameX >= this.maxFrame){
                this.animationTimerKO++;
                this.game.gameOver = true;
            }
        } else {
            this.frameTimer += deltatime;
        }
        // energy managment
        if (this.currentState === this.states[4]){
            this.game.energyBar.update(1);
        } else {
            this.game.energyBar.update(-1);
        }
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = speed;
        this.currentState.enter();
        if (this.currentState === this.states[0]) {
            this.game.floatingMessages.push(new FloatingMessage("-3", this.x, this.y, 125, 45));
            this.game.score -= 3;
            if (this.game.score < 0) this.game.score = 0;
        }
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if ( // collision detected
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                enemy.markedForDeletion = true;
                this.game.collisions.unshift(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage("+1", enemy.x, enemy.y, 125, 45));
                } else {
                    this.game.floatingMessages.push(new FloatingMessage("-4", enemy.x, enemy.y, 125, 45));
                    this.game.lives--;
                    this.game.score -= 4;
                    if (this.game.score < 0) this.game.score = 0;
                    if (this.game.lives > 0) this.setState(6, 0);
                    else this.setState(7, 0);
                }
            }
        });
    }
}
