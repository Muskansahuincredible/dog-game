export class CollisionAnimation {
    constructor(game, x, y){
        this.game = game;
        this.image = collisionAnimation;
        this.spriteWidth = 100;
        this.spriteHeight = 90;
        this.sizeModifier = Math.random() + 0.5;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
        this.frameX = 0;
        this.maxFrame = 4;
        this.fps = Math.random() * 10 + 5;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltatime){
        this.x -= this.game.speed;
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            this.frameX++;
            if (this.frameX > this.maxFrame){
                this.markedForDeletion = true;
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltatime;
        }
    }
    draw(context){
        context.drawImage(this.image, this.spriteWidth * this.frameX, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}