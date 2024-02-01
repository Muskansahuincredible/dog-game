import { Dust, Fire, Splash } from "./particles.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
    KO: 7,
}

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game){
        super("SITTING", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 5;
        this.game.player.maxFrame = 4;
    }
    handleInput(input){
        if (input.includes("ArrowLeft") || input.includes("ArrowRight")){
            this.game.player.setState(states.RUNNING, this.game.player.gameSpeed);
        }
        else if (input.includes("Control") && !this.game.energyBar.outOfEnergy) {
            this.game.player.setState(states.ROLLING, this.game.player.gameSpeed * 2);
        }
    }
}

export class Running extends State {
    constructor(game){
        super("RUNNING", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 3;
        this.game.player.maxFrame = 8;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width/4, this.game.player.y + this.game.player.height/1.2));
        if (input.includes("ArrowDown")){
            this.game.player.setState(states.SITTING, 0);
        }
        else if (input.includes("ArrowUp")){
            this.game.player.setState(states.JUMPING, this.game.player.gameSpeed);
        }
        else if (input.includes("Control") && !this.game.energyBar.outOfEnergy) {
            this.game.player.setState(states.ROLLING, this.game.player.gameSpeed * 2);
        }
    }
}

export class Jumping extends State {
    constructor(game){
        super("JUMPING", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 1;
        this.game.player.maxFrame = 6;
        if (this.game.player.onGround()) this.game.player.vy -= 25;
    }
    handleInput(input){
        if (this.game.player.vy > 0 && !input.includes("Control")){
            this.game.player.setState(states.FALLING, this.game.player.gameSpeed);
        }
        else if (input.includes("Control") && !this.game.energyBar.outOfEnergy) {
            this.game.player.setState(states.ROLLING, this.game.player.gameSpeed * 2);
        }
    }
}

export class Falling extends State {
    constructor(game){
        super("FALLING", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 2;
        this.game.player.maxFrame = 6;
    }
    handleInput(input){
        if (this.game.player.onGround()) this.game.player.setState(states.RUNNING, this.game.player.gameSpeed);
        else if (input.includes("ArrowDown")) {
            this.game.player.setState(states.DIVING, this.game.player.gameSpeed * 0);
        }
    }
}

export class Rolling extends State {
    constructor(game){
        super("ROLLING", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!input.includes("Control") && this.game.player.onGround()) this.game.player.setState(states.RUNNING, this.game.player.gameSpeed);
        else if (!input.includes("Control") && !this.game.player.onGround()) this.game.player.setState(states.FALLING, this.game.player.gameSpeed);
        else if (input.includes("Control") && input.includes("ArrowUp") && this.game.player.onGround()) this.game.player.vy -= 27;
        else if (input.includes("ArrowDown") && !this.game.player.onGround()) this.game.player.setState(states.DIVING, this.game.player.gameSpeed);
        if (this.game.energyBar.outOfEnergy && this.game.player.onGround()) this.game.player.setState(states.RUNNING, this.game.player.gameSpeed);
        if (this.game.energyBar.outOfEnergy && !this.game.player.onGround()) this.game.player.setState(states.FALLING, this.game.player.gameSpeed);
    } 
}

export class Diving extends State {
    constructor(game){
        super("DIVING", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 6;
        this.game.player.maxFrame = 6;
        this.game.player.vy = 15;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (this.game.player.onGround()){
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
            }
            this.game.player.setState(states.RUNNING, this.game.player.gameSpeed);
        }
        else if (input.includes("Control") && this.game.player.onGround() && !this.game.energyBar.outOfEnergy){
            this.game.player.setState(states.ROLLING, this.game.player.gameSpeed * 2);
        }
    } 
}

export class Hit extends State {
    constructor(game){
        super("HIT", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 4;
        this.game.player.maxFrame = 10;
    }
    handleInput(input){
        if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, this.game.player.gameSpeed);
        }
        else if (this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, this.game.player.gameSpeed);
        }
    } 
}

export class KO extends State {
    constructor(game){
        super("KO", game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.frameY = 8;
        this.game.player.maxFrame = 11;
    }
    handleInput(input){
    } 
}
